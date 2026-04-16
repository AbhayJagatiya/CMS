import React, { useMemo } from 'react';
import { BookOpen, CheckCircle, Users, Clock, ChevronRight, DollarSign } from 'lucide-react';
import { useAdminData } from '../../../context/AdminDataContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// ✅ Formatter
const formatNumber = (val) => Number(val || 0).toLocaleString();

// ✅ Clean Tooltip
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-xl shadow-lg border text-xs font-bold">
        <p className="text-slate-400">{payload[0].name}</p>
        <p className="text-indigo-600">{formatNumber(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

// ✅ CLEAN STAT CARD
const StatCard = ({ title, value, icon: Icon }) => (
  <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm flex items-center gap-5 transition-all hover:shadow-md hover:border-slate-200">
    <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{title}</p>
      <h3 className="text-2xl md:text-3xl font-black text-[#1E293B]">{value}</h3>
    </div>
  </div>
);

export default function FacultyCourseDashboard() {
  const { courses } = useAdminData();

  // ================= STATS =================
  const stats = useMemo(() => {
    const total = courses.length;
    const active = courses.filter(c => c.status === 'Active').length;
    const totalEnrollment = courses.reduce((sum, c) => sum + (c.students || 0), 0);
    const avgFee =
      total > 0
        ? courses.reduce((sum, c) => sum + (parseFloat(c.baseFee) || 0), 0) / total
        : 0;

    return { total, active, totalEnrollment, avgFee };
  }, [courses]);

  // ================= DATA =================
  const courseData = useMemo(() => {
    return (courses || []).map(c => ({
      name: c.name,
      students: c.students || 0,
    }));
  }, [courses]);

  const recentCourses = useMemo(() => {
    return [...courses].reverse().slice(0, 5);
  }, [courses]);

  const colors = ['#4F46E5', '#7C3AED', '#3B82F6', '#10B981', '#F59E0B'];

  if (!courses || courses.length === 0) {
    return (
      <div className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest">
        No course data available
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-black text-[#1E293B] uppercase tracking-tight">
          Course Dashboard
        </h1>
        <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">
          Academic program oversight
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Courses" value={formatNumber(stats.total)} icon={BookOpen} />
        <StatCard title="Active Status" value={formatNumber(stats.active)} icon={CheckCircle} />
        <StatCard title="Total Enrollment" value={formatNumber(stats.totalEnrollment)} icon={Users} />
        <StatCard title="Average Fee" value={`₹${formatNumber(stats.avgFee)}`} icon={DollarSign} />
      </div>

      {/* CHART */}
      <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm">
        <h4 className="text-lg font-black text-[#1E293B] mb-6 uppercase tracking-tight">
          Enrollment per Program
        </h4>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={courseData}>
              <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 900, fill: '#94A3B8' }} />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="students" radius={[8, 8, 0, 0]}>
                {(courseData || []).map((entry, i) => (
                  <Cell key={i} fill={colors[i % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* RECENT */}
      <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm">

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h4 className="text-xl font-black text-[#1E293B] uppercase tracking-tight">
              Recently Added Programs
            </h4>
          </div>

          <button className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-1">
            Management <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          {(recentCourses || []).map((c, i) => (
            <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-md transition-all">

              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-xl bg-white border flex items-center justify-center text-slate-600">
                  <BookOpen className="w-5 h-5" />
                </div>

                <div>
                  <p className="text-sm font-black text-[#1E293B]">{c.name}</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest">
                    {c.institute} • {c.type}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xs font-bold text-slate-500">
                  ₹{formatNumber(c.baseFee)}
                </p>

                <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase ${c.status === 'Active'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-rose-100 text-rose-700'
                  }`}>
                  {c.status}
                </span>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
}