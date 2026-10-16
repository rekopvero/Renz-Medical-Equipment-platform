from database import engine, SessionLocal, Base
from models import Equipment

def seed_database():
    
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    real_equipment = [
        {"name": "Autoclave Model A", "category": "autoclave", "image_url": "images/autoclave.png", "description": "A device that uses pressurized saturated steam to sterilize reusable instruments, laboratory glassware, and other compatible materials.", "is_available": True},
        {"name": "Autoclave Model B", "category": "autoclave", "image_url": "images/autoclave-2.png", "description": "A steam sterilizer designed for sterilizing compatible medical instruments and equipment.", "is_available": True},
        {"name": "Anesthesia Machine Model A", "category": "anesthesia", "image_url": "images/anesthesia-1.png", "description": "An anesthesia machine used by trained healthcare professionals to deliver and manage anesthetic gases during medical procedures.", "is_available": True},
        {"name": "Anesthesia Machine Model B", "category": "anesthesia", "image_url": "images/anesthesia-2.png", "description": "An anesthesia machine designed to support anesthesia delivery and patient monitoring during medical procedures.", "is_available": True},
        {"name": "OR Table Model A", "category": "table", "image_url": "images/table-1.png", "description": "An operating room table designed to support patient positioning during surgical procedures.", "is_available": True},
        {"name": "OR Table Model B", "category": "table", "image_url": "images/table-2.png", "description": "An operating room table designed to accommodate different patient positions during surgical procedures.", "is_available": True},
        {"name": "Cardiac Monitor Model A", "category": "cardiac", "image_url": "images/cardiac-1.png", "description": "A medical monitoring device used by healthcare professionals to observe a patient's heart rate and other vital signs.", "is_available": True},
        {"name": "Cardiac Monitor Model B", "category": "cardiac", "image_url": "images/cardiac-2.png", "description": "A patient monitoring device designed to display cardiac activity and help healthcare professionals monitor vital signs.", "is_available": True},
        {"name": "Defibrillator Model A", "category": "defib", "image_url": "images/defib-1.png", "description": "A medical device used by trained healthcare professionals to deliver a controlled electrical shock when indicated to help treat certain life-threatening heart rhythm problems.", "is_available": True},
        {"name": "Defibrillator Model B", "category": "defib", "image_url": "images/defib-2.png", "description": "A defibrillator designed to support emergency cardiac care by delivering electrical therapy when indicated.", "is_available": True}
    ]

    for item in real_equipment:
        new_item = Equipment(**item)
        db.add(new_item)
            
    db.commit()
    db.close()
    print("Database re-seeded with images and categories!")

if __name__ == "__main__":
    seed_database()