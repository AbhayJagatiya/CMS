import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  GraduationCap,
  CheckCircle,
  BookOpen,
  CreditCard,
  DollarSign,
  Settings,
  LogOut,
  Users,
  X,
  HelpCircle as SupportIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { buttonVariants } from "../../utils/motion";
import { useAuth } from "../../context/AuthContext";
import ProfileModal from "./ProfileModal";

export default function Sidebar({ onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  if (!user) return null;

  const role = user.role;
  const isFacultyStudent = role === 'faculty-1';
  const isFacultyAttendance = role === 'faculty-2';
  const isFacultyCourse = role === 'faculty-3';
  const isFacultyFees = role === 'faculty-4';

  const getNavItems = () => {
    if (isFacultyStudent) {
      return [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/faculty/student-dashboard' },
        { label: 'Student Module', icon: GraduationCap, path: '/faculty/student-module' },
        { label: 'Actions', icon: Settings, path: '/faculty/student-actions' },
      ];
    }
    if (isFacultyAttendance) {
      return [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/faculty/attendance-dashboard' },
        { label: 'Attendance Module', icon: CheckCircle, path: '/faculty/attendance-module' },
        { label: 'Actions', icon: Settings, path: '/faculty/attendance-actions' },
      ];
    }
    if (isFacultyCourse) {
      return [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/faculty/course-dashboard' },
        { label: 'Course Module', icon: BookOpen, path: '/faculty/course-module' },
        { label: 'Actions', icon: Settings, path: '/faculty/course-actions' },
      ];
    }
    if (isFacultyFees) {
      return [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/faculty/fees-dashboard' },
        { label: 'Fees Module', icon: CreditCard, path: '/faculty/fees-module' },
        { label: 'Actions', icon: Settings, path: '/faculty/fees-actions' },
      ];
    }
    // Admin
    return [
      { label: 'Dashboard', icon: LayoutDashboard, path: '/admin', tag: 'CENTRAL MANAGEMENT' },
      { label: 'Student Management', icon: GraduationCap, path: '/admin/students', tag: 'MANAGED BY FACULTY 1' },
      { label: 'Attendance Management', icon: CheckCircle, path: '/admin/attendance', tag: 'MANAGED BY FACULTY 2' },
      { label: 'Course Management', icon: BookOpen, path: '/admin/courses', tag: 'MANAGED BY FACULTY 3' },
      { label: 'Fees Management', icon: CreditCard, path: '/admin/fees', tag: 'MANAGED BY FACULTY 4' },
      { label: 'Faculty Management', icon: Users, path: '/admin/faculty', tag: 'SYSTEM AUTHORITY' },
    ];
  };

  const navItems = getNavItems();

  const handleNavClick = (path) => {
    if (path !== '#') {
      navigate(path);
      if (window.innerWidth < 1024) onClose(); // Close drawer on mobile after nav
    }
  };

  return (
    <aside className="w-[280px] md:w-[300px] bg-[#F1F5F9] border-r border-[#E2E8F0] flex flex-col h-screen shrink-0 overflow-y-auto">
      <div className="p-6 md:p-8">
        <div className="flex items-center justify-between mb-10 md:mb-12">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-primary rounded-[12px] flex items-center justify-center text-white shadow-lg shrink-0">
              <GraduationCap className="w-6 h-6 md:w-7 md:h-7" />
            </div>
            <div className="whitespace-nowrap">
              <h1 className="text-xs md:text-sm font-black text-[#1E293B] tracking-tight leading-tight uppercase">Campus Admin</h1>
              <p className="text-[9px] md:text-[10px] font-bold text-secondary uppercase tracking-widest mt-0.5 md:mt-1 opacity-60">CENTRAL MANAGEMENT</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-white rounded-xl transition-all text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="space-y-1">
          {(navItems || []).map((item) => {
            const isActive = item.path !== '#' && (location.pathname === item.path || (item.path === '/faculty/dashboard' && location.pathname.includes('/faculty/dashboard')));
            return (
              <motion.button
                key={item.label}
                whileHover="hover"
                whileTap="tap"
                variants={buttonVariants}
                onClick={() => handleNavClick(item.path)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-xs transition-colors whitespace-nowrap relative group ${isActive
                  ? 'text-primary font-black'
                  : 'text-[#64748B] hover:text-on-surface font-bold'
                  }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-nav-bg"
                    className="absolute inset-0 bg-white rounded-xl shadow-sm z-0"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <item.icon className={`w-5 h-5 shrink-0 relative z-10 ${isActive ? 'text-primary' : 'opacity-60 group-hover:opacity-100 transition-opacity'}`} />
                <span className="relative z-10">{item.label}</span>
              </motion.button>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-4 md:p-8 space-y-4">
        {isFacultyCourse ? (
          <>

            <motion.button
              whileHover={{ x: 5 }}
              className="w-full flex items-center gap-4 px-4 py-2 rounded-lg text-xs font-bold text-[#64748B] hover:bg-white/50 transition-colors"
            >
              <SupportIcon className="w-5 h-5 opacity-40 shrink-0" />
              Support
            </motion.button>
            <motion.button
              whileHover={{ x: 5 }}
              onClick={() => { logout(); navigate('/login'); }}
              className="w-full flex items-center gap-4 px-4 py-2 rounded-lg text-xs font-bold text-[#64748B] hover:bg-white/50 transition-colors"
            >
              <LogOut className="w-5 h-5 opacity-40 shrink-0" />
              Logout
            </motion.button>
          </>
        ) : (
          <>
            {!role.startsWith('faculty') && (
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-xs font-bold text-[#64748B] hover:bg-white/50"
              >
                <Settings className="w-5 h-5 opacity-60 shrink-0" />
                Settings
              </button>
            )}
            <button
              onClick={() => { logout(); navigate('/login'); }}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-xs font-bold text-[#64748B] hover:bg-white/50"
            >
              <LogOut className="w-5 h-5 opacity-60 shrink-0" />
              Logout
            </button>
          </>
        )}
      </div>
      <ProfileModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </aside>
  );
}
