from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqladmin import Admin
from pydantic import BaseModel, ConfigDict
from typing import List, Optional
import os
import shutil
import re
import json
from openai import OpenAI
from dotenv import load_dotenv

from database import engine, SessionLocal, Base
from models import Equipment, ServiceRequest
from admin import InventoryAdmin, ServiceRequestAdmin

load_dotenv()
NVIDIA_API_KEY = os.getenv("NVIDIA_API_KEY")

Base.metadata.create_all(bind=engine)
os.makedirs("uploaded_images", exist_ok=True)

app = FastAPI()

app.mount("/uploaded_images", StaticFiles(directory="uploaded_images"), name="uploaded_images")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

admin = Admin(app, engine)
admin.add_view(InventoryAdmin)
admin.add_view(ServiceRequestAdmin)

class EquipmentCreate(BaseModel):
    name: str
    description: str
    category: Optional[str] = None
    image_url: Optional[str] = None
    is_available: bool = True

class EquipmentResponse(BaseModel):
    id: int
    name: str
    description: str
    category: Optional[str] = None
    image_url: Optional[str] = None
    is_available: bool = True
    model_config = ConfigDict(from_attributes=True) 

class ChatMessage(BaseModel):
    message: str
    history: list = []

@app.get("/api/equipment", response_model=List[EquipmentResponse])
def get_all_equipment():
    db = SessionLocal()
    items = db.query(Equipment).all()
    db.close()
    return items

@app.post("/api/equipment", response_model=EquipmentResponse)
def add_equipment(equipment: EquipmentCreate):
    db = SessionLocal()
    new_item = Equipment(**equipment.model_dump())
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    db.close()
    return new_item

@app.post("/api/services")
def submit_service_request(
    request_type: str = Form(...),
    full_name: str = Form(...),
    facility: str = Form(...),
    email: str = Form(...),
    phone: str = Form(...),
    equipment_type: str = Form(...),
    equipment_model: Optional[str] = Form(None),
    location: Optional[str] = Form(None),
    quantity: Optional[str] = Form(None),
    condition_status: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    preferred_date: Optional[str] = Form(None),
    photo: Optional[UploadFile] = File(None)
):
    file_path = None
    if photo and photo.filename:
        file_path = f"uploaded_images/{photo.filename}"
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(photo.file, buffer)
            
    
    qty = None
    if quantity and quantity.isdigit():
        qty = int(quantity)

    db = SessionLocal()
    new_request = ServiceRequest(
        request_type=request_type,
        full_name=full_name,
        facility=facility,
        email=email,
        phone=phone,
        equipment_type=equipment_type,
        equipment_model=equipment_model,
        location=location,
        quantity=qty,
        condition_status=condition_status,
        description=description,
        preferred_date=preferred_date,
        photo_path=file_path
    )
    db.add(new_request)
    db.commit()
    db.refresh(new_request)
    db.close()
    return {"message": "Request submitted successfully!"}

# --- RESTORED REN AI ENDPOINT ---
@app.post("/api/support/chat")
def ai_support_chat(chat: ChatMessage):
    db = SessionLocal()
    items = db.query(Equipment).all()
    db.close()
    
    inventory_list = "\n".join([f"- {item.name} ({item.category}): {item.description} | Status: {'In Stock' if item.is_available else 'Currently Out of Stock'}" for item in items])
    
    system_prompt = f"""You are Ren, the AI Support Assistant for Renz Medical Equipment, created by Satoru Gojo. 
Help customers troubleshoot equipment, schedule service requests, provide product estimations, or check availability.

LIVE INVENTORY DATA:
{inventory_list}

RULES:
1. If anyone asks who made you, proudly state you were created by Satoru Gojo.
2. Never use database terms like True or False. Converse naturally using "In Stock" or "Currently Out of Stock".
3. Do NOT use markdown asterisks (**).
4. LIVE ESTIMATIONS: If a user asks for an estimation, quote, or details on an equipment model, do NOT ask for their contact info again. Provide a realistic estimated price range (e.g., PHP 500,000 - PHP 850,000) and explain 2-3 key features. ALWAYS conclude by saying exactly this: "Please note this is just a rough estimate. Our sales team frequently offers facility discounts, bundle deals, and flexible financing, so they will reach out with your exact quotation soon!"
5. If a user asks to schedule a Repair, PMS, or Refurbish, follow the STRICT SERVICE REQUEST CHECKLIST.

STRICT SERVICE REQUEST CHECKLIST (Only for Repair, PMS, Refurbish):
You are forbidden from generating the database save trigger until you have explicitly asked for and received ALL of the following 6 pieces of information from the user:
1. Full Name
2. Hospital / Facility Name
3. Email Address & Phone Number
4. Facility Location (Address)
5. Equipment Type & Model
6. Preferred Service Date

If any of these 6 fields are missing, ask the user for the missing piece.

CRITICAL DATABASE TRIGGER (Only for Repair, PMS, Refurbish):
ONLY when you have all 6 pieces of information for a service request, output your final confirmation message, and append this exact tag at the VERY END:
$$SAVE_JSON: {{"request_type": "Repair", "full_name": "...", "facility": "...", "email": "...", "phone": "...", "equipment_type": "...", "location": "...", "description": "...", "preferred_date": "..."}}$$"""

    conversation = [{"role": "system", "content": system_prompt}]
    
    for msg in chat.history:
        role = "assistant" if msg.get("sender") == "ai" else "user"
        conversation.append({"role": role, "content": msg.get("text", "")})
        
    conversation.append({"role": "user", "content": chat.message})

    client = OpenAI(
        base_url="https://integrate.api.nvidia.com/v1",
        api_key=NVIDIA_API_KEY
    )
    
    try:
        completion = client.chat.completions.create(
            model="deepseek-ai/deepseek-v4.1-flash",
            messages=conversation,
            temperature=0.8,
            max_tokens=800
        )
        
        reply = completion.choices[0].message.content
        
        if not reply:
            return {"reply": "I'm sorry, I didn't quite catch that. Could you please rephrase?"}
        
        save_match = re.search(r'\$\$SAVE_JSON:\s*(\{.*?\})\$\$', reply, re.DOTALL)
        if save_match:
            try:
                json_data = json.loads(save_match.group(1))
                if json_data.get("full_name") and json_data.get("email"):
                    db = SessionLocal()
                    new_request = ServiceRequest(
                        request_type=json_data.get("request_type", "AI Chat Request"),
                        full_name=json_data.get("full_name"),
                        facility=json_data.get("facility"),
                        email=json_data.get("email"),
                        phone=json_data.get("phone"),
                        equipment_type=json_data.get("equipment_type"),
                        location=json_data.get("location"),
                        preferred_date=json_data.get("preferred_date"),
                        description=f"AI CHAT LOG: {json_data.get('description', '')}"
                    )
                    db.add(new_request)
                    db.commit()
                    db.close()
            except Exception as e:
                print("JSON Parsing Error:", e)

        if "$$SAVE_JSON" in reply:
            reply = reply.split("$$SAVE_JSON")[0].strip()

        return {"reply": reply}
        
    except Exception as e:
        print("AI ERROR:", str(e))
        return {"reply": "I'm having trouble connecting to my knowledge base right now. Please try again or submit a service request form."}