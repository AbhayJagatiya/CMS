import React, { useMemo } from 'react';
import { DollarSign, CreditCard, Clock, PieChart as PieChartIcon, TrendingUp, ChevronRight, User } from 'lucide-react';
import { useAdminData } from '../../../context/AdminDataContext';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';

// ✅ Currency formatter
const formatCurrency = (value) => `₹${Number(value || 0).toLocaleString()}`;

// ✅ Custom Tooltip (IMPORTANT FIX)
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-xl shadow-lg border text-xs font-bold">
        <p className="text-slate-400">{payload[0].name}</p>
        <p className="text-indigo-600">{formatCurrency(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

const StatCard = ({ title, value, icon: Icon }) => (
  <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm flex items-center gap-5 transition-all hover:shadow-md hover:border-slate-200">

    {/* CLEAN ICON (NO COLOR BLOCKS) */}
    <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
      <Icon className="w-5 h-5" />
    </div>

    {/* TEXT */}
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
        {title}
      </p>
      <h3 className="text-2xl md:text-3xl font-black text-[#1E293B]">
        {value}
      </h3>
    </div>

  </div>
);

export default function FacultyFeesDashboard() {
  const { fees } = useAdminData();

  // ================= STATS =================
  const financeStats = useMemo(() => {
    const totalCollected = fees.reduce((sum, f) => sum + Number(f.paid || 0), 0);
    const totalPending = fees.reduce((sum, f) => sum + Number(f.remaining || 0), 0);

    return {
      collected: formatCurrency(totalCollected),
      pending: formatCurrency(totalPending),
      rate: totalCollected + totalPending > 0
        ? `${((totalCollected / (totalCollected + totalPending)) * 100).toFixed(1)}%`
        : "0%"
    };
  }, [fees]);

  // ================= PIE =================
  const statusData = useMemo(() => [
    { name: 'Paid', value: fees.reduce((a, b) => a + Number(b.paid || 0), 0), color: '#10B981' },
    { name: 'Pending', value: fees.reduce((a, b) => a + Number(b.remaining || 0), 0), color: '#F59E0B' }
  ], [fees]);

  // ================= TREND =================
  const trendData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr'];

    return (months || []).map((m, i) => ({
      name: m,
      collection: fees.reduce((sum, f) => {
        const monthly = (f.history || []).filter(h =>
          new Date(h.date).getMonth() === i
        );
        return sum + monthly.reduce((a, b) => a + b.amount, 0);
      }, 0)
    }));
  }, [fees]);

  // ================= TRANSACTIONS =================
  const recentTransactions = useMemo(() => {
    const all = [];
    fees.forEach(f => {
      (f.history || []).forEach(h => {
        all.push({
          ...h,
          studentName: f.name,
          studentId: f.id
        });
      });
    });

    return all.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
  }, [fees]);

  if (!fees || fees.length === 0) {
    return <div className="text-center py-20 text-slate-400 font-bold">No Data Available</div>;
  }

  return (
    <div className="space-y-8">

      <h1 className="text-2xl font-black text-[#1E293B]">Fees Dashboard</h1>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Revenue" value={financeStats.collected} icon={DollarSign} />
        <StatCard title="Pending" value={financeStats.pending} icon={Clock} />
        <StatCard title="Collection Rate" value={financeStats.rate} icon={CreditCard} />
      </div>

      {/* CHARTS */}
      <div className="grid lg:grid-cols-2 gap-8">

        {/* LINE */}
        <div className="bg-white p-6 rounded-2xl">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={trendData}>
              <CartesianGrid stroke="#eee" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Line dataKey="collection" stroke="#4F46E5" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* PIE */}
        <div className="bg-white p-6 rounded-2xl">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={statusData} dataKey="value">
                {(statusData || []).map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <h4 className="text-xl font-black text-[#1E293B] uppercase tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            Latest Fee Payments
          </h4>

          <button className="text-[10px] font-black text-primary uppercase tracking-[0.2em] hover:opacity-70 transition-all flex items-center gap-1">
            View All <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[700px]">

            {/* HEADER */}
            <thead>
              <tr className="border-b border-slate-100">
                <th className="py-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Student</th>
                <th className="py-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                <th className="py-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                <th className="py-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Status</th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody className="divide-y divide-slate-50">
              {(recentTransactions || []).map((tx, idx) => (
                <tr
                  key={`${tx.studentId}-${idx}`}
                  className="group hover:bg-slate-50 transition-all"
                >
                  {/* STUDENT */}
                  <td className="py-5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-[#1E293B]">
                          {tx.studentName}
                        </p>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest">
                          {tx.studentId}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* AMOUNT */}
                  <td className="py-5 px-4">
                    <span className="text-sm font-black text-primary">
                      ₹{tx.amount.toLocaleString()}
                    </span>
                  </td>

                  {/* DATE */}
                  <td className="py-5 px-4">
                    <span className="text-xs font-bold text-slate-500">
                      {new Date(tx.date).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </td>

                  {/* STATUS */}
                  <td className="py-5 px-4 text-right">
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm">
                      SUCCESS
                    </span>
                  </td>
                </tr>
              ))}

              {/* EMPTY STATE */}
              {recentTransactions.length === 0 && (
                <tr>
                  <td colSpan="4" className="py-20 text-center text-slate-300 font-bold uppercase tracking-widest text-sm">
                    No transaction history
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>
      </div>

    </div>
  );
}