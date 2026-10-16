# 🏥 Renz Medical Equipment Platform

An enterprise-grade, AI-integrated web platform built for Renz Medical Enterprises. Features an AI sales and support assistant named **Ren** (powered by NVIDIA Nemotron-3.5), dynamic quote and equipment request workflows, custom branded popups, and an automated SQLAdmin management portal.

---

## ✨ Features

- **🤖 AI Assistant ("Ren")**: Integrates with NVIDIA deepseek-v4.1-flash to provide live pricing estimations, explain medical equipment specifications, and automatically collect structured service requests.
- ** Service Request System**: Specialized workflows for **Repair**, **Preventive Maintenance Service (PMS)**, and **Refurbishment** with image upload support.
- ** Equipment & Quote Requests**: Dynamic forms that capture custom customer requirements and route them directly to the admin backend.
- ** Custom Branded UI**: Unified modal dialog system replacing browser alerts for a polished, professional client experience.
- **🛠️ SQLAdmin Dashboard**: Admin panel with static filtering by request types (`Message`, `Quote`, `Equipment Request`, `Repair`, `PMS`, `Refurbish`).

---

## 🛠️ Tech Stack

- **Backend**: Python, FastAPI, SQLAdmin, SQLAlchemy, `python-dotenv`
- **Database**: PostgreSQL
- **AI Infrastructure**: NVIDIA Nemotron (`deepseek-ai/deepseek-v4.1-flash`) via OpenAI API SDK
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)

---

## 📁 Repository Structure

```
HTML WEB FINAL/
├── BACKBASE_renz/          # FastAPI Backend Application
│   ├── admin.py            # SQLAdmin model views & request filters
│   ├── database.py         # SQLAlchemy engine setup
│   ├── main1.py            # FastAPI endpoints, routes, and Ren AI logic
│   ├── models.py           # Database schemas
│   ├── seed.py             # Database seed script for inventory
│   ├── .env.example        # Environment variable template
│   └── uploaded_images/    # User-uploaded service request photos
├── images/                 # Static brand assets and UI icons
├── index.html              # Home page
├── hellAI.html             # Ren AI Chat Support interface
├── request-quote.html      # Quotation request page
├── request-equipment.html  # Equipment request form page
├── script.js               # Frontend handlers and popup managers
├── style.css               # Application stylesheet
└── .gitignore              # Protects secrets (.env) and local build files
