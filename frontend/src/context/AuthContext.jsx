import { createContext, useContext, useState } from 'react';
import api from '../lib/api';

const AuthContext = createContext();

// Map backend role → frontend role key used for routing
const ROLE_MAP = {
  ADMIN: "admin",
  STUDENT_MANAGER: "faculty-1",
  ATTENDANCE_MANAGER: "faculty-2",
  COURSE_MANAGER: "faculty-3",
  FEES_MANAGER: "faculty-4",
};

// Map backend role → human-readable module name
const MODULE_MAP = {
  STUDENT_MANAGER: "Student Management",
  ATTENDANCE_MANAGER: "Attendance Management",
  COURSE_MANAGER: "Course Management",
  FEES_MANAGER: "Fees Management",
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  // Login via backend API
  const login = async (email, password, selectedRole) => {
    try {
      const res = await api.post('/auth/login', {
        email: email.toLowerCase(),
        password,
        role: selectedRole, // "ADMIN" or "FACULTY"
      });

      const data = res.data; // { access_token, token_type, role }

      const frontendRole = ROLE_MAP[data.role] || "admin";
      const userData = {
        email: data.email,
        role: frontendRole,
        backendRole: data.role,
        name: data.name,
        token: data.access_token,
      };

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return { success: true, role: frontendRole };
    } catch (err) {
      const errorMsg = err.response?.data?.detail || "Invalid credentials or server error";
      return { success: false, error: errorMsg };
    }
  };

  const getToken = () => user?.token || null;

  const updateUser = (data) => {
    setUser(prev => {
      const updated = { ...prev, ...data };
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, getToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
