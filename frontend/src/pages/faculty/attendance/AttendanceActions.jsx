import React, { useState, useEffect, useCallback } from 'react';
import { useAdminData } from '../../../context/AdminDataContext';
import { useAuth } from '../../../context/AuthContext';
import { CheckCircle, Search, Loader2, RefreshCw } from 'lucide-react';

const API = "http://localhost:8000";

export default function AttendanceActions() {
  const { courses, refreshAttendance, refreshDashboardStats } = useAdminData();
  const { getToken } = useAuth();

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedCourse, setSelectedCourse] = useState('');

  // roster = array of { student_id, name, phone, course, institute, status, date }
  // loaded directly from GET /attendance/ (real DB data)
  const [roster, setRoster] = useState([]);
  const [loadingRoster, setLoadingRoster] = useState(false);
  const [togglingId, setTogglingId] = useState(null); // student_id being toggled right now
  const [message, setMessage] = useState('');

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 2500);
  };

  // ─── FETCH ROSTER FROM DB ───────────────────────────────────────────────────
  const fetchRoster = useCallback(async () => {
    if (!selectedCourse || !selectedDate) { setRoster([]); return; }

    setLoadingRoster(true);
    try {
      // Backend expects course as a repeated List[str] param: ?course=BCA
      const url = `${API}/attendance/?selected_date=${selectedDate}&course=${encodeURIComponent(selectedCourse)}`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.ok) {
        const data = await res.json();
        console.log('[Attendance] Loaded roster:', data);
        setRoster(data);
      } else {
        console.error('[Attendance] Failed to load roster:', res.status);
        setRoster([]);
      }
    } catch (err) {
      console.error('[Attendance] Fetch error:', err);
      setRoster([]);
    } finally {
      setLoadingRoster(false);
    }
  }, [selectedCourse, selectedDate, getToken]);

  // Reload whenever course or date changes
  useEffect(() => {
    fetchRoster();
  }, [fetchRoster]);

  // ─── TOGGLE SINGLE STUDENT (real-time, per-click) ─────────────────────────
  const handleToggle = async (studentId) => {
    if (togglingId) return; // prevent double-click
    setTogglingId(studentId);
    try {
      const payload = { student_id: studentId, date: selectedDate };
      console.log('[Attendance] Toggling:', payload);

      const res = await fetch(`${API}/attendance/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const updated = await res.json(); // { student_id, date, status }
        console.log('[Attendance] Toggle result:', updated);

        // Update roster row in local state immediately (no refetch needed)
        setRoster(prev => prev.map(row =>
          row.student_id === studentId
            ? { ...row, status: updated.status }
            : row
        ));

        // 🔥 SYNC: Background refresh global logs and dashboard stats
        refreshAttendance();
        refreshDashboardStats();
      } else {
        showMessage('toggle-error');
      }
    } catch (err) {
      console.error('[Attendance] Toggle error:', err);
      showMessage('toggle-error');
    } finally {
      setTogglingId(null);
    }
  };

  // ─── HELPERS ───────────────────────────────────────────────────────────────
  const isPresent = (status) => status === 'PRESENT';

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-[#1E293B] uppercase tracking-tight">Attendance Marker</h1>
        <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">Post real-time attendance directly</p>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm">

        {/* ── CONTROLS ─────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row items-end gap-4 mb-8 pb-8 border-b border-slate-100">

          <div className="flex-1 w-full">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block mb-2">Select Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full h-12 bg-[#F8FAFC] border-none rounded-2xl px-5 text-sm font-bold text-slate-700 outline-none"
            />
          </div>

          <div className="flex-1 w-full">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block mb-2">Target Course</label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full h-12 bg-[#F8FAFC] border-none rounded-2xl px-5 text-sm font-bold text-slate-700 outline-none cursor-pointer"
            >
              <option value="">Choose a course...</option>
              {(courses || []).map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Reload button */}
          <div className="w-full md:w-auto">
            <button
              onClick={fetchRoster}
              disabled={!selectedCourse || loadingRoster}
              className="h-12 px-6 bg-slate-100 text-slate-600 rounded-2xl font-bold flex items-center gap-2 disabled:opacity-40 hover:bg-slate-200 transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${loadingRoster ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* ── ROSTER TABLE ─────────────────────────────────── */}
        <div>
          {loadingRoster ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-300">
              <Loader2 className="w-10 h-10 mb-4 animate-spin opacity-40" />
              <p className="font-bold text-sm tracking-tight">Loading roster from database...</p>
            </div>

          ) : roster.length > 0 ? (
            <>
              {/* summary bar */}
              <div className="flex gap-4 mb-6">
                <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100">
                  ✅ Present: {roster.filter(r => isPresent(r.status)).length}
                </span>
                <span className="text-xs font-black text-rose-600 bg-rose-50 px-4 py-2 rounded-xl border border-rose-100">
                  ❌ Absent: {roster.filter(r => !isPresent(r.status)).length}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[500px]">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50">
                      <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest rounded-tl-xl">ID</th>
                      <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Name</th>
                      <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right rounded-tr-xl">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {roster.map(student => (
                      <tr key={student.student_id} className="hover:bg-slate-50">
                        <td className="py-4 px-6 text-[11px] font-black text-slate-400 tracking-widest">{student.student_id}</td>
                        <td className="py-4 px-6 text-sm font-black text-[#1E293B]">{student.name}</td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => handleToggle(student.student_id)}
                            disabled={togglingId === student.student_id}
                            className={`w-[130px] h-10 rounded-xl flex items-center justify-center ml-auto text-[10px] font-black uppercase tracking-widest transition-all ${
                              togglingId === student.student_id
                                ? 'bg-slate-100 text-slate-400'
                                : isPresent(student.status)
                                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-100'
                                  : 'bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100'
                            }`}
                          >
                            {togglingId === student.student_id
                              ? <Loader2 className="w-4 h-4 animate-spin" />
                              : isPresent(student.status) ? 'Present ✅' : 'Absent ❌'
                            }
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="text-[10px] text-slate-400 font-bold mt-6 text-center uppercase tracking-widest">
                Click a status to toggle — changes save instantly to database
              </p>
            </>

          ) : (
            <div className="py-20 flex flex-col items-center justify-center text-slate-300">
              <Search className="w-12 h-12 mb-4 opacity-20" />
              <p className="font-bold text-sm tracking-tight capitalize">
                {selectedCourse ? 'No students found for this course' : 'Select a course to load roster'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── TOAST ──────────────────────────────────────────── */}
      {message && (
        <div className="fixed bottom-6 right-6 px-6 py-3 bg-rose-500 text-white rounded-xl font-bold shadow-lg z-50">
          {message === 'toggle-error' && 'Toggle failed — check backend ❌'}
        </div>
      )}
    </div>
  );
}
