from sqlalchemy import Column, Integer, String, Boolean, Text
from database import Base 

# TO HOLD THE FUCKING EQUIPMENT
class Equipment(Base):
    __tablename__ = "equipment"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    description = Column(Text)
    category = Column(String)
    image_url = Column(String)
    is_available = Column(Boolean, default=True)

# Table to hold all form submissions
class ServiceRequest(Base):
    __tablename__ = "service_requests"

    id = Column(Integer, primary_key=True, index=True)
    request_type = Column(String) # Will store "Repair", "PMS", or "Refurbish"
    
    # Contact Info
    full_name = Column(String)
    facility = Column(String)
    email = Column(String)
    phone = Column(String)
    
    # Equipment Info
    equipment_type = Column(String)
    equipment_model = Column(String, nullable=True)
    location = Column(String, nullable=True)
    quantity = Column(Integer, nullable=True)
    
    # Request Details
    condition_status = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    preferred_date = Column(String, nullable=True)

    #img baby
    photo_path = Column(String, nullable=True)