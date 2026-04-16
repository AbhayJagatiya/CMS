import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Lock, ArrowRight, GraduationCap, ShieldCheck, Briefcase, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { SpecialText } from "../../components/ui/special-text";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activeRole, setActiveRole] = useState("admin"); // 'admin' or 'faculty'
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Map UI role toggle → backend RoleEnum value
    const backendRole = activeRole === 'admin' ? 'ADMIN' : 'FACULTY';

    const result = await login(email, password, backendRole);

    if (result.success) {
      setLoginSuccess(true);
      setLoading(false);

      setTimeout(() => {
        const role = result.role;
        if (role === 'admin') {
          navigate('/admin');
        } else if (role === 'faculty-1') {
          navigate('/faculty/student-module');
        } else if (role === 'faculty-2') {
          navigate('/faculty/attendance-module');
        } else if (role === 'faculty-3') {
          navigate('/faculty/course-module');
        } else if (role === 'faculty-4') {
          navigate('/faculty/fees-module');
        } else {
          navigate('/faculty/student-module');
        }
      }, 2500);
    } else {
      setError(result.error || "Invalid credentials");
      setLoading(false);
    }
  };

  if (loginSuccess) {
    return (
      <div className="h-screen bg-[#F8F9FF] flex items-center justify-center p-8 relative overflow-hidden font-mono">
        {/* Background Decor */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden select-none">
          <div className="absolute -top-48 -left-48 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 -right-48 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[120px]" />
        </div>
        
        <SpecialText
          speed={12}
          className="text-xl md:text-2xl font-black tracking-widest text-primary uppercase"
        >
          Configuring your control panel...
        </SpecialText>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#F8F9FF] flex flex-col items-center justify-center py-6 px-4 overflow-hidden font-sans">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden select-none">
        <div className="absolute -top-48 -left-48 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 -right-48 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[120px]" />
      </div>

      {/* Top Branding Section (Reduced Margins) */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center mb-6 relative z-10 scale-90 sm:scale-100"
      >
        <div className="w-12 h-12 bg-primary rounded-[16px] flex items-center justify-center shadow-xl shadow-primary/30 mb-4 transition-transform">
           <GraduationCap className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-[24px] md:text-[28px] font-black tracking-tight text-[#0B1C30] leading-none mb-1">Academic Authority</h1>
        <p className="text-[9px] font-black text-secondary uppercase tracking-[0.3em] opacity-40">Unified Management System</p>
      </motion.div>

      {/* Main Login Container (Reduced Paddings & Spacing) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-[460px] bg-white rounded-[32px] shadow-[0_4px_60px_rgba(0,0,0,0.03)] p-8 md:p-10 border-none relative z-10"
      >
        <div className="mb-8 text-center md:text-left">
          <h2 className="text-2xl font-black text-[#0B1C30] tracking-tighter mb-2 leading-none">Secure Access</h2>
          <p className="text-secondary text-xs font-medium leading-relaxed opacity-60">Enter your credentials to manage your campus portfolio.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
           <div className="flex flex-col gap-1">
              <label className="text-[13px] font-medium text-[#475569] ml-1">Account Role</label>
             <div className="grid grid-cols-2 bg-[#F1F3F9] p-1.5 rounded-[16px] relative">
                <motion.div 
                  layoutId="roleActive"
                  className="absolute inset-y-1.5 w-[calc(50%-6px)] bg-white rounded-[12px] shadow-sm z-0"
                  animate={{ x: activeRole === 'admin' ? 0 : '100%' }}
                />
                <button
                  type="button"
                  onClick={() => { setActiveRole('admin'); setError(""); }}
                  className={`relative z-10 py-2.5 flex items-center justify-center gap-2 text-[10px] font-black transition-colors ${
                    activeRole === 'admin' ? 'text-primary' : 'text-secondary/60'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" /> Admin
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveRole('faculty'); setError(""); }}
                  className={`relative z-10 py-2.5 flex items-center justify-center gap-2 text-[10px] font-black transition-colors ${
                    activeRole === 'faculty' ? 'text-primary' : 'text-secondary/60'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5" /> Faculty
                </button>
             </div>
          </div>

           <div className="flex flex-col gap-1">
              <label className="text-[13px] font-medium text-[#475569] ml-1">Email Address</label>
             <div className="relative group">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline transition-colors group-focus-within:text-primary" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@institution.edu"
                  className="w-full bg-[#f8fafc] border border-[#f1f5f9] rounded-xl px-4 py-2.5 pl-10 text-[14px] font-medium focus:ring-4 focus:ring-[#0284c7]/10 focus:border-[#0284c7] outline-none placeholder:text-[#94a3b8] transition-all"
                />
             </div>
          </div>

           <div className="flex flex-col gap-1">
              <div className="flex justify-between items-end mb-1">
                <label className="text-[13px] font-medium text-[#475569] ml-1">Password</label>
               {activeRole === 'admin' && (
                  <button type="button" className="text-[9px] font-black text-primary uppercase tracking-widest hover:underline decoration-1">Forgot?</button>
               )}
             </div>
             <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline transition-colors group-focus-within:text-primary" />
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#f8fafc] border border-[#f1f5f9] rounded-xl px-4 py-2.5 pl-10 pr-10 text-[14px] font-medium focus:ring-4 focus:ring-[#0284c7]/10 focus:border-[#0284c7] outline-none placeholder:text-[#94a3b8] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
             </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-red-50 text-red-600 text-[9px] font-black uppercase tracking-widest rounded-xl text-center"
            >
              {error}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-[#0284c7] hover:bg-[#0369a1] text-white font-medium rounded-xl px-4 py-2.5 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 shadow-xl shadow-primary/25 mt-4 ${loading ? 'opacity-70' : ''}`}
          >
            {loading ? "Verifying..." : "Login to Portal"}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>
      </motion.div>

      {/* Footer Section (Matching Requested Style with Lower Margin) */}
      <motion.div 
         initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
         className="mt-8 flex flex-col items-center gap-4 relative z-10"
      >
         <div className="flex items-center gap-8 text-[10px] font-black text-secondary/40 uppercase tracking-widest">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Support</a>
         </div>
         
         <div className="px-6 py-2.5 bg-[#F1F4FF] rounded-full flex items-center gap-2 shadow-sm border-none">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[9px] font-black text-[#566580] uppercase tracking-widest leading-none">System Active</span>
         </div>
      </motion.div>
    </div>
  );
}
