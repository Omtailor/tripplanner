<div align="center">

<br/>

<img src="https://img.shields.io/badge/✈️-TripPlanner-4f8ef7?style=for-the-badge&labelColor=0d0d1a&color=4f8ef7" alt="TripPlanner" height="40"/>

<h1>TripPlanner</h1>

<p><strong>AI-powered travel itinerary planner — personalized, instant, beautiful.</strong></p>

<p>
  <a href="https://tripplanner-tawny.vercel.app" target="_blank">
    <img src="https://img.shields.io/badge/🌐 Live Demo-Visit Now-4f8ef7?style=for-the-badge&labelColor=0d0d1a" alt="Live Demo"/>
  </a>
  &nbsp;
  <a href="https://www.linkedin.com/in/om-tailor-ba72b8310/" target="_blank">
    <img src="https://img.shields.io/badge/LinkedIn-Om%20Tailor-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn"/>
  </a>
</p>

<p>
  <img src="https://img.shields.io/badge/Django-6.0-092E20?style=flat-square&logo=django&logoColor=white"/>
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black"/>
  <img src="https://img.shields.io/badge/PostgreSQL-Neon-4169E1?style=flat-square&logo=postgresql&logoColor=white"/>
  <img src="https://img.shields.io/badge/Gemini-API-8E75B2?style=flat-square&logo=google&logoColor=white"/>
  <img src="https://img.shields.io/badge/Pydantic-v2-E92063?style=flat-square&logo=pydantic&logoColor=white"/>
</p>

<br/>

</div>

***

## 📸 Screenshots

<br/>

**🔐 Auth Page** — Animated crossfading travel backgrounds with glassmorphism card

<img src="https://github.com/user-attachments/assets/72a82e90-f795-4f26-8072-06f1226621a8" alt="Auth Page" width="100%"/>

<br/><br/>

**🏠 Dashboard** — "Where to next?" search with live generation quota indicator

<img src="https://github.com/user-attachments/assets/9bba3738-c239-4fa9-8768-de7b0d351978" alt="Dashboard" width="100%"/>

<br/><br/>

**🧭 Trip Wizard** — Guided 6-step planner (Dates → Budget → Vibe → Origin → Meals → Group)

<img src="https://github.com/user-attachments/assets/b46591be-2a0c-4069-a810-88899f30ac1c" alt="Step Wizard" width="100%"/>

<br/><br/>

**🗺️ Itinerary Page** — Full day-by-day breakdown with meals, activities, and per-day regeneration

<img src="https://github.com/user-attachments/assets/89b6efbd-886c-4d82-a8df-52c54754447b" alt="Itinerary Page" width="100%"/>

<br/><br/>

**💰 Cost Breakdown** — Visual bar chart per category with grand total

<img src="https://github.com/user-attachments/assets/9bba3738-c239-4fa9-8768-de7b0d351978" alt="Cost Breakdown" width="100%"/>

<br/><br/>

**🗂️ Travel History** — All past trips with destination, dates, group, and budget tags

<img src="https://github.com/user-attachments/assets/ef6aa635-e65b-4905-88cb-1d339d32b7e6" alt="History Page" width="100%"/>

<br/>

***

## ✨ Features

### 🧠 AI Generation
- **Gemini API** generates fully personalized, day-by-day itineraries covering meals, activities, accommodation, and local tips
- **Pydantic v2** validates every AI response — malformed or incomplete outputs never reach the user
- **Per-day regeneration** — refresh any single day independently; AI ensures uniqueness and contextual consistency with the rest of the trip
- **Retry logic** — if validation fails, the system automatically retries Gemini rather than surfacing a broken response

### 🧭 6-Step Trip Wizard

```
 Dates → Budget → Vibe → Origin → Meals → Group → Summary
```

| Step | What you choose |
|------|----------------|
| 📅 Dates | Start and end date of your trip |
| 💰 Budget | Low / Mid / High |
| ✨ Vibe | Chill & Relax / Adventure / Cultural / Bit of Everything |
| 📍 Origin | Your departure city (for intercity travel cost estimation) |
| 🍽️ Meals | Veg / Non-Veg |
| 👥 Group | Solo / Couple / Friends / Family |
| ✅ Summary | Review and edit everything before generating |

