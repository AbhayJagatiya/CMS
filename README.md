# College Management System (CMS)

A professional, comprehensive web-based platform for managing college operations, including student tracking, attendance, and financial management.

## 👥 Team: falcoon_001

- **Abhay**
- **Charitarth**
- **Vansh**
- **Nandani**

---

## 🚀 Features

- **Student Management**: End-to-end student lifecycle management.
- **Attendance System**: Robust tracking of student presence and reporting.
- **Fees Management**: Automated fee collection, tracking, and history.
- **Role-Based Access Control (RBAC)**: Secure access for Admins, Faculty, and Students.
- **Dashboard Analytics**: Real-time insights and visualization for administrators.

## 🛠️ Tech Stack

- **Frontend**: React.js with [Vite](https://vitejs.dev/)
- **Backend**: [FastAPI](https://fastapi.tiangolo.com/) (Python)
- **Database**: PostgreSQL
- **Styling**: Tailwind CSS & Modern UI Components

---

## 📋 Installation & Setup

### Prerequisites
- Node.js (v18+)
- Python (v3.9+)
- PostgreSQL

### 1. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure environment variables:
   - Create a `.env` file in the `backend/` directory.
   - Add your database connection string:
     ```env
     DATABASE_URL="postgresql://user:password@localhost:5432/college_db"
     SECRET_KEY="your_secret_key"
     ```
5. Seed the database:
   ```bash
   python seed.py
   ```
6. Start the server:
   ```bash
   python -m uvicorn app.main:app --reload
   ```

### 2. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

---

## 🌐 API Base URL
The backend API service is hosted locally at:
**[http://localhost:8000](http://localhost:8000)**

## 🔒 Security
- Password hashing using `bcrypt`.
- JWT-based authentication for all protected routes.
- Environment variables for sensitive configuration.

---

*Prepared for production deployment by team falcoon_001.*
