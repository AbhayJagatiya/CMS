import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '../lib/api';

const AdminDataContext = createContext();

export const AdminDataProvider = ({ children }) => {
  const { user, getToken } = useAuth();
  const role = user?.backendRole || '';

  // Faculties → loaded from backend API
  const [faculties, setFaculties] = useState([]);
  const [facultiesLoading, setFacultiesLoading] = useState(true);

  const refreshFaculties = async () => {
    try {
      const res = await api.get('/faculty/');
      setFaculties(res.data || []);
    } catch (err) {
      console.error('[AdminDataContext] Failed to fetch faculties:', err);
    } finally {
      setFacultiesLoading(false);
    }
  };

  useEffect(() => { 
    if (role === 'ADMIN') refreshFaculties(); 
  }, [role]);

  // Helper: map backend student shape → frontend shape used by all components
  const mapStudent = (s) => ({
    id: s.id,                          
    studentId: s.student_id || s.id,
    name: s.name || 'Unknown',
    email: s.email || '',
    phone: s.phone || '',
    institute: s.Institude || '',
    course: s.course || '',
    admissionDate: s.admission_date || '', 
    status: s.status || 'Active',
    address: s.address || '',
    avatar: `https://i.pravatar.cc/150?u=${s.email || s.id}`,
  });

  // Students → loaded from backend API
  const [students, setStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(true);

  const refreshStudents = async () => {
    try {
      const res = await api.get('/students/');
      setStudents((res.data || []).map(mapStudent));
    } catch (err) {
      console.error('[AdminDataContext] Failed to fetch students:', err);
    } finally {
      setStudentsLoading(false);
    }
  };

  useEffect(() => { 
    if (['ADMIN', 'STUDENT_MANAGER', 'ATTENDANCE_MANAGER'].includes(role)) refreshStudents(); 
  }, [role]);

  // Fees -> DB
  const [fees, setFees] = useState([]);
  const [feesLoading, setFeesLoading] = useState(true);
  const refreshFees = async () => {
    try {
      const res = await api.get('/fees/');
      // Parse fee amounts as Numbers and map to UI keys
      setFees((res.data || []).map(f => ({
        ...f,
        id: f.student_id,
        totalFees: Number(f.total_fees || 0),
        paid: Number(f.paid_amount || 0),
        remaining: Number(f.pending_amount || 0),
        credit: Number(f.credit_balance || 0),
        history: f.payment_history || [],
        status: f.status || 'Pending',
        dueDate: f.due_date || 'N/A'
      })));

    } catch (err) {
      console.error('[AdminDataContext] Failed to fetch fees:', err);
    } finally {
      setFeesLoading(false);
    }
  };

  useEffect(() => { 
    if (['ADMIN', 'FEES_MANAGER'].includes(role)) refreshFees(); 
  }, [role]);

  // Courses → loaded from backend API
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);

  const refreshCourses = async () => {
    try {
      const res = await api.get('/courses/');
      // Map backend shape → frontend shape with strict type parsing
      setCourses((res.data || []).map(c => ({
        id: c.id,
        course_id: c.course_id,
        name: c.course_name || 'Unnamed Course',   
        course_name: c.course_name || 'Unnamed Course',
        duration: c.duration || '',
        fee: Number(c.total_fee || 0),
        total_fee: Number(c.total_fee || 0),
        institute: c.institute || '',
        faculty: c.faculty || 'Unassigned',
        status: c.status || 'Active',
        enrollment: Number(c.enrollment || 0),
        students: Number(c.enrollment || 0), // Alias for backward compatibility
      })));
    } catch (err) {
      console.error('[AdminDataContext] Failed to fetch courses:', err);
    } finally {
      setCoursesLoading(false);
    }
  };

  useEffect(() => { 
    if (['ADMIN', 'STUDENT_MANAGER', 'ATTENDANCE_MANAGER', 'COURSE_MANAGER', 'FEES_MANAGER'].includes(role)) {
      refreshCourses();
    }
  }, [role]);


  // Attendance -> DB (all-time logs for trends/dashboard)
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const refreshAttendance = async () => {
    try {
      const res = await api.get('/attendance/');
      setAttendanceLogs(res.data || []);
    } catch (err) {
      console.error('[AdminDataContext] Failed to fetch attendance logs:', err);
    }
  };

  useEffect(() => { 
    if (['ADMIN', 'ATTENDANCE_MANAGER'].includes(role)) refreshAttendance(); 
  }, [role]);

  // Analytics -> DB Dashboard Stats
  const [dashboardStats, setDashboardStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const refreshDashboardStats = async () => {
    try {
      const res = await api.get('/analytics/dashboard');
      setDashboardStats(res.data);
    } catch (err) {
      console.error('[AdminDataContext] Failed to fetch analytics:', err);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => { 
    if (role === 'ADMIN') refreshDashboardStats(); 
  }, [role]);

  // Helper to get faculty name by role (used for headers)
  const getFacultyNameByRole = (roleKey) => {
    // Map human readable titles (from AdminLayout) to backend roles
    const ROLE_MAP = {
      "STUDENT MANAGEMENT": "STUDENT_MANAGER",
      "ATTENDANCE MANAGEMENT": "ATTENDANCE_MANAGER",
      "COURSE MANAGEMENT": "COURSE_MANAGER",
      "FEES MANAGEMENT": "FEES_MANAGER",
      "STUDENT_MANAGER": "STUDENT_MANAGER",
      "ATTENDANCE_MANAGER": "ATTENDANCE_MANAGER",
      "COURSE_MANAGER": "COURSE_MANAGER",
      "FEES_MANAGER": "FEES_MANAGER"
    };

    const targetRole = ROLE_MAP[roleKey.toUpperCase()] || roleKey;
    const f = (faculties || []).find(fac => (fac.role || "").toUpperCase() === targetRole.toUpperCase());
    return f ? f.name : "FACULTY";
  };

  // Dynamic Chart Helpers using current state
  const getEnrollmentStats = (year, monthIndex) => {
    const targetYear = year.toString();
    const targetMonth = (monthIndex + 1).toString().padStart(2, '0');
    const datePrefix = `${targetYear}-${targetMonth}`;

    const filtered = (students || []).filter(s => 
      s.admissionDate?.startsWith(datePrefix)
    );

    const existingCourses = (courses || []).length > 0 
      ? courses.map(c => c.name) 
      : [...new Set(students.map(s => s.course))];

    const chartColors = ['#4F46E5', '#7C3AED', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#8B5CF6'];

    return (existingCourses || []).map((courseName, i) => {
      const count = filtered.filter(s => s.course === courseName).length;
      return { 
        name: courseName, 
        value: count, 
        color: chartColors[i % chartColors.length] 
      };
    });
  };

  const currentFeeTrends = useMemo(() => {
    if (dashboardStats?.feeTrends) return dashboardStats.feeTrends;
    return [];
  }, [dashboardStats]);

  const currentAttendanceTrends = useMemo(() => {
    if (dashboardStats?.attendanceTrends) return dashboardStats.attendanceTrends;
    return [];
  }, [dashboardStats]);

  const fetchFeeDetail = async (studentId) => {
    try {
      const res = await api.get(`/fees/${studentId}`);
      const data = res.data;
      // Enforce single source of truth mapping
      return {
        id: data.student_id,
        name: data.name,
        course: data.course,
        totalFees: Number(data.total_fees || 0),
        paid: Number(data.paid_amount || 0),
        remaining: Number(data.pending_amount || 0),
        credit: Number(data.credit_balance || 0),
        dueDate: data.due_date || 'N/A',
        history: data.payment_history || []
      };

    } catch (err) {
      console.error('[AdminDataContext] fetchFeeDetail failed:', err);
      return null;
    }
  };

  const makePayment = async (data) => {
    try {
      await api.post('/fees/pay', data);
      await refreshFees(); // Sync global list
      return { success: true };
    } catch (err) {
      console.error('[AdminDataContext] makePayment failed:', err);
      if (err.response?.status === 400) {
        return { success: false, message: err.response.data.detail };
      }
      return { success: false };
    }
  };


  const setDueDate = async (data) => {
    try {
      await api.post('/fees/due-date', data);
      return { success: true };
    } catch (err) {
      console.error('[AdminDataContext] setDueDate failed:', err);
      return { success: false };
    }
  };

  const value = {
    students,
    setStudents,
    studentsLoading,
    refreshStudents,
    courses,
    setCourses,
    coursesLoading,
    refreshCourses,
    fees,
    setFees,
    feesLoading,
    refreshFees,
    faculties,
    facultiesLoading,
    refreshFaculties,
    attendanceLogs,
    setAttendanceLogs,
    refreshAttendance,
    dashboardStats,
    statsLoading,
    refreshDashboardStats,
    getEnrollmentStats,
    getFacultyNameByRole,
    fetchFeeDetail,
    makePayment,
    setDueDate,
    feeTrends: currentFeeTrends,
    attendanceTrends: currentAttendanceTrends
  };



  return (
    <AdminDataContext.Provider value={value}>
      {children}
    </AdminDataContext.Provider>
  );
};

export const useAdminData = () => {
  const context = useContext(AdminDataContext);
  if (!context) throw new Error('useAdminData must be used within AdminDataProvider');
  return context;
};
