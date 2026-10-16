from sqladmin import ModelView
from markupsafe import Markup
from models import Equipment, ServiceRequest

try:
    from sqladmin.filters import StaticValuesFilter
    REQUEST_TYPE_FILTERS = [
       StaticValuesFilter(
            ServiceRequest.request_type,
            [("Message", "Message"), ("Quote", "Quote"), 
             ("Equipment Request", "Equipment Request"),
             ("Repair", "Repair"), ("PMS", "PMS"), ("Refurbish", "Refurbish")],
            title="Request Type",
        )
    ]
except Exception:
    REQUEST_TYPE_FILTERS = []

class InventoryAdmin(ModelView, model=Equipment):
    column_list = [Equipment.id, Equipment.name, Equipment.category, Equipment.is_available]
    name_plural = "Medical High Grade Equipment"

class ServiceRequestAdmin(ModelView, model=ServiceRequest):
    name_plural = "Customer Service Requests"
    can_create = False
    can_edit = True         
    can_delete = True
    
    column_list = [
        ServiceRequest.id, 
        ServiceRequest.request_type, 
        ServiceRequest.facility, 
        ServiceRequest.full_name,
        ServiceRequest.photo_path
    ]
    
    column_filters = REQUEST_TYPE_FILTERS

    column_formatters = {
        ServiceRequest.photo_path: lambda model, a: Markup(
            f'<a href="/{model.photo_path}" target="_blank" style="color: #1D546C; font-weight: bold; text-decoration: underline;">🖼️ View Photo</a>'
        ) if model.photo_path else "No Photo"
    }