# 🎓 College Management System (CMS)

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

> A sophisticated, enterprise-grade College Management System designed to streamline administrative tasks, enhance faculty productivity, and provide students with a seamless academic experience.

---

## 👥 Team falcoon_001 🦅

- Abhay
- Charitarth
- Vansh
- Nandani

---

## ✨ Core Features

### 🏛️ Administration

- **Dashboard Analytics**: Real-time visualization of college metrics.
- **Role Management**: Granular control over permissions for Admin, Faculty, and Students.
- **Resource Tracking**: Centralized management of college assets.

### 🍎 Academic Management

- **Student Lifecycle**: From enrollment to graduation tracking.
- **Attendance System**: Interactive and automated attendance logging.
- **Course Catalog**: Dynamic course and curriculum management.

### 💰 Financials

- **Fees Management**: Transparent fee structures and transaction history.
- **Automated Alerts**: Notification system for pending dues and schedules.

---

## 📂 Project Structure

```text
CMS/
├── backend/                # FastAPI Application
│   ├── app/                # Core logic & routes
│   │   ├── admin/          # Faculty & Admin services
│   │   ├── auth/           # JWT & Bcrypt security
│   │   ├── students/       # Student management
│   │   └── ...             # Other modules
│   ├── requirements.txt    # Python dependencies
│   └── seed.py             # Database initialization script
├── frontend/               # React (Vite) Application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # Global state management
│   │   ├── pages/          # View transitions & layouts
│   │   └── lib/            # API & external utilities
│   └── package.json        # Node.js dependencies
└── README.md               # You are here!
```

---

## 🛠️ Installation & Setup

### 📦 Prerequisites

- **Node.js** (v18 or higher)
- **Python** (v3.9 or higher)
- **PostgreSQL** running locally

### 🔌 Backend (FastAPI)

1. **Navigate & Environment**:
   ```bash
   cd backend
   python -m venv venv
   # Windows: venv\Scripts\activate | Unix: source venv/bin/activate
   ```
2. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```
3. **Database Config**:
   Create a `.env` in `backend/` and add:
   ```env
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/college_db"
   SECRET_KEY="YOUR_SUPER_SECRET_KEY"
   ```
4. **Seed & Launch**:
   ```bash
   python seed.py
   python -m uvicorn app.main:app --reload
   ```

### 💻 Frontend (React + Vite)

1. **Navigate**:
   ```bash
   cd frontend
   ```
2. **Install & Run**:
   ```bash
   npm install
   npm run dev
   ```

---

## 🌐 API Documentation

Once the backend is running, you can explore the interactive API docs:

- **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Redoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

## 🔒 Security & Standards

- **Authentication**: Stateless JWT token-based authentication.
- **Hashing**: Industry-standard Bcrypt for password security.
- **Clean Code**: Follows PEP8 for Python and ESLint for JavaScript.

---

_Built with ❤️ by team falcoon_001. For inquiries, please contact the repository owners._
