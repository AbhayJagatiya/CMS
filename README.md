# 🎓 College Management System (CMS)

<p align="center">
  <b>A Modern Full-Stack College Management Platform</b><br>
  Built with scalability, security, analytics, and enterprise-level architecture.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/JWT-Authentication-orange?style=for-the-badge" />
</p>

---

# 📖 Overview

The **College Management System (CMS)** is a production-ready full-stack web application developed to automate and simplify college administration workflows.

The platform provides:

- 🔐 Secure Role-Based Authentication
- 📚 Student & Course Management
- 📅 Smart Attendance Tracking
- 💳 Dynamic Fees Management
- 📊 Analytics Dashboard
- ⚡ Fast & Scalable APIs
- 🧩 Enterprise-Level Modular Architecture

This project demonstrates real-world backend engineering practices, scalable frontend development, and secure API design using modern technologies.

---

# 👨‍💻 Team Falcon001 🦅

| Name | 
|------|
| Abhay Jagatiya | 
| Charitarth | 
| Vansh | 
| Nandani | 

---

# 🔥 Key Features

---

## 🔐 Authentication & Security

- JWT-based Authentication
- Secure Password Hashing
- Protected APIs
- Session Management
- Secure Role Validation

---

## 🎭 Role-Based Access Control (RBAC)

The system follows a strict permission-based architecture.

### 👥 Available Roles

| Role | Responsibilities |
|------|------------------|
| 👑 Admin | Full system authority |
| 🎓 Student | Student-related operations |
| 📅 Attendance | Attendance management |
| 💳 Fees | Financial operations |
| 📚 Course | Course management |

### 🔒 Security Highlights

- Middleware-based authorization
- Dynamic permission validation
- Unauthorized access prevention
- Protected API routes

---

# 📅 Smart Attendance System

- One-click attendance marking
- Attendance history tracking
- Daily logs
- Date-wise filtering
- Multi-course support
- Auto-absent logic

---

# 💳 Fees & Financial Management

- Dynamic fee calculations
- Paid / Pending fee tracking
- Transaction history
- Payment status monitoring
- Due date management
- Payment method tracking

---

# 📊 Analytics Dashboard

### Dashboard includes:

- 📈 Monthly analytics
- 💰 Fee collection insights
- 👨‍🎓 Student statistics
- 🏆 Top performer tracking
- 📅 Attendance trends
- ⚡ Real-time counters

---

# 🧠 Backend Engineering Highlights

- Modular architecture
- Service-based backend structure
- Scalable API ecosystem
- Shared centralized database
- High-performance FastAPI backend
- SQLAlchemy ORM integration
- Clean separation of concerns

---

# 🏗️ System Architecture

## 🔄 Workflow Architecture

> Add your backend architecture image inside the repository and keep its name as `architecture.png`

<p align="center">
  <img src="./architecture.png" alt="Architecture Diagram" width="100%">
</p>

---

## 🧩 Backend Architecture Pattern

```bash
Routes → Services → Models → Database
```

### 📌 Architecture Explanation

| Layer | Purpose |
|---|---|
| Routes | Handles API endpoints and incoming requests |
| Services | Contains business logic and processing |
| Models | Defines database tables and schemas |
| Database | Stores all application data centrally |

This architecture improves:

- Scalability
- Maintainability
- Readability
- Performance
- Code Reusability

---

# 📂 Project Structure

```bash
CMS/
│
├── backend/                         # FastAPI Backend Server
│   │
│   ├── app/                         # Main backend application
│   │   │
│   │   ├── auth/                    # JWT authentication & authorization logic
│   │   ├── admin/                   # Admin control modules
│   │   ├── attendance/              # Attendance management APIs
│   │   ├── students/                # Student-related operations
│   │   ├── fees/                    # Financial & fee management system
│   │   ├── courses/                 # Course management module
│   │   ├── models/                  # SQLAlchemy database models
│   │   ├── services/                # Business logic layer
│   │   └── utils/                   # Helper functions & utilities
│   │
│   ├── requirements.txt             # Python dependencies
│   ├── seed.py                      # Inserts initial demo/admin data
│   ├── main.py                      # Main FastAPI application entry point
│   └── .env                         # Environment configuration
│
├── frontend/                        # React Frontend Application
│   │
│   ├── src/                         # Main frontend source code
│   │   │
│   │   ├── components/              # Reusable UI components
│   │   ├── pages/                   # Application pages & dashboards
│   │   ├── services/                # API calling functions
│   │   ├── assets/                  # Images, icons & static files
│   │   ├── hooks/                   # Custom React hooks
│   │   └── context/                 # Global state management
│   │
│   ├── package.json                 # Node.js dependencies
│   ├── vite.config.js               # Vite configuration
│   └── tailwind.config.js           # TailwindCSS configuration
│
├── architecture.png                 # System architecture diagram
└── README.md                        # Project documentation
```

