import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useAdminData } from "../context/AdminDataContext";
import { InfinityLoader } from "../components/ui/loader-13";
import Sidebar from "../components/common/Sidebar";
import Header from "../components/common/Header";
import { motion, AnimatePresence } from "framer-motion";
import { fadeInUp, fadeIn } from "../utils/motion";

export default function AdminLayout({ children }) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { getFacultyNameByRole, facultiesLoading } = useAdminData();

  const getHeaderInfo = () => {
    const path = location.pathname;
    
    // Helper to format managed by string
    const managedBy = (role) => {
      if (facultiesLoading) return "LOADING...";
      return `MANAGED BY ${getFacultyNameByRole(role)}`;
    };

    if (path === '/admin') return { title: "Dashboard", sub: "CENTRAL MANAGEMENT" };
    if (path === '/admin/students') return { title: "Student Management", sub: managedBy("STUDENT_MANAGER") };
    if (path === '/admin/attendance') return { title: "Attendance Management", sub: managedBy("ATTENDANCE_MANAGER") };
    if (path === '/admin/courses') return { title: "Course Management", sub: managedBy("COURSE_MANAGER") };
    if (path === '/admin/fees') return { title: "Fees Management", sub: managedBy("FEES_MANAGER") };
    if (path === '/admin/faculty') return { title: "Faculty Management", sub: "SYSTEM AUTHORITY & USER PERMISSIONS" };
    if (path === '/admin/financials') return { title: "Financials", sub: "SYSTEM OVERVIEW" };
    return { title: "Admin Portal", sub: "Welcome back to Academic Authority." };
  };

  const headerInfo = getHeaderInfo();

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans overflow-x-hidden relative">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={fadeIn}
            className="fixed inset-0 bg-black/50 z-[55] lg:hidden backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar - Mobile Responsive Drawer */}
      <div className={`fixed inset-y-0 left-0 z-[60] lg:static lg:block transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <Sidebar onClose={() => setIsMobileMenuOpen(false)} />
      </div>

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto relative">
        <Header 
          title={headerInfo.title} 
          sub={headerInfo.sub} 
          showSearch={false} 
          onMenuClick={() => setIsMobileMenuOpen(true)}
        />
        <main className="flex-1 bg-white">
          <div className="p-4 md:p-8 lg:p-10 max-w-[1600px] mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={fadeInUp}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
