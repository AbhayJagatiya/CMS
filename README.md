# <align="center">🎓 College Management System (CMS)</align>

<p align="center">
  <img src="https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi" alt="FastAPI" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
</p>

---

## 📖 Overview

**CMS (College Management System)** is a robust, enterprise-grade platform designed for modern educational institutions. It simplifies complex administrative tasks, automates student tracking, and provides real-time financial insights through a sophisticated dashboard.

---

## 👥 Meet Team falcoon_001 🦅

- **Abhay**
- **Charitarth**
- **Vansh**
- **Nandani**

---

## 🔥 Key Modules & Features

### 🔐 1. Security & Role-Based Access (RBAC)

- **Multi-Role Login**: Dedicated portals for **Admin** and **Faculty**.
- **Industry Standards**: Secure password hashing via **Bcrypt** and stateless authentication using **JWT Tokens**.
- **Protected Routes**: Granular permission control ensuring that data remains secure and accessible only to authorized roles.

### 📅 2. Advanced Attendance Tracking

- **Interactive Daily Logs**: Faculty can mark attendance with a single click using a smart "Toggle" mechanism.
- **Auto-Absent Logic**: Intelligent backend queries that automatically list all students and default their status until updated.
- **History & Trends**: View detailed attendance calendars for individual students.

### 💰 3. Financial & Fees Management

- **Real-Time Calculation**: Dynamic calculation of _Paid_, _Pending_, and _Credit_ balances for every student.
- **Payment History**: Comprehensive reporting of transaction dates, amounts, and payment methods (Cash, Online, etc.).
- **Deadlines**: Course-specific due dates with automated status updates (Paid/Pending).

### 📊 4. Analytical Dashboard

- **Live Stats**: Instant counters for Student enrollment, Active courses, and Total collection.
- **Visual Trends**: Charts showing monthly attendance performance and fee collection growth.
- **Top Performers**: Automatic ranking of students based on academic presence.

---

## 📂 Project Structure

```bash
CMS/
├── backend/                # FastAPI Core Application
│   ├── app/                # Main logic (Auth, Admin, Fees, etc.)
│   ├── requirements.txt    # Python environments
│   └── start_server.py     # Entry point script
├── frontend/               # React + Vite Application
│   ├── src/                # UI source code
│   │   ├── components/     # Reusable logic components
│   │   └── pages/          # Admin & Faculty dashboards
│   └── package.json        # Node dependency manifest
└── README.md               # Project documentation
```

---

## 🛠️ Installation & Setup

### 📦 Prerequisites

- **Python 3.9+** & **Node.js 18+**
- **PostgreSQL** (Database)

### 🔌 Backend Setup

1. **Prepare Environment**:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows use: venv\Scripts\activate
   ```
2. **Install & Initialize**:
   ```bash
   pip install -r requirements.txt
   python seed.py           # Injects initial admin & sample data
   ```
3. **Connect Database**:
   Update your `.env` file with your PostgreSQL credentials.

### 💻 Frontend Setup

1. **Launch App**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

---

## 🌐 API Documentation

Explore our interactive API blueprints:

- **Swagger Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Redoc Docs**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## 🛡️ Standards & Quality

- **Performance**: Built with **Vite** for ultra-fast frontend rendering.
- **Scalability**: Backend designed with **FastAPI** for high concurrency.
- **Clean Code**: Adheres strictly to **PEP 8** (Python) and modern **React hooks** patterns.

---

<p align="center">
  <i>Developed with ❤️ for excellence in Education Technology.</i><br>
  <strong>Team falcoon_001</strong>
</p>
