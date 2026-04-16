import React, { useMemo } from 'react';
import { Users, UserCheck, UserMinus, Clock, UserPlus, ChevronRight } from 'lucide-react';
import { useAdminData } from '../../../context/AdminDataContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';

// ✅ Currency / number formatter
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

// ✅ CLEAN STAT CARD (NO COLORS)
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

export default function FacultyStudentDashboard() {
  const { students } = useAdminData();

  // ================= STATS =================
  const stats = useMemo(() => {
    const total = students.length;
    const active = students.filter(s => s.status === 'Active').length;
    const inactive = students.filter(s => s.status === 'Inactive').length;

    const currentMonth = new Date().toLocaleString('en-US', { month: 'short' });
    const currentYear = new Date().getFullYear().toString();

    const recent = students.filter(s =>
      s.admissionDate?.includes(currentMonth) &&
      s.admissionDate?.includes(currentYear)
    ).length;

    return { total, active, inactive, recent };
  }, [students]);

  // ================= COURSE DATA =================
  const courseData = useMemo(() => {
    const map = {};
    students.forEach(s => {
      map[s.course] = (map[s.course] || 0) + 1;
    });

    return Object.keys(map).map(k => ({
      name: k,
      students: map[k]
    }));
  }, [students]);

  // ================= STATUS =================
  const statusData = useMemo(() => {
    return [
      {
        name: 'Active',
        value: students.filter(s => s.status === 'Active').length,
        color: '#10B981'
      },
      {
        name: 'Inactive',
        value: students.filter(s => s.status === 'Inactive').length,
        color: '#F43F5E'
      }
    ];
  }, [students]);

  // ================= RECENT =================
  const recentStudents = useMemo(() => {
    return [...students].reverse().slice(0, 5);
  }, [students]);

  const colors = ['#4F46E5', '#7C3AED', '#3B82F6', '#10B981', '#F59E0B'];

  if (!students || students.length === 0) {
    return (
      <div className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest">
        No student data available
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-black text-[#1E293B] uppercase tracking-tight">
          Student Dashboard
        </h1>
        <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">
          Enrollment statistics and overviews
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Students" value={formatNumber(stats.total)} icon={Users} />
        <StatCard title="Active Status" value={formatNumber(stats.active)} icon={UserCheck} />
        <StatCard title="Inactive Status" value={formatNumber(stats.inactive)} icon={UserMinus} />
        <StatCard title="Recently Added" value={formatNumber(stats.recent)} icon={UserPlus} />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* BAR */}
        <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm">
          <h4 className="text-lg font-black text-[#1E293B] mb-6 uppercase tracking-tight">
            Students per Course
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

        {/* PIE */}
        <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm">
          <h4 className="text-lg font-black text-[#1E293B] mb-6 uppercase tracking-tight">
            Status Distribution
          </h4>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  innerRadius={70}
                  outerRadius={100}
                  dataKey="value"
                >
                  {(statusData || []).map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
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
              Recent Additions
            </h4>
          </div>

          <button className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-1">
            View All <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          {(recentStudents || []).map((s, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-md transition-all">

              <div className="flex items-center gap-4">
                <img src={s.avatar} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <p className="text-sm font-black text-[#1E293B]">{s.name}</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest">
                    {s.course} • {s.studentId}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xs font-bold text-slate-500">{s.admissionDate}</p>
                <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase ${s.status === 'Active'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-rose-100 text-rose-700'
                  }`}>
                  {s.status}
                </span>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
}