import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import AdminLayout from "../../../layouts/AdminLayout";
import { CheckCircle, Calendar, AlertCircle, User, Search, RotateCcw, ChevronLeft, ChevronRight, MoreHorizontal, X, ArrowUpDown, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
} from "@tanstack/react-table";

import { useAdminData } from "../../../context/AdminDataContext";
import { useAuth } from "../../../context/AuthContext";
import { InfinityLoader } from "../../../components/ui/loader-13";
import { cardVariants, buttonVariants, staggerContainer, tableRowVariants } from "../../../utils/motion";

const API = "http://localhost:8000";

export default function AttendanceManagement({noLayout = false, hideStats = false }) {
  const { students: ALL_STUDENTS, courses } = useAdminData();
  const { getToken } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [sorting, setSorting] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const itemsPerPage = 7;

  // Attendance data fetched from API (replaces ATTENDANCE_LOGS context)
  const [attendanceData, setAttendanceData] = useState([]);
  const [fetchingAttendance, setFetchingAttendance] = useState(false);

  // Filter States
  const [filters, setFilters] = useState({
    date: new Date().toISOString().split('T')[0],
    institute: "",
    course: "",
    status: "All Status",
    search: ""
  });

  // Fetch attendance from API whenever date or course changes
  const fetchAttendance = useCallback(async () => {
    const token = getToken();
    if (!token || !filters.date) return;

    setFetchingAttendance(true);
    try {
      let url = `${API}/attendance/?selected_date=${filters.date}`;
      if (filters.course) url += `&course=${encodeURIComponent(filters.course)}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setAttendanceData(data);
      } else {
        setAttendanceData([]);
      }
    } catch (err) {
      console.error('[AttendanceManagement] Fetch error:', err);
    } finally {
      setFetchingAttendance(false);
    }
  }, [filters.date, filters.course, getToken]);

  useEffect(() => { fetchAttendance(); }, [fetchAttendance]);

  const handleReset = () => {
    setFilters({
      date: new Date().toISOString().split('T')[0],
      institute: "",
      course: "",
      status: "All Status",
      search: ""
    });
    setSelectedStudent(null);
    setCurrentPage(1);
  };




  // Stats computed from API attendance data
  const stats = useMemo(() => {
    const totalStudentsCount = ALL_STUDENTS.length;
    const presentToday = attendanceData.filter(r => r.status === 'PRESENT').length;
    const absentToday = attendanceData.filter(r => r.status === 'ABSENT').length;
    const marked = attendanceData.length;
    const todayPercentage = marked > 0 ? ((presentToday / marked) * 100).toFixed(1) : "0.0";
    const absentPercentage = marked > 0 ? ((absentToday / marked) * 100).toFixed(1) : "0.0";
    return { totalStudentsCount, presentToday, absentToday, todayPercentage, monthlyAverage: todayPercentage, absentPercentage };
  }, [attendanceData, ALL_STUDENTS]);

  // Build student rows from API attendance data
  const filteredStudents = useMemo(() => {
    // Map attendance API response into student rows
    return attendanceData
      .filter(r => {
        const matchesInstitute = !filters.institute || r.institute === filters.institute;
        const matchesStatus = filters.status === "All Status" ||
          (filters.status === "Present" && r.status === "PRESENT") ||
          (filters.status === "Absent" && r.status === "ABSENT");
        const matchesSearch = !filters.search ||
          r.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          r.student_id.toLowerCase().includes(filters.search.toLowerCase());
        return matchesInstitute && matchesStatus && matchesSearch;
      })
      .map(r => ({
        studentId: r.student_id,
        name: r.name,
        phone: r.phone || '',
        institute: r.institute || '',
        course: r.course || '',
        admissionDate: '',
        // Normalize to mixed-case for UI display
        status: r.status === 'PRESENT' ? 'Present' : r.status === 'ABSENT' ? 'Absent' : 'Not Marked',
        avatar: `https://i.pravatar.cc/150?u=${r.student_id}`,
      }));
  }, [attendanceData, filters]);

  // Column definitions for TanStack Table
  const columns = useMemo(() => [
    {
      accessorKey: "studentId",
      header: ({ column }) => (
        <div className="flex items-center gap-2 cursor-pointer select-none" onClick={() => column.toggleSorting()}>
          STUDENT ID
          <ArrowUpDown className="w-3 h-3" />
        </div>
      ),
      cell: ({ row }) => <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{row.getValue("studentId")}</span>,
    },
    {
      accessorKey: "name",
      header: "NAME",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full overflow-hidden border-none bg-slate-100 shadow-sm shrink-0">
            <img src={row.original.avatar} alt={row.getValue("name")} className="w-full h-full object-cover" />
          </div>
          <span className="text-[14px] font-bold text-[#0f172a] tracking-tight whitespace-nowrap">{row.getValue("name")}</span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "STATUS",
      cell: ({ row }) => {
        const status = row.getValue("status");
        return (
          <span className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-[0.3em] w-max ${status === 'Present' ? 'bg-emerald-50 text-emerald-600' :
            status === 'Absent' ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-400'
            }`}>
            <div className={`w-1.5 h-1.5 rounded-full ${status === 'Present' ? 'bg-emerald-600' :
              status === 'Absent' ? 'bg-rose-600' : 'bg-slate-400'
              }`} />
            {status}
          </span>
        );
      },
    },
    {
      accessorKey: "phone",
      header: "PHONE",
      cell: ({ row }) => <span className="text-[13px] font-medium text-slate-500 whitespace-nowrap">{row.getValue("phone")}</span>,
    },
    {
      accessorKey: "admissionDate",
      header: "ADMISSION DATE",
      cell: ({ row }) => <span className="text-xs font-bold text-slate-400 opacity-60 whitespace-nowrap uppercase tracking-tight">{row.getValue("admissionDate")}</span>,
    },
  ], []);

  const table = useReactTable({
    data: filteredStudents,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const rows = table.getRowModel().rows;
  const currentStudentsRows = rows.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

const content = (
  <>
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold text-[#0f172a] tracking-normal leading-normal">Monitor and manage student attendance</h2>
          {/* <p className="text-[13px] font-bold text-slate-400 mt-1 uppercase tracking-widest opacity-60">Monitor and manage student attendance</p> */}
        </div>

        {/* Dynamic Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <StatCard
            i={0}
            label="Today's Attendance"
            val={`${stats.todayPercentage}%`}
            sub={`${stats.presentToday} / ${stats.totalStudentsCount} present`}
            color="blue"
            icon={CheckCircle}
          />
          <StatCard
            i={1}
            label="This Month's Average"
            val={`${stats.monthlyAverage}%`}
            sub="Average attendance"
            color="emerald"
            icon={Calendar}
          />
          <StatCard
            i={2}
            label="Total Students"
            val={stats.totalStudentsCount.toString()}
            sub="Across all courses"
            color="indigo"
            icon={User}
          />
          <StatCard
            i={3}
            label="Absent Today"
            val={stats.absentToday.toString()}
            sub={`${stats.absentPercentage}% of total`}
            color="rose"
            icon={AlertCircle}
          />
        </div>

        {/* Filters Bar */}
        <div className="bg-white rounded-[24px] border border-[#e2e8f0] p-4 md:p-6 flex flex-col gap-4 shadow-sm min-w-0">
          <div className="flex flex-wrap items-end gap-3 md:gap-4">
            <div className="flex flex-col gap-1 flex-1 min-w-[140px]">
              <label className="text-[13px] font-medium text-[#475569] ml-1">Select Date</label>
              <div className="relative">
                <input
                  type="date"
                  value={filters.date}
                  onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                  className="w-full bg-white border border-[#f1f5f9] rounded-xl px-4 py-2.5 pr-10 text-[14px] font-medium text-[#0f172a] focus:ring-4 focus:ring-[#0284c7]/10 focus:border-[#0284c7] transition-all outline-none"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <DropdownFilter
              label="Institute"
              val={filters.institute}
              setVal={(v) => setFilters({ ...filters, institute: v, course: "" })}
              options={["GIT", "GICSA"]}
              placeholder="All Institutes"
              disabled={!filters.date}
              className="flex-1 min-w-[140px]"
            />

            <DropdownFilter
              label="Course"
              val={filters.course}
              setVal={(v) => setFilters({ ...filters, course: v })}
              options={(courses || [])
                .filter(c => !filters.institute || c.institute === filters.institute)
                .map(c => c.name)}
              disabled={!filters.date}
              placeholder="All Courses"
              className="flex-1 min-w-[140px]"
            />
          </div>

          <div className="flex flex-wrap items-end gap-3 md:gap-4">
            <DropdownFilter
              label="Status"
              val={filters.status}
              setVal={(v) => setFilters({ ...filters, status: v })}
              options={["All Status", "Present", "Absent"]}
              disabled={!filters.date || !filters.institute}
              placeholder="Select Status"
              className="flex-1 min-w-[120px]"
            />

            <div className="flex-[2] min-w-[200px]">
              <label className="text-[13px] font-medium text-[#475569] ml-1 mb-1 block">Search</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search student..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="w-full bg-white border border-[#f1f5f9] rounded-xl px-4 py-2.5 pl-10 text-[14px] font-medium outline-none focus:ring-4 focus:ring-[#0284c7]/10 focus:border-[#0284c7] transition-all placeholder:text-[#94a3b8] text-[#0f172a]"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
            </div>

            <button onClick={handleReset} className="bg-slate-50 text-[#0f172a] border border-[#e2e8f0] rounded-xl px-4 py-2.5 hover:bg-slate-100 transition-all flex items-center justify-center gap-2 shrink-0 w-full sm:w-auto mt-2 sm:mt-0 font-bold text-[12px] active:scale-95">
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>
        </div>

        {/* Students Table Section */}
        <div className="bg-white rounded-[24px] border border-[#e2e8f0] shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 md:p-8 border-b border-[#f1f5f9] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#f8fafc]">
            <h3 className="text-lg md:text-xl font-bold text-[#0f172a] tracking-tight truncate">
              Students List {filters.date ? `- ${new Date(filters.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}` : ''}
            </h3>
          </div>

          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200">
            {fetchingAttendance ? (
              <div className="py-24 flex flex-col items-center justify-center bg-slate-50/5 animate-in fade-in duration-500">
                <InfinityLoader size={80} className="[&>svg>path:last-child]:stroke-[#0284c7] [&>svg>path:last-child]:drop-shadow-[0_0_12px_rgba(2,132,199,0.2)]" />
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-8 flex items-center gap-2">
                  <span className="w-8 h-[1px] bg-[#f1f5f9]"></span>
                  Processing Records
                  <span className="w-8 h-[1px] bg-[#f1f5f9]"></span>
                </p>
              </div>
            ) : (
              <table className="w-full text-left min-w-[900px]">
                <thead>
                  {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id} className="bg-[#f8fafc]">
                      {(headerGroup.headers || []).map(header => (
                        <th key={header.id} className="py-4 md:py-5 px-6 md:px-8 text-[10px] font-bold text-[#94a3b8] uppercase tracking-widest">
                          {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                  {currentStudentsRows.length > 0 ? (
                    (currentStudentsRows || []).map((row) => (
                      <tr
                        key={row.id}
                        onClick={() => setSelectedStudent(row.original)}
                        className={`group hover:bg-[#f8fafc] transition-all cursor-pointer ${selectedStudent?.studentId === row.original.studentId ? 'bg-[#0284c7]/5' : ''}`}
                      >
                        {row.getVisibleCells().map(cell => (
                          <td key={cell.id} className="py-4 md:py-6 px-6 md:px-8">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={columns.length} className="py-20 text-center">
                        <div className="flex flex-col items-center gap-4 text-slate-300">
                          <Search className="w-12 h-12 opacity-20" />
                          <p className="font-bold text-sm tracking-tight capitalize">
                            No students found for this selection
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          <div className="p-6 border-t border-[#f1f5f9] flex flex-col sm:flex-row items-center justify-between gap-6 bg-[#f8fafc]">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest order-2 sm:order-1 text-center sm:text-left">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredStudents.length)} of {filteredStudents.length} students
            </span>
            <div className="flex items-center gap-2 order-1 sm:order-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="w-9 h-9 md:w-10 md:h-10 rounded-xl border border-[#f1f5f9] flex items-center justify-center text-slate-400 hover:bg-white hover:text-[#0284c7] transition-all disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {[...Array(Math.min(5, totalPages))].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center text-[10px] md:text-[11px] font-bold transition-all ${currentPage === i + 1 ? 'bg-[#0284c7] text-white shadow-lg shadow-indigo-500/20' : 'border border-[#f1f5f9] text-slate-400 hover:bg-white hover:text-[#0284c7]'
                    }`}
                >
                  {i + 1}
                </button>
              ))}

              {totalPages > 5 && (
                <>
                  <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-slate-300">
                    <MoreHorizontal className="w-4 h-4" />
                  </div>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className={`w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center text-[10px] md:text-[11px] font-bold transition-all border border-[#f1f5f9] text-slate-400 hover:bg-white hover:text-[#0284c7] ${currentPage === totalPages ? 'bg-[#0284c7] text-white shadow-lg shadow-indigo-500/20' : ''}`}
                  >
                    {totalPages}
                  </button>
                </>
              )}

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="w-9 h-9 md:w-10 md:h-10 rounded-xl border border-[#f1f5f9] flex items-center justify-center text-slate-400 hover:bg-white hover:text-[#0284c7] transition-all disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </div>
      <StudentModal
        isOpen={!!selectedStudent}
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
      />
    </>
  );
  return noLayout ? content : <AdminLayout>{content}</AdminLayout>;
}

// Subcomponents
function StatCard({ label, val, sub, icon: Icon, color, i }) {
  const colors = {
    blue: "bg-indigo-50 text-[#0284c7]",
    emerald: "bg-emerald-50 text-emerald-600",
    indigo: "bg-[#f1f5f9] text-[#0284c7]",
    rose: "bg-rose-50 text-rose-600"
  };

  return (
    <motion.div
      variants={cardVariants}
      whileHover="hover"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.1 }}
      className="bg-white p-8 rounded-[24px] border border-[#f1f5f9] shadow-sm hover:shadow-lg transition-all group"
    >
      <div className="flex items-start justify-between mb-8">
        <div className={`p-4 rounded-2xl ${colors[color]} group-hover:scale-110 transition-transform`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{label}</p>
      <div className="flex items-baseline gap-3">
        <h4 className="text-3xl font-bold text-[#0f172a] tracking-tighter">{val}</h4>
        <span className="text-[10px] font-bold text-slate-400 opacity-60 uppercase tracking-widest">{sub}</span>
      </div>
    </motion.div>
  );
}

function DropdownFilter({ label, val, setVal, options, placeholder, disabled, className }) {
  return (
    <div className={`flex flex-col gap-1 ${className || 'flex-1'} ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      <label className="text-[13px] font-medium text-[#475569] ml-1">{label}</label>
      <div className="relative">
        <select
          value={val}
          onChange={(e) => setVal(e.target.value)}
          disabled={disabled}
          className={`w-full bg-white border border-[#f1f5f9] rounded-xl px-4 py-2.5 text-[14px] font-medium text-[#0f172a] appearance-none focus:ring-4 focus:ring-[#0284c7]/10 focus:border-[#0284c7] transition-all outline-none pr-10 ${disabled ? 'opacity-50 cursor-not-allowed border-none bg-slate-50' : ''}`}
        >
          {placeholder && <option value="" hidden>{placeholder}</option>}
          {(options || []).map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
      </div>
    </div>
  );
}

function StudentModal({ isOpen, student, onClose }) {
  const { getToken } = useAuth();
  const [viewDate, setViewDate] = useState(new Date(2026, 3));
  const [studentRecords, setStudentRecords] = useState([]);

  // Fetch from GET /attendance/student/:id when student changes
  useEffect(() => {
    if (!student) return;
    const token = getToken();
    if (!token) return;

    fetch(`${API}/attendance/student/${student.studentId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        console.log('[Calendar] Student attendance records:', data.length);
        setStudentRecords(data);
      })
      .catch(() => setStudentRecords([]));
  }, [student]);

  const viewMonth = viewDate.getMonth();
  const viewYear = viewDate.getFullYear();

  const prevMonth = () => {
    if (viewYear === 2025 && viewMonth === 0) return;
    setViewDate(new Date(viewYear, viewMonth - 1));
  };

  const nextMonth = () => {
    if (viewYear === 2026 && viewMonth === 11) return;
    setViewDate(new Date(viewYear, viewMonth + 1));
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  // Generate dynamic calendar from real DB records
  const monthDays = useMemo(() => {
    if (!student) return [];
    const days = [];
    const firstDay = new Date(viewYear, viewMonth, 1);
    const lastDay = new Date(viewYear, viewMonth + 1, 0).getDate();
    const startOffset = (firstDay.getDay() + 6) % 7;

    for (let i = 0; i < startOffset; i++) days.push(null);

    for (let d = 1; d <= lastDay; d++) {
      const dateStr = `${viewYear}-${(viewMonth + 1).toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
      // Backend returns { date: "2026-04-16", status: "PRESENT" }
      const record = studentRecords.find(r => {
        const rDate = typeof r.date === 'string' ? r.date : String(r.date);
        return rDate === dateStr;
      });

      let status = 'Other';
      if (record) {
        status = record.status === 'PRESENT' ? 'Present' : 'Absent';
      }

      days.push({ day: d, status });
    }
    return days;
  }, [student, studentRecords, viewMonth, viewYear]);

  if (!isOpen || !student) return null;

  const modalContent = (
    <AnimatePresence>
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-[#0f172a]/40 backdrop-blur-sm px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-[40px] w-full max-w-[340px] overflow-hidden shadow-2xl relative p-8 flex flex-col items-center"
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 hover:bg-slate-50 rounded-full transition-all text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-20 h-20 rounded-[24px] overflow-hidden border-4 border-slate-50 shadow-lg mb-4">
            <img src={student.avatar} alt={student.name} className="w-full h-full object-cover" />
          </div>

          <h3 className="text-xl font-bold text-[#0f172a] tracking-tight">{student.name}</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 mb-8">{student.studentId}</p>

          {/* Attendance Calendar */}
          <div className="w-full bg-[#f8fafc] rounded-[32px] p-6 border border-[#f1f5f9]">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-[10px] font-bold text-[#0f172a] uppercase tracking-widest">{monthNames[viewMonth]} {viewYear}</h4>
              <div className="flex gap-2">
                <button
                  onClick={prevMonth}
                  disabled={viewYear === 2025 && viewMonth === 0}
                  className="p-1.5 bg-white border border-[#f1f5f9] rounded-lg text-slate-400 hover:text-[#0284c7] transition-colors disabled:opacity-20"
                >
                  <ChevronLeft className="w-3 h-3" />
                </button>
                <button
                  onClick={nextMonth}
                  disabled={viewYear === 2026 && viewMonth === 3}
                  className="p-1.5 bg-white border border-[#f1f5f9] rounded-lg text-slate-400 hover:text-[#0284c7] transition-colors disabled:opacity-20"
                >
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-2">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                <div key={i} className="text-[8px] font-bold text-[#94a3b8] text-center">{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {(monthDays || []).map((d, index) => (
                <div key={index} className="aspect-square flex items-center justify-center">
                  {!d ? null : (
                    <div className={`w-full aspect-square rounded-[8px] flex items-center justify-center text-[10px] font-bold transition-all shadow-sm ${d.status === 'Present' ? 'bg-emerald-500 text-white' :
                      d.status === 'Absent' ? 'bg-rose-500 text-white' :
                        'bg-amber-400 text-white'
                      }`}>
                      {d.day}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-center gap-4 border-t border-[#f1f5f9] pt-5">
              <div className="flex items-center gap-1.5 ">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Present</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Absent</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Other</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}

function ChevronDown(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