### ⚡ Performance & Rate Limiting
- **Database-backed** rate limiting enforces **5 generations/day** and **10 per-day regenerations/day** per user
- Generation quota shown live in the dashboard navbar (`⚡ 4/5 left`)
- Animated loading screen with rotating travel copy during generation

### 📊 Trip Dashboard
- Cost breakdown **bar chart** per category — Intercity, Local Transport, Stay, Food, Activities
- Estimated **grand total** displayed prominently (always equals exact sum of day totals)
- **Travel tips** section at the bottom of every itinerary
- **Export to PDF** button on every itinerary

### 🗂️ History & Export
- Full trip history with destination, dates, group type, and budget tags
- Revisit any past itinerary instantly
- **Export itinerary to PDF**
- Delete trips from history

### 🔐 Authentication
- JWT-based auth (access + refresh tokens with rotation)
- Sign In / Sign Up with animated crossfading background (5 travel images)
- Password visibility toggle with 3-second auto-hide

***

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Django 6, Django REST Framework |
| **Frontend** | React 18, Framer Motion, Vite |
| **Database** | PostgreSQL (Neon) |
| **AI** | Google Gemini API (`gemini-2.5-flash`) |
| **Validation** | Pydantic v2 |
| **Auth** | JWT — djangorestframework-simplejwt |
| **Static Files** | Whitenoise |
| **Deployment** | Render (backend) + Vercel (frontend) |

***

## 🚀 Local Setup

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL

### 1. Clone the repo

```bash
git clone https://github.com/Omtailor/tripplanner.git
cd tripplanner
```

### 2. Backend setup

```bash
# Create and activate virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file and fill in your values
cp .env.example .env

# Run migrations
python manage.py migrate

# Start the server
python manage.py runserver
```

### 3. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# Django
SECRET_KEY=your_django_secret_key
DEBUG=True

# Database
DB_NAME=tripplanner
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=your_db_host
DB_PORT=5432

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
GEMINI_TIMEOUT_SECONDS=90

# CORS & Hosts
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173
CSRF_TRUSTED_ORIGINS=http://localhost:5173
```

***

## 📁 Project Structure

```
tripplanner/
├── accounts/                   # Auth — JWT login, signup, custom user model
├── itinerary/                  # Core app
│   ├── gemini_service.py       # Prompt builder + Gemini API calls + retry logic
│   ├── schemas.py              # Pydantic v2 validation models
│   ├── validators.py           # Database-based rate limiting
│   ├── views.py                # API endpoints
│   ├── serializers.py          # DRF serializers
│   ├── models.py               # Trip & itinerary DB models
│   └── urls.py                 # URL routing
├── config/                     # Django settings, URLs, WSGI
├── frontend/                   # React app (Vite + Framer Motion)
│   └── src/
│       ├── pages/              # Auth, Dashboard, Planner, Itinerary, History
│       ├── components/         # Reusable UI components
│       ├── context/            # Auth context
│       ├── hooks/               # Custom React hooks
│       └── api/                # Axios API layer
├── requirements.txt
├── procfile                    # Deployment process file
└── railway.json
```

***

## 🔒 Rate Limiting Logic

Enforced via **database-tracked counters** — reset daily:

| Action | Limit | Reset |
|--------|-------|-------|
| New itinerary generations | **5 per day** per user | Midnight (24h) |
| Per-day regenerations | **10 per day** per user | Midnight (24h) |

***

## 🧩 AI Response Validation

Every Gemini response is parsed and validated against a strict **Pydantic v2 schema** before being stored or returned:

- ✅ All required fields — days, meals, activities, costs — must be present
- ✅ Cost fields are always numeric and internally consistent
- ✅ `grand_total_inr` is always recomputed server-side from day totals (never trusted from Gemini)
- ✅ Intercity cost is always computed server-side (never trusted from Gemini)
- ✅ Activity times normalized to 24-hour `HH:MM` format
- ✅ All dates overwritten server-side — Gemini never controls dates
- ✅ On validation failure → **auto-retry** up to 2 times before raising an error

***

## 📦 Deployment

| Service | Provider | Notes |
|---------|----------|-------|
| Frontend | **Vercel** | Auto-deploys on push |
| Backend | **Render** | Gunicorn + Whitenoise |
| PostgreSQL | **Neon** | Free tier, SSL required |

***

## 👤 Author

**Om Tailor** — AIML Student, Mumbai



***

<div align="center">
  <sub>Built with ❤️ and too many Gemini API calls</sub>
</div>
