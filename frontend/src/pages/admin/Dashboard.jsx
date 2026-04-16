import { useMemo, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import { Users, CheckCircle, BookOpen, CreditCard, User, X, Mail, Save, Edit2 } from "lucide-react";
import { 
  BarChart, Bar, 
  PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, Legend, Label
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { useSearch } from "../../context/SearchContext";
import { useAdminData } from "../../context/AdminDataContext";
import { useAuth } from "../../context/AuthContext";

const initialFaculties = [];

const StatCard = ({ icon: Icon, title, value, badge, color }) => (
  <div className="bg-white rounded-[32px] p-10 flex flex-col gap-6 shadow-[0_4px_40px_rgba(0,0,0,0.02)] border border-slate-200 relative group hover:shadow-2xl hover:shadow-black/5 active:scale-[0.98] transition-all cursor-pointer">
    <div className="flex justify-between items-start">
      <div className={`w-14 h-14 rounded-2xl ${color} bg-opacity-10 flex items-center justify-center`}>
         <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
      </div>
      <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
        badge === 'Optimal' || badge === 'Target Met' ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-primary'
      }`}>
        {badge}
      </div>
    </div>
    
    <div>
      <p className="text-[10px] font-black text-secondary uppercase tracking-[0.25em] mb-2 opacity-60 leading-none">{title}</p>
      <h3 className="text-4xl font-black text-on-surface tracking-tighter leading-none">{value}</h3>
    </div>
  </div>
);

const FacultyCard = ({ name, title, status, courses, color, avatar, onClick }) => (
  <div 
    onClick={onClick}
    className="bg-white rounded-[24px] p-6 pr-10 flex items-center gap-6 shadow-sm border border-slate-200 shadow-black/5 hover:shadow-lg transition-all duration-200 active:scale-95 cursor-pointer group"
  >
     <div className={`w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md bg-slate-100 group-hover:scale-105 transition-transform duration-200`}>
        {avatar ? (
          <img src={avatar} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-primary font-bold">{name?.[0]}</div>
        )}
     </div>
     <div className="flex flex-col gap-1.5 overflow-hidden">
        <h4 className="text-base font-black text-on-surface leading-none tracking-tight truncate">{name}</h4>
        <p className="text-[10px] font-bold text-secondary uppercase tracking-widest opacity-60 leading-none">{title}</p>
        <div className="flex items-center gap-4 mt-1">
           <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest leading-none bg-opacity-10 group-hover:bg-opacity-20 transition-all ${
             status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-primary'
           }`}>{status}</span>
           <span className="text-[9px] font-bold text-secondary">{courses} Courses</span>
        </div>
     </div>
  </div>
);

