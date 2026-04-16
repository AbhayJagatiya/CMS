import { useState, useEffect } from "react";
import { useAdminData } from "../../context/AdminDataContext";
import { useLocation } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import { UserPlus, ShieldAlert, Mail, Phone, Lock, User, Briefcase, Image as ImageIcon, CheckCircle2, AlertCircle, ChevronDown, UserSquare2 } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";

const FACULTY_ROLES = [
  { label: "Student Management",    backend: "STUDENT_MANAGER" },
  { label: "Attendance Management", backend: "ATTENDANCE_MANAGER" },
  { label: "Course Management",     backend: "COURSE_MANAGER" },
  { label: "Fees Management",       backend: "FEES_MANAGER" },
];

export default function FacultyManagement() {
  const { getToken, API } = useAuth();
  const { faculties, refreshFaculties } = useAdminData();

  // Registration State
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Student Management",
    employeeId: "",
    password: "",
    confirmPassword: "",
    avatar: ""
  });

  // Password Reset State
  const [resetForm, setResetForm] = useState({
    facultyId: "",
    fullName: "",
    role: "Student Management",
    newPassword: "",
    confirmPassword: ""
  });

  const location = useLocation();
  const [notification, setNotification] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    refreshFaculties();
  }, []);

  useEffect(() => {
     if (location.state?.selectedFacultyId) {
        setResetForm(prev => ({
           ...prev,
           facultyId: location.state.selectedFacultyId,
           fullName: location.state.facultyName || "",
           role: location.state.facultyRole || "Student Management"
        }));
     }
  }, [location]);

  const handleRegisterChange = (e) => {
    setRegisterForm({ ...registerForm, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setRegisterForm(prev => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetChange = (e) => {
    const { name, value } = e.target;
    if (name === 'facultyId') {
      const selected = faculties.find(f => String(f.id) === value);
      setResetForm(prev => ({ 
        ...prev, 
        [name]: value,
        fullName: selected ? selected.name : "",
        role: selected ? selected.role : "Student Management"
      }));
    } else {
      setResetForm({ ...resetForm, [name]: value });
    }
  };

  const showNotification = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleCreateFaculty = async (e) => {
    e.preventDefault();
    if (!registerForm.name || !registerForm.email || !registerForm.phone || !registerForm.employeeId || !registerForm.password) {
      showNotification("Please fill all required fields", "error");
      return;
    }
    if (registerForm.password !== registerForm.confirmPassword) {
      showNotification("Passwords do not match", "error");
      return;
    }

    const backendRole = FACULTY_ROLES.find(r => r.label === registerForm.role)?.backend || "STUDENT_MANAGER";

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API}/faculty/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          name: registerForm.name,
          email: registerForm.email.toLowerCase(),
          phone: registerForm.phone,
          employee_id: registerForm.employeeId,
          role: backendRole,
          password: registerForm.password,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        showNotification(err.detail || "Failed to create faculty", "error");
        return;
      }

      await refreshFaculties();
      showNotification("Faculty account created successfully!");
      setRegisterForm({ name: "", email: "", phone: "", role: "Student Management", employeeId: "", password: "", confirmPassword: "", avatar: "" });
    } catch (err) {
      showNotification("Server error. Is backend running?", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!resetForm.facultyId || !resetForm.newPassword || !resetForm.confirmPassword) {
      showNotification("Please fill all fields", "error");
      return;
    }
    if (resetForm.newPassword !== resetForm.confirmPassword) {
      showNotification("Passwords do not match", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API}/faculty/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          faculty_id: parseInt(resetForm.facultyId),
          new_password: resetForm.newPassword,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        showNotification(err.detail || "Failed to reset password", "error");
        return;
      }

      showNotification("Password updated successfully!");
      setResetForm({ facultyId: "", fullName: "", role: "Student Management", newPassword: "", confirmPassword: "" });
    } catch (err) {
      showNotification("Server error. Is backend running?", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6 md:gap-8">
        <div className="flex flex-col">
           <h2 className="text-xl md:text-2xl font-black text-[#0f172a] tracking-tighter leading-tight">Faculty Management</h2>
           <p className="text-[9px] md:text-[10px] pt-1 font-bold text-slate-400 uppercase tracking-widest italic leading-none">Control authority and system permissions</p>
        </div>

        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`fixed top-4 right-4 md:top-10 md:right-10 z-[200] px-5 py-3 md:px-6 md:py-4 rounded-xl md:rounded-2xl shadow-2xl flex items-center gap-3 font-black text-[10px] md:text-xs uppercase tracking-widest ${
              notification.type === "success" ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
            }`}
          >
            {notification.type === "success" ? <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5" /> : <AlertCircle className="w-4 h-4 md:w-5 md:h-5" />}
            {notification.msg}
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-start">
          {/* Left Section: Faculty Registration */}
          <div className="bg-white rounded-[24px] md:rounded-[32px] border border-slate-200 p-5 md:p-8 shadow-sm">
             <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-50">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                   <UserPlus className="w-5 h-5 text-primary" />
                </div>
                <div>
                   <h3 className="text-xl font-bold text-slate-800 tracking-tight uppercase">Faculty Registration</h3>
                   <p className="text-[13px] font-medium text-slate-400 uppercase tracking-widest leading-none">Onboard new academic members</p>
                </div>
             </div>

             <form onSubmit={handleCreateFaculty} className="space-y-4 md:space-y-5" autoComplete="off">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <div className="flex flex-col gap-1">
                      <label className="text-[13px] font-medium text-[#475569] ml-1">Full Name</label>
                      <div className="relative">
                         <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                         <input 
                           type="text" 
                           name="name"
                           value={registerForm.name}
                           onChange={handleRegisterChange}
                           placeholder="Enter faculty name"
                           className="w-full bg-white border border-[#f1f5f9] rounded-xl px-4 py-2.5 pl-10 text-[14px] font-medium focus:ring-4 focus:ring-[#0284c7]/10 focus:border-[#0284c7] transition-all outline-none text-[#0f172a] placeholder:text-[#94a3b8]" 
                         />
                      </div>
                   </div>
                   <div className="flex flex-col gap-1">
                      <label className="text-[13px] font-medium text-[#475569] ml-1">Email Address</label>
                      <div className="relative">
                         <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                         <input 
                           type="email" 
                           name="email"
                           value={registerForm.email}
                           onChange={handleRegisterChange}
                           autoComplete="off"
                           placeholder="faculty@college.com"
                           className="w-full bg-white border border-[#f1f5f9] rounded-xl px-4 py-2.5 pl-10 text-[14px] font-medium focus:ring-4 focus:ring-[#0284c7]/10 focus:border-[#0284c7] transition-all outline-none text-[#0f172a] placeholder:text-[#94a3b8]" 
                         />
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <div className="flex flex-col gap-1">
                      <label className="text-[13px] font-medium text-[#475569] ml-1">Phone Number</label>
                      <div className="relative">
                         <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                         <input 
                           type="tel" 
                           name="phone"
                           value={registerForm.phone}
                           onChange={handleRegisterChange}
                           placeholder="+91 9XX XXXXXXX"
                           className="w-full bg-white border border-[#f1f5f9] rounded-xl px-4 py-2.5 pl-10 text-[14px] font-medium focus:ring-4 focus:ring-[#0284c7]/10 focus:border-[#0284c7] transition-all outline-none text-[#0f172a] placeholder:text-[#94a3b8]" 
                         />
                      </div>
                   </div>
                   <div className="flex flex-col gap-1">
                      <label className="text-[13px] font-medium text-[#475569] ml-1">Select Role</label>
                      <div className="relative">
                         <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                         <select 
                           name="role"
                           value={registerForm.role}
                           onChange={handleRegisterChange}
                           className="w-full bg-white border border-[#f1f5f9] rounded-xl px-4 py-2.5 pl-10 pr-10 text-[14px] font-medium focus:ring-4 focus:ring-[#0284c7]/10 focus:border-[#0284c7] transition-all outline-none appearance-none cursor-pointer text-[#0f172a]"
                         >
                           {FACULTY_ROLES.map(r => <option key={r.backend}>{r.label}</option>)}
                         </select>
                         <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                   </div>
                </div>

                <div className="flex flex-col gap-1">
                   <label className="text-[13px] font-medium text-[#475569] ml-1">Employee ID</label>
                   <div className="relative">
                      <UserSquare2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="text" 
                        name="employeeId"
                        value={registerForm.employeeId}
                        onChange={handleRegisterChange}
                        placeholder="e.g. EMP-2024-001"
                        className="w-full bg-white border border-[#f1f5f9] rounded-xl px-4 py-2.5 pl-10 text-[14px] font-medium focus:ring-4 focus:ring-[#0284c7]/10 focus:border-[#0284c7] transition-all outline-none text-[#0f172a] placeholder:text-[#94a3b8]" 
                      />
                   </div>
                </div>

                <div className="flex flex-col gap-1">
                   <label className="text-[13px] font-medium text-[#475569] ml-1">Profile Image</label>
                   <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 hover:border-primary/40 transition-all cursor-pointer group relative overflow-hidden">
                      <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors shrink-0 overflow-hidden border border-slate-100 flex-shrink-0">
                         {registerForm.avatar ? (
                           <img src={registerForm.avatar} alt="Preview" className="w-full h-full object-cover" />
                         ) : (
                           <ImageIcon className="w-5 h-5" />
                         )}
                      </div>
                      <div className="flex-1 min-w-0">
                         <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest truncate">
                           {registerForm.avatar ? "Image selected" : "Click to upload profile photo"}
                         </p>
                         <p className="text-[8px] font-bold text-slate-400 uppercase">JPG, PNG or GIF (MAX. 2MB)</p>
                      </div>
                      <input 
                        type="file" 
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer" 
                        accept="image/*" 
                      />
                   </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <div className="flex flex-col gap-1">
                      <label className="text-[13px] font-medium text-[#475569] ml-1">Password</label>
                      <div className="relative">
                         <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                         <input 
                           type="password" 
                           name="password"
                           value={registerForm.password}
                           onChange={handleRegisterChange}
                           autoComplete="new-password"
                           placeholder="••••••••"
                           className="w-full bg-white border border-[#f1f5f9] rounded-xl px-4 py-2.5 pl-10 text-[14px] font-medium focus:ring-4 focus:ring-[#0284c7]/10 focus:border-[#0284c7] transition-all outline-none text-[#0f172a] placeholder:text-[#94a3b8]" 
                         />
                      </div>
                   </div>
                   <div className="flex flex-col gap-1">
                      <label className="text-[13px] font-medium text-[#475569] ml-1">Confirm Password</label>
                      <div className="relative">
                         <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                         <input 
                           type="password" 
                           name="confirmPassword"
                           value={registerForm.confirmPassword}
                           onChange={handleRegisterChange}
                           placeholder="••••••••"
                           className="w-full bg-white border border-[#f1f5f9] rounded-xl px-4 py-2.5 pl-10 text-[14px] font-medium focus:ring-4 focus:ring-[#0284c7]/10 focus:border-[#0284c7] transition-all outline-none text-[#0f172a] placeholder:text-[#94a3b8]" 
                         />
                      </div>
                   </div>
                </div>

                <div className="pt-2">
                    <button type="submit" disabled={isSubmitting} className={`w-full bg-[#0284c7] hover:bg-[#0369a1] text-white font-medium rounded-xl px-4 py-2.5 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-primary/20 ${isSubmitting ? 'opacity-70' : ''}`}>
                      <UserPlus className="w-4 h-4" />
                      Create Account
                   </button>
                </div>
             </form>
          </div>

          {/* Right Section: Faculty Password Reset */}
          <div className="bg-white rounded-[24px] md:rounded-[32px] border border-slate-200 p-5 md:p-8 shadow-sm">
             <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-50">
                <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center shrink-0">
                   <ShieldAlert className="w-5 h-5 text-rose-500" />
                </div>
                <div>
                   <h3 className="text-xl font-bold text-slate-800 tracking-tight uppercase">Password Reset</h3>
                   <p className="text-[13px] font-medium text-slate-400 uppercase tracking-widest leading-none">Manage security credentials</p>
                </div>
             </div>

             <form onSubmit={handleUpdatePassword} className="space-y-4 md:space-y-5">
                <div className="flex flex-col gap-1">
                   <label className="text-[13px] font-medium text-[#475569] ml-1">Select Faculty</label>
                   <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <select 
                        name="facultyId"
                        value={resetForm.facultyId}
                        onChange={handleResetChange}
                        className="w-full bg-white border border-[#f1f5f9] rounded-xl px-4 py-2.5 pl-10 pr-10 text-[14px] font-medium focus:ring-4 focus:ring-[#0284c7]/10 focus:border-[#0284c7] transition-all outline-none appearance-none cursor-pointer text-[#0f172a]"
                      >
                        <option value="" hidden>Select a Faculty Member</option>
                        {faculties.map(f => (
                          <option key={f.id} value={f.id}>{f.name} — {f.role}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                   </div>
                 </div>

                 <div className="flex flex-col gap-1">
                    <label className="text-[13px] font-medium text-[#475569] ml-1">Full Name</label>
                    <div className="relative">
                       <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                       <input 
                         type="text" 
                         name="fullName"
                         value={resetForm.fullName}
                         onChange={handleResetChange}
                         readOnly
                         placeholder="Select faculty to autofill"
                         className="w-full bg-slate-50 border border-[#f1f5f9] rounded-xl px-4 py-2.5 pl-10 text-[14px] font-medium transition-all outline-none opacity-60 cursor-not-allowed text-[#0f172a]" 
                       />
                    </div>
                 </div>

                 <div className="flex flex-col gap-1">
                    <label className="text-[13px] font-medium text-[#475569] ml-1">Select Role</label>
                    <div className="relative">
                       <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                       <select 
                         name="role"
                         value={resetForm.role}
                         onChange={handleResetChange}
                         disabled
                         className="w-full bg-slate-50 border border-[#f1f5f9] rounded-xl px-4 py-2.5 pl-10 pr-10 text-[14px] font-medium transition-all outline-none appearance-none opacity-60 cursor-not-allowed text-[#0f172a]"
                       >
                         {FACULTY_ROLES.map(r => <option key={r.backend}>{r.label}</option>)}
                       </select>
                       <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                 </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <div className="flex flex-col gap-1">
                      <label className="text-[13px] font-medium text-[#475569] ml-1">New Password</label>
                      <div className="relative">
                         <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                         <input 
                           type="password" 
                           name="newPassword"
                           value={resetForm.newPassword}
                           onChange={handleResetChange}
                           placeholder="••••••••"
                           className="w-full bg-white border border-[#f1f5f9] rounded-xl px-4 py-2.5 pl-10 text-[14px] font-medium focus:ring-4 focus:ring-[#0284c7]/10 focus:border-[#0284c7] transition-all outline-none text-[#0f172a] placeholder:text-[#94a3b8]" 
                         />
                      </div>
                   </div>
                   <div className="flex flex-col gap-1">
                      <label className="text-[13px] font-medium text-[#475569] ml-1">Confirm Password</label>
                      <div className="relative">
                         <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                         <input 
                           type="password" 
                           name="confirmPassword"
                           value={resetForm.confirmPassword}
                           onChange={handleResetChange}
                           placeholder="••••••••"
                           className="w-full bg-white border border-[#f1f5f9] rounded-xl px-4 py-2.5 pl-10 text-[14px] font-medium focus:ring-4 focus:ring-[#0284c7]/10 focus:border-[#0284c7] transition-all outline-none text-[#0f172a] placeholder:text-[#94a3b8]" 
                         />
                      </div>
                   </div>
                </div>

                <div className="pt-2">
                    <button type="submit" disabled={isSubmitting} className={`w-full bg-[#0f172a] hover:bg-slate-800 text-white font-medium rounded-xl px-4 py-2.5 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 shadow-lg ${isSubmitting ? 'opacity-70' : ''}`}>
                      <ShieldAlert className="w-4 h-4" />
                      Update Password
                   </button>
                </div>
             </form>

             {/* Security Note */}
             <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex gap-3">
                   <AlertCircle className="w-5 h-5 text-slate-400 shrink-0" />
                   <div className="flex-1">
                      <p className="text-[10px] font-black text-slate-600 uppercase tracking-wider mb-1">Administrative authority warning</p>
                      <p className="text-[9px] font-bold text-slate-400 leading-relaxed italic uppercase tracking-wider">
                         Password resets take effect immediately. Ensure you have verified the identity of the faculty member before proceeding.
                      </p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
