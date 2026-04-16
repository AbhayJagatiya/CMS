import React, { useMemo } from 'react';
import { Calendar, UserCheck, AlertCircle, Activity as ActivityIcon, Clock, ChevronRight } from 'lucide-react';
import { useAdminData } from '../../../context/AdminDataContext';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

// ✅ Formatter
const formatNumber = (val) => Number(val || 0).toLocaleString();

// ✅ Clean Tooltip (FIXED UX)
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-xl shadow-lg border text-xs font-bold">
        <p className="text-slate-400">Attendance</p>
        <p className="text-indigo-600">{payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

// ✅ CLEAN STAT CARD (NO COLORS)
const StatCard = ({ title, value, icon: Icon }) => (
  <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm flex items-center gap-5 transition-all hover:shadow-md hover:border-slate-200">
    <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{title}</p>
      <h3 className="text-2xl md:text-3xl font-black text-[#1E293B]">{value}</h3>
    </div>
  </div>
);

export default function FacultyAttendanceDashboard() {
  const { students, attendanceLogs, attendanceTrends } = useAdminData(); // :contentReference[oaicite:0]{index=0}

  // STATS
  const stats = useMemo(() => {
    const totalLogs = attendanceLogs.length;
    const uniqueDates = [...new Set((attendanceLogs || []).map(l => l.date))];

    const presentCount = attendanceLogs.filter(l => l.status === "PRESENT").length;
    const avgPercentage = totalLogs > 0
      ? ((presentCount / totalLogs) * 100).toFixed(1)
      : "0.0";

    let presentToday = 0;
    let absentToday = 0;

    if (uniqueDates.length > 0) {
      const latestDate = uniqueDates.sort((a, b) => new Date(b) - new Date(a))[0];
      const todayLogs = attendanceLogs.filter(l => l.date === latestDate);
      presentToday = todayLogs.filter(l => l.status === "PRESENT").length;
      absentToday = todayLogs.length - presentToday;
    }

    return { totalLogs, avgPercentage, presentToday, absentToday };
  }, [attendanceLogs]);

  // TOP STUDENTS
  const studentAttendance = useMemo(() => {
    const map = {};

    attendanceLogs.forEach(log => {
      if (!map[log.student_id]) map[log.student_id] = { present: 0, total: 0 };
      map[log.student_id].total += 1;
      if (log.status === 'PRESENT') map[log.student_id].present += 1;
    });

    return students
      .map(s => {
        const studentStats = map[s.studentId] || { present: 0, total: 0 };
        const percentage = studentStats.total > 0
          ? ((studentStats.present / studentStats.total) * 100).toFixed(1)
          : 0;

        return { ...s, percentage: Number(percentage) };
      })
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 5);
  }, [students, attendanceLogs]);

  // RECENT
  const recentLogs = useMemo(() => {
    return [...attendanceLogs]
      .reverse()
      .slice(0, 5)
      .map(log => {
        const student = students.find(s => s.studentId === (log.student_id || log.studentId));
        return {
          ...log,
          studentName: student?.name || "Unknown",
          studentAvatar: student?.avatar
        };
      });
  }, [attendanceLogs, students]);

  if (!attendanceLogs || attendanceLogs.length === 0) {
    return (
      <div className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest">
        No attendance data available
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-black text-[#1E293B] uppercase tracking-tight">
          Attendance Dashboard
        </h1>
        <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">
          Real-time engagement tracking
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Marked" value={formatNumber(stats.totalLogs)} icon={Calendar} />
        <StatCard title="Overall Avg %" value={`${stats.avgPercentage}%`} icon={ActivityIcon} />
        <StatCard title="Present Today" value={formatNumber(stats.presentToday)} icon={UserCheck} />
        <StatCard title="Absent Today" value={formatNumber(stats.absentToday)} icon={AlertCircle} />
      </div>

      {/* CHART */}
      <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm">
        <h4 className="text-lg font-black text-[#1E293B] mb-6 uppercase tracking-tight">
          Historical Trends
        </h4>

        <div className="h-72 w-full">
          {attendanceTrends?.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={attendanceTrends}>
                <CartesianGrid stroke="#F1F5F9" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94A3B8' }} />
                <YAxis domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#4F46E5"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 font-bold">
              No trend data
            </div>
          )}
        </div>
      </div>

      {/* TOP STUDENTS */}
      <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm">
        <h4 className="text-lg font-black text-[#1E293B] mb-6 uppercase tracking-tight">
          Top Presentees
        </h4>

        <div className="space-y-4">
          {(studentAttendance || []).map((s, i) => (
            <div key={i} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border hover:bg-white hover:shadow-md transition-all">
              <div>
                <p className="text-sm font-black">{s.name}</p>
                <p className="text-xs text-slate-400">{s.studentId}</p>
              </div>
              <span className={`px-3 py-1 rounded-lg text-xs font-black ${s.percentage >= 75 ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                }`}>
                {s.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* RECENT */}
      <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm">

        <div className="flex justify-between mb-8">
          <h4 className="text-xl font-black">Latest Entries</h4>
          <button className="text-xs font-bold flex items-center gap-1">
            View All <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          {(recentLogs || []).map((log, i) => (
            <div key={i} className="flex justify-between p-4 bg-slate-50 rounded-2xl hover:bg-white hover:shadow-md transition-all">
              <div>
                <p className="font-black">{log.studentName}</p>
                <p className="text-xs text-slate-400">{log.date}</p>
              </div>
              <span className={log.status === 'Present' ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
                {log.status}
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}