---

# ⚙️ Tech Stack

## 🎨 Frontend

- React.js
- Vite
- Tailwind CSS
- Axios

---

## ⚡ Backend

- FastAPI
- SQLAlchemy
- JWT Authentication
- Pydantic

---

## 🗄️ Database

- PostgreSQL

---

# 🛠️ Installation & Setup

---

# 📦 Prerequisites

Make sure you have installed:

- Python 3.9+
- Node.js 18+
- PostgreSQL

---

# 🔌 Backend Setup

## 1️⃣ Clone Repository

```bash
git clone https://github.com/charitarth2636/CMS.git
cd CMS/backend
```

---

## 2️⃣ Create Virtual Environment

### Windows

```bash
python -m venv venv
venv\Scripts\activate
```

### Mac/Linux

```bash
python -m venv venv
source venv/bin/activate
```

---

## 3️⃣ Install Dependencies

```bash
pip install -r requirements.txt
```

---

## 4️⃣ Configure Environment Variables

Create a `.env` file:

```env
DATABASE_URL=your_postgresql_url
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

---


## 5️⃣ Run Backend Server

```bash
uvicorn main:app --reload
```

---

# 💻 Frontend Setup

## 1️⃣ Navigate to Frontend

```bash
cd ../frontend
```

---

## 2️⃣ Install Dependencies

```bash
npm install
```

---

## 3️⃣ Start Frontend

```bash
npm run dev
```

---

# 🌐 API Documentation

FastAPI automatically generates API documentation.

| Documentation | URL |
|---|---|
| Swagger UI | `http://127.0.0.1:8000/docs` |
| ReDoc | `http://127.0.0.1:8000/redoc` |

---

# 🚀 API Ecosystem

| Endpoint | Description |
|---|---|
| `/auth` | Authentication & JWT |
| `/students` | Student Management |
| `/attendance` | Attendance Operations |
| `/courses` | Course Management |
| `/fees` | Fees & Transactions |
| `/admin` | Admin Control |
| `/faculty` | Faculty Management |

---

# 🔐 Default Credentials

| Role | Email | Password |
|---|---|---|
| ADMIN | admin@gmail.com | Admin123 |
| STUDENT | student@gmail.com | Student123 |
| ATTENDANCE | attendance@gmail.com | Attendance123 |
| COURSE | course@gmail.com | Course123 |
| FEES | fees@gmail.com | Fees123 |

---

# 📈 Performance & Quality Standards

✅ Enterprise-grade Architecture  
✅ Production-ready APIs  
✅ Clean Code Principles  
✅ Fast Frontend Rendering  
✅ Scalable Backend Design  
✅ Responsive UI  
✅ Modular Development Approach  

---

# 🔮 Future Enhancements

- 📱 Mobile Application
- ☁️ Cloud Deployment
- 📊 Advanced Analytics
- 🔔 Real-Time Notifications
- 📁 File Upload System
- ⚡ WebSocket Integration
- 🤖 AI-Based Insights

---

# 🤝 Contribution

Contributions are welcome.

```bash
Fork the repository
Create your feature branch
Commit your changes
Push to the branch
Create a Pull Request
```

---

# 📜 License

This project is developed for educational and learning purposes.

---

# ⭐ Final Note

This project demonstrates:

- Real-world Full-Stack Engineering
- Enterprise Backend Architecture
- Secure RBAC Implementation
- Scalable System Design
- Production-Level Development Standards

---

<p align="center">
  <b>Developed with ❤️ by Team Falcon001</b>
</p>
