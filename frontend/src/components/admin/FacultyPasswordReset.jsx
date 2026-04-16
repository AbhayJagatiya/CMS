import { useState, useEffect } from "react";
import { ShieldCheck, ChevronDown, Lock, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react";

export default function FacultyPasswordReset() {
  const [faculties, setFaculties] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('admin_faculty_overview');
    if (saved) {
      setFaculties(JSON.parse(saved));
    }
  }, []);

  const handleUpdate = () => {
    setError("");
    setSuccess("");

    if (!selectedFaculty) {
      setError("Please select a faculty member");
      return;
    }
    if (!newPassword) {
      setError("Please enter a new password");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Dummy logic for now
    setSuccess("Password updated successfully!");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setSuccess(""), 3000);
  };

  return (
    <div className="mb-10 w-full max-w-[400px] ml-auto">
      <div className={`bg-white rounded-[24px] border ${isExpanded ? 'border-primary/20 shadow-xl' : 'border-slate-200 shadow-sm'} transition-all overflow-hidden`}>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-5 flex items-center justify-between hover:bg-slate-50 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg ${isExpanded ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'} flex items-center justify-center transition-all`}>
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-black text-slate-700 uppercase tracking-widest">Faculty Password Reset</span>
          </div>
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </button>

        {isExpanded && (
          <div className="p-6 pt-0 flex flex-col gap-4 border-t border-slate-50">
            <div className="flex flex-col gap-1 pt-4">
              <label className="text-[13px] font-medium text-[#475569] ml-1">Select Faculty Member</label>
              <div className="relative">
                <select 
                  value={selectedFaculty}
                  onChange={(e) => setSelectedFaculty(e.target.value)}
                  className="w-full bg-white border border-[#f1f5f9] rounded-xl px-4 py-2.5 text-[14px] font-medium outline-none cursor-pointer appearance-none transition-all focus:ring-4 focus:ring-[#0284c7]/10 focus:border-[#0284c7] text-[#0f172a]"
                >
                  <option value="">Select a faculty member...</option>
                  {(faculties || []).map(f => (
                    <option key={f.id} value={f.id}>{f.name} ({f.email})</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[13px] font-medium text-[#475569] ml-1">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-white border border-[#f1f5f9] rounded-xl px-4 py-2.5 pl-10 text-[14px] font-medium outline-none focus:ring-4 focus:ring-[#0284c7]/10 focus:border-[#0284c7] transition-all placeholder:text-[#94a3b8] text-[#0f172a]"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[13px] font-medium text-[#475569] ml-1">Confirm</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-white border border-[#f1f5f9] rounded-xl px-4 py-2.5 pl-10 text-[14px] font-medium outline-none focus:ring-4 focus:ring-[#0284c7]/10 focus:border-[#0284c7] transition-all placeholder:text-[#94a3b8] text-[#0f172a]"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-rose-500 bg-rose-50 p-3 rounded-xl">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span className="text-[9px] font-bold uppercase tracking-wider">{error}</span>
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 text-emerald-500 bg-emerald-50 p-3 rounded-xl">
                <CheckCircle2 className="w-3 h-3 shrink-0" />
                <span className="text-[9px] font-bold uppercase tracking-wider">{success}</span>
              </div>
            )}

            <button 
              onClick={handleUpdate}
              className="w-full bg-[#0284c7] hover:bg-[#0369a1] text-white font-medium rounded-xl px-4 py-2.5 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 shadow-xl shadow-primary/20"
            >
              <RefreshCw className={`w-3 h-3 ${success ? 'animate-spin' : ''}`} />
              Update Password
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