const FacultyModal = ({ isOpen, onClose, faculty, onSave }) => {
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    avatar: "",
    title: ""
  });

  useEffect(() => {
    if (faculty) {
      setFormData({
        name: faculty.name || "",
        email: faculty.email || "",
        avatar: faculty.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        title: faculty.title || ""
      });
    }
  }, [faculty, isOpen]);

  if (!isOpen || !faculty) return null;
  const handleImageClick = () => fileInputRef.current?.click();

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData(prev => ({ ...prev, avatar: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl"
        >
          <div className="p-8 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-xl font-black text-[#0f172a] tracking-tight">Faculty Details</h3>
            <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-all text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-10 space-y-8">
            <div className="flex flex-col items-center gap-6">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-primary/10 shadow-lg bg-slate-100">
                  <img src={formData.avatar} alt="Faculty" className="w-full h-full object-cover" />
                </div>
                <button 
                  onClick={handleImageClick}
                  className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-lg hover:scale-110 transition-all border-2 border-white"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
                <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
              </div>
              <div className="text-center">
                <h4 className="text-2xl font-black text-[#0f172a] tracking-tight">{formData.name}</h4>
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mt-1 opacity-60">{formData.title}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-[13px] font-medium text-[#475569] ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-white border border-[#f1f5f9] rounded-xl px-4 py-2.5 pl-10 text-[14px] font-medium outline-none focus:ring-4 focus:ring-[#0284c7]/10 focus:border-[#0284c7] transition-all text-on-surface"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[13px] font-medium text-[#475569] ml-1">Module / Role</label>
                <div className="relative">
                  <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full bg-white border border-[#f1f5f9] rounded-xl px-4 py-2.5 pl-10 text-[14px] font-medium outline-none focus:ring-4 focus:ring-[#0284c7]/10 focus:border-[#0284c7] transition-all text-on-surface"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[13px] font-medium text-[#475569] ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full bg-white border border-[#f1f5f9] rounded-xl px-4 py-2.5 pl-10 text-[14px] font-medium outline-none focus:ring-4 focus:ring-[#0284c7]/10 focus:border-[#0284c7] transition-all text-on-surface"
                  />
                </div>
              </div>
            </div>

            <button 
              onClick={handleSave}
              className="w-full bg-[#0284c7] hover:bg-[#0369a1] text-white font-medium rounded-xl px-4 py-2.5 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 shadow-xl shadow-primary/20"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function AdminHome() {
  const { searchQuery } = useSearch();
  const { 
    getEnrollmentStats, 
    dashboardStats, 
    refreshDashboardStats,
    feeTrends,
    attendanceTrends,
    faculties,
    statsLoading
  } = useAdminData();

  const navigate = useNavigate();
  const [enrollmentYear, setEnrollmentYear] = useState(2026);
  const [enrollmentMonth, setEnrollmentMonth] = useState(3); // April

  const currentEnrollmentData = useMemo(() => 
    getEnrollmentStats(enrollmentYear, enrollmentMonth), 
  [enrollmentYear, enrollmentMonth, getEnrollmentStats]);

  // Use values from backend analytics
  const statsValues = useMemo(() => {
    if (statsLoading || !dashboardStats) return {
      students: "0",
      attendance: "0%",
      courses: "0",
      activeCourses: "0 Active",
      fees: "₹0"
    };
    return dashboardStats.stats;
  }, [dashboardStats, statsLoading]);

  const topPerformers = dashboardStats?.topPerformers || [];
  const recentAttendance = dashboardStats?.recentAttendance || [];

  const { API, getToken } = useAuth();

  useEffect(() => {
    refreshDashboardStats();
  }, []);

  const filteredFaculty = useMemo(() => {
    return (faculties || []).filter(f => 
       (f.name || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
       (f.title || "").toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [faculties, searchQuery]);


  return (
    <AdminLayout>
      {/* Page Title & Actions */}
      <div className="mb-14 flex items-end justify-between">
        <div>
           <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-4">MANAGEMENT PORTAL</p>
           <h2 className="text-4xl font-bold text-[#0f172a] tracking-tight leading-normal">System Overview</h2>
        </div>
        <div className="flex gap-4">
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mb-10 md:mb-14">
        <StatCard title="Total Students" value={statsValues.students} badge="+12.5%" icon={Users} color="bg-primary" />
        <StatCard title="Attendance %" value={statsValues.attendance} badge="Optimal" icon={CheckCircle} color="bg-emerald-600" />
        <StatCard title="Total Courses" value={statsValues.courses} badge={statsValues.activeCourses} icon={BookOpen} color="bg-amber-600" />
        <StatCard title="Fees Collected" value={statsValues.fees} badge="Target Met" icon={CreditCard} color="bg-primary" />
      </div>

      {/* Analytics Grid: Top Performers & Recent Entries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-14">
         {/* Top Performers */}
         <div className="bg-white rounded-[32px] p-8 md:p-12 border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold text-on-surface tracking-tight mb-8 uppercase">Top Performers (Attendance)</h3>
            <div className="space-y-6">
               {(topPerformers || []).map((p, i) => (
                  <div key={i} className="flex items-center justify-between group">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-primary font-black text-sm">{i+1}</div>
                        <div>
                           <p className="text-sm font-black text-[#0f172a] tracking-tight">{p.name}</p>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{p.course}</p>
                        </div>
                     </div>
                     <span className="text-sm font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">{p.percentage}%</span>
                  </div>
               ))}
               {topPerformers.length === 0 && <p className="text-slate-400 text-xs font-bold uppercase tracking-widest text-center py-10">No data yet</p>}
            </div>
         </div>

         {/* Recent Attendance */}
         <div className="bg-[#1e293b] rounded-[32px] p-8 md:p-12 border border-slate-800 shadow-xl">
            <h3 className="text-xl font-bold text-white tracking-tight mb-8 uppercase">Recent Attendance</h3>
            <div className="space-y-6">
               {(recentAttendance || []).map((item, i) => (
                  <div key={i} className="flex items-center justify-between border-b border-white/5 pb-4 last:border-0 last:pb-0">
                     <div className="flex items-center gap-4">
                        <div className={`w-2 h-2 rounded-full ${item.status === 'PRESENT' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        <div>
                           <p className="text-sm font-black text-white tracking-tight">{item.name || "Unknown"}</p>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.course}</p>
                        </div>
                     </div>
                     <p className="text-[10px] font-black text-slate-500 uppercase">{item.date}</p>
                  </div>
               ))}
               {recentAttendance.length === 0 && <p className="text-slate-500 text-xs font-bold uppercase tracking-widest text-center py-10">No recent logs</p>}
            </div>
         </div>
      </div>

      {/* Middle Grid: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10 mb-10 md:mb-14">
        {/* Fees Collection Trend */}
        <div className="lg:col-span-2 bg-white rounded-[32px] md:rounded-[40px] p-6 md:p-12 border border-slate-200 shadow-sm shadow-black/5 min-h-[400px] md:min-h-[500px]">
           <div className="flex justify-between items-start mb-14">
              <div>
                 <h3 className="text-xl font-bold text-on-surface tracking-tight mb-2">Fee Collection Trends</h3>
                 <p className="text-[13px] font-medium text-secondary opacity-60">Projection vs Actual Collection for FY 2025-26</p>
              </div>
           </div>
           
           <div className="overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
              <div className="h-80 min-w-[1200px]">
                 <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                    <AreaChart data={feeTrends || []} margin={{ top: 10, right: 30, left: 20, bottom: 20 }}>
                       <defs>
                         <linearGradient id="colorWave" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.2}/>
                           <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                         </linearGradient>
                       </defs>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                       <XAxis 
                          dataKey="name" 
                          fontSize={10} 
                          fontWeight={700} 
                          axisLine={false} 
                          tickLine={false} 
                          dy={10}
                       >
                          <Label value="Time (Months / Year)" offset={-15} position="insideBottom" fontSize={9} fontWeight={700} fill="#94A3B8" />
                       </XAxis>
                       <YAxis 
                          fontSize={10} 
                          fontWeight={700} 
                          axisLine={false} 
                          tickLine={false} 
                          tickFormatter={(value) => {
                              if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
                              if (value >= 1000) return `₹${(value / 1000).toFixed(0)}K`;
                              return `₹${value}`;
                           }}
                       >
                          <Label value="Amount Collected (₹)" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} offset={10} fontSize={9} fontWeight={700} fill="#94A3B8" />
                       </YAxis>
                        <Tooltip 
                           cursor={{ stroke: '#4F46E5', strokeWidth: 1 }} 
                           contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 8px 40px rgba(0,0,0,0.05)', padding: '12px' }}
                           itemStyle={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}
                           labelStyle={{ fontSize: '10px', fontWeight: 700, marginBottom: '4px', color: '#64748B' }}
                           formatter={(value, name) => [`₹${(value || 0).toLocaleString()}`, name === 'actual' ? "Actual Collection" : "Projected Goal"]}
                        />
                        <Legend 
                           verticalAlign="top" 
                           align="right" 
                           iconType="circle"
                           content={({ payload }) => (
                              <div className="flex gap-4 mb-8">
                                 {(payload || []).map((entry, index) => (
                                    <div key={`item-${index}`} className="flex items-center gap-2">
                                       <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                                       <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                          {entry.dataKey === 'actual' ? "Actual Collection" : "Projected Goal"}
                                       </span>
                                    </div>
                                 ))}
                              </div>
                           )}
                        />
                        <Area 
                           type="monotone" 
                           dataKey="projected" 
                           stroke="#94A3B8" 
                           strokeWidth={2} 
                           strokeDasharray="5 5"
                           fill="transparent" 
                           dot={false}
                           activeDot={{ r: 4, fill: '#94A3B8' }}
                        />
                        <Area 
                           type="monotone" 
                           dataKey="actual" 
                           stroke="#4F46E5" 
                           strokeWidth={4} 
                           fillOpacity={1} 
                           fill="url(#colorWave)" 
                           dot={{ r: 4, fill: '#FFFFFF', stroke: '#4F46E5', strokeWidth: 2 }}
                           activeDot={{ r: 6, fill: '#4F46E5', stroke: '#FFFFFF', strokeWidth: 2 }}
                        />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
           </div>
        </div>

        {/* Student Enrollment Donut */}
        <div className="bg-[#EFF4FF] rounded-[32px] md:rounded-[40px] p-6 md:p-12 border border-blue-100 shadow-sm shadow-black/5 flex flex-col min-h-[400px] md:min-h-[500px]">
           <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-10 w-full">
              <h3 className="text-xl font-bold text-[#0f172a] tracking-tight truncate uppercase">Student Enrollment</h3>
              <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
                 <select 
                   value={enrollmentYear} 
                   onChange={(e) => setEnrollmentYear(Number(e.target.value))}
                   className="flex-1 sm:flex-none bg-white border border-blue-100/50 outline-none text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg cursor-pointer appearance-none min-w-[80px] hover:bg-white/80 transition-all duration-200 focus:ring-4 focus:ring-primary/10"
                 >
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                 </select>
                 <select 
                   value={enrollmentMonth} 
                   onChange={(e) => setEnrollmentMonth(Number(e.target.value))}
                   className="flex-1 sm:flex-none bg-white border border-blue-100/50 outline-none text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg cursor-pointer appearance-none min-w-[100px] hover:bg-white/80 transition-all duration-200 focus:ring-4 focus:ring-primary/10"
                 >
                    {(MONTHS || []).map((m, i) => (
                      <option key={m} value={i}>{m}</option>
                    ))}
                 </select>
              </div>
           </div>
           
           <div className="relative w-full h-[200px] md:h-[240px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                 <PieChart>
                    <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 8px 40px rgba(0,0,0,0.05)', padding: '12px' }}
                        itemStyle={{ color: '#0f172a', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase' }}
                        formatter={(value, name) => [`${value}`, name]}
                     />
                    <Pie
                      data={currentEnrollmentData || []}
                      innerRadius={window.innerWidth < 768 ? 60 : 80}
                      outerRadius={window.innerWidth < 768 ? 80 : 100}
                      paddingAngle={3}
                      dataKey="value"
                      stroke="none"
                    >
                      {(currentEnrollmentData || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                 </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                 <span className="text-2xl md:text-4xl font-black text-on-surface tracking-tighter leading-none">
                    {(currentEnrollmentData || []).reduce((acc, curr) => acc + (curr.value || 0), 0)}
                 </span>
                 <span className="text-[9px] md:text-[10px] font-black text-secondary uppercase tracking-widest mt-1 md:mt-2">Students</span>
              </div>
           </div>

           <div className="grid grid-cols-2 gap-x-4 md:gap-x-8 gap-y-4 mt-8 md:mt-10 w-full">
              <div className="space-y-3">
                 {(currentEnrollmentData || []).slice(0, 3).map((item, i) => (
                    <div key={i} className="flex items-center gap-2 md:gap-3">
                       <div className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: item.color }} />
                       <span className="text-[9px] md:text-[10px] font-black text-secondary uppercase tracking-tight truncate">{item.name}</span>
                    </div>
                 ))}
              </div>
              <div className="space-y-3">
                 {(currentEnrollmentData || []).slice(3, 8).map((item, i) => (
                    <div key={i} className="flex items-center gap-2 md:gap-3">
                       <div className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: item.color }} />
                       <span className="text-[9px] md:text-[10px] font-black text-secondary uppercase tracking-tight truncate">{item.name}</span>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>

      {/* Attendance Overview (Long Bar Chart) */}
      <div className="bg-white rounded-[32px] md:rounded-[40px] p-6 md:p-12 border border-slate-200 shadow-sm shadow-black/5 mb-10 md:mb-14">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-10 md:mb-14">
           <h3 className="text-xl md:text-2xl font-black text-on-surface tracking-tight leading-none uppercase">Monthly Attendance Overview</h3>
           <div className="px-5 py-2 bg-slate-50 flex items-center gap-2 rounded-full hidden sm:flex">
              <span className="text-secondary text-[10px] font-black uppercase tracking-widest text-center whitespace-nowrap">Jan 2025 — Apr 2026</span>
           </div>
        </div>
        <div className="overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
           <div className="h-64 min-w-[800px] md:min-w-[1500px]">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                 <BarChart data={attendanceTrends || []}>
                    <XAxis dataKey="name" fontSize={9} fontWeight={900} axisLine={false} tickLine={false} dy={15} />
                    <Tooltip 
                       contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 8px 40px rgba(0,0,0,0.05)', padding: '12px' }}
                       itemStyle={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase' }}
                       labelStyle={{ fontSize: '10px', fontWeight: 900, marginBottom: '4px', color: '#64748B' }}
                       formatter={(value) => [`${value}%`, "Attendance"]}
                    />
                    <Bar 
                        dataKey="value" 
                        fill="#E2E8F0" 
                        radius={[6, 6, 0, 0]} 
                        barSize={24}
                        shape={(props) => {
                            const { x, y, width, height } = props;
                            // Dynamic color based on attendance %
                            const color = props.value >= 90 ? '#10B981' : (props.value >= 80 ? '#4F46E5' : '#F59E0B');
                            return <rect x={x} y={y} width={width} height={height} fill={color} rx={4} ry={4} />;
                        }}
                    />
                 </BarChart>
              </ResponsiveContainer>
           </div>
        </div>
      </div>

      {/* Faculty Section */}
      <div className="space-y-8 md:space-y-10">
         <div className="flex justify-between items-end">
            <h3 className="text-2xl md:text-3xl font-black text-[#0f172a] tracking-tight leading-none">Faculty Overview</h3>
         </div>
         
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {(filteredFaculty || []).map((faculty) => {
               // Map backend role to UI title
               const roleMap = {
                 "STUDENT_MANAGER": "Student Management",
                 "ATTENDANCE_MANAGER": "Attendance Management",
                 "COURSE_MANAGER": "Course Management",
                 "FEES_MANAGER": "Fees Management",
                 "ADMIN": "Administrator"
               };
               const displayRole = roleMap[faculty.role] || faculty.role;

               return (
                 <FacultyCard 
                   key={faculty.id} 
                   name={faculty.name}
                   title={displayRole}
                   status="Active"
                   courses={faculty.courses_count || 3} // Fallback or real count
                   avatar={faculty.avatar}
                   onClick={() => navigate('/admin/faculty', { 
                      state: { 
                          selectedFacultyId: faculty.id, 
                          facultyName: faculty.name,
                          facultyRole: displayRole
                      } 
                   })}
                 />
               );
            })}
          </div>
      </div>
    </AdminLayout>
  );
}
