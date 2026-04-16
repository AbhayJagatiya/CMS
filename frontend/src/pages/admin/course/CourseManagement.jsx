import { useMemo, useState, useEffect, useRef } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import { BookOpen, CheckCircle, ChevronLeft, ChevronRight, Search, Users, AlertCircle, X, ArrowUpDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
} from "@tanstack/react-table";
import { useAdminData } from "../../../context/AdminDataContext";
import { InfinityLoader } from "../../../components/ui/loader-13";

export default function CourseManagement({noLayout = false, hideStats = false }) {
  const { students, courses, coursesLoading, setCourses, attendanceLogs } = useAdminData();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sorting, setSorting] = useState([]);
  const [filters, setFilters] = useState({ search: "", status: "All Status", faculty: "All Faculty", feeRange: "All Fees", institute: "All Institute" });
  const itemsPerPage = 6;

  // Filter Logic
  const filteredCourses = useMemo(() => {
    if (coursesLoading) return [];
    return (courses || []).filter(c => {
      const matchesSearch = (c.name || "").toLowerCase().includes(filters.search.toLowerCase()) ||
        (c.id || "").toString().toLowerCase().includes(filters.search.toLowerCase());
      const matchesStatus = filters.status === "All Status" || c.status === filters.status;
      const matchesFaculty = filters.faculty === "All Faculty" || c.faculty === filters.faculty;
      const matchesInstitute = filters.institute === "All Institute" || c.institute === filters.institute;

      let matchesFee = true;
      if (filters.feeRange === "Under INR 3L") matchesFee = (c.fee || 0) < 300000;
      else if (filters.feeRange === "INR 3L - INR 5L") matchesFee = (c.fee || 0) >= 300000 && (c.fee || 0) <= 500000;
      else if (filters.feeRange === "Over INR 5L") matchesFee = (c.fee || 0) > 500000;

      return matchesSearch && matchesStatus && matchesFaculty && matchesFee && matchesInstitute;
    });
  }, [courses, filters, coursesLoading]);

  // Reset page relative to filters
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const courseColumns = useMemo(() => [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <div className="flex items-center gap-2 cursor-pointer select-none" onClick={() => column.toggleSorting()}>
          COURSE ID
          <ArrowUpDown className="w-3 h-3" />
        </div>
      ),
      cell: ({ row }) => <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{row.getValue("id")}</span>,
    },
    {
      accessorKey: "institute",
      header: "INSTITUTE",
      cell: ({ row }) => (

        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
          row.getValue("institute") === 'GIT' ? 'bg-indigo-50 text-error' : 'bg-amber-50 text-amber-600'
        }`}>
          {row.getValue("institute")}
        </span>
      ),
    },
    {
      accessorKey: "name",
      header: "COURSE NAME",
      cell: ({ row }) => <span className="text-[14px] font-bold text-[#0f172a] tracking-tight whitespace-nowrap">{row.getValue("name")}</span>,
    },
    {
      accessorKey: "fee",
      header: "COURSE FEE",
      cell: ({ row }) => {
        const fee = Number(row.getValue("fee") || 0);
        const displayFee = fee >= 1000 ? `₹${(fee / 100000).toFixed(2)} L` : `₹${fee}`;
        return <span className="text-xs font-bold text-primary whitespace-nowrap">{displayFee}</span>;
      },
    },
    {
      accessorKey: "duration",
      header: "DURATION",
      cell: ({ row }) => <span className="text-xs font-bold text-slate-500 whitespace-nowrap">{row.getValue("duration")}</span>,
    },
    {
      accessorKey: "faculty",
      header: "FACULTY",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 group-hover:bg-primary group-hover:text-white transition-all">
            {row.getValue("faculty")?.[0] || '?'}
          </div>
          <span className="text-xs font-bold text-slate-600">{row.getValue("faculty") || 'N/A'}</span>
        </div>
      ),
    },
    {
      accessorKey: "students",
      header: () => <div className="text-center whitespace-nowrap">ENROLLMENT</div>,
      cell: ({ row }) => <div className="text-sm font-black text-[#0f172a] text-center">{row.getValue("students")}</div>,
    },
    {
      accessorKey: "status",
      header: "STATUS",
      cell: ({ row }) => (
        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${row.getValue("status") === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
          }`}>
          {row.getValue("status")}
        </span>
      ),
    },
  ], []);

  const table = useReactTable({
    data: filteredCourses,
    columns: courseColumns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const enrolledColumns = useMemo(() => [
    {
      accessorKey: "name",
      header: "STUDENT NAME",
      cell: ({ row }) => <span className="text-xs font-black text-[#0f172a]">{row.getValue("name")}</span>,
    },
    {
      accessorKey: "studentId",
      header: "ID",
      cell: ({ row }) => <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{row.getValue("studentId")}</span>,
    },
    {
      accessorKey: "email",
      header: "EMAIL",
      cell: ({ row }) => <span className="text-xs font-bold text-slate-500">{row.getValue("email")}</span>,
    },
    {
      accessorKey: "attendance",
      header: () => <div className="text-right">ATTENDANCE</div>,
      cell: ({ row }) => (
        <div className="text-right">
          <span className={`text-xs font-black ${row.getValue("attendance") >= 75 ? 'text-emerald-500' : 'text-rose-500'}`}>{row.getValue("attendance")}%</span>
        </div>
      ),
    },
  ], []);

  const enrolledStudents = useMemo(() => {
    if (!selectedCourse) return [];
    
    return students
      .filter(s => s.course === selectedCourse.name)
      .map(s => {
        // Calculate real attendance for this student
        const studentLogs = (attendanceLogs || []).filter(l => 
          (l.student_id || l.studentId) === s.studentId
        );
        
        let attendancePct = 0;
        if (studentLogs.length > 0) {
          const present = studentLogs.filter(l => l.status === "PRESENT").length;
          attendancePct = Math.round((present / studentLogs.length) * 100);
        }

        return {
          ...s,
          attendance: attendancePct
        };
      });
  }, [selectedCourse, students, attendanceLogs]);

  const enrolledTable = useReactTable({
    data: enrolledStudents,
    columns: enrolledColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Pagination
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const tableRows = table.getRowModel().rows;
  const currentCoursesRows = tableRows.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const stats = useMemo(() => {
    const totalEnrolled = (courses || []).reduce((acc, curr) => acc + (curr.students || 0), 0);
    return [
      { label: "Total Courses", val: (courses || []).length, icon: BookOpen, color: "bg-indigo-50 text-primary" },
      { label: "Active Courses", val: (courses || []).filter(c => c.status === "Active").length, icon: CheckCircle, color: "bg-emerald-50 text-emerald-600" },
      { label: "Inactive Courses", val: (courses || []).filter(c => c.status === "Inactive").length, icon: AlertCircle, color: "bg-rose-50 text-rose-600" },
      { label: "Total Enrolled", val: totalEnrolled.toLocaleString(), icon: Users, color: "bg-amber-50 text-amber-600" },
    ];
  }, [courses]);

  const facultyOptions = ["All Faculty", ...new Set((courses || []).map(c => c.faculty))];

const content = (
  <>
   
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-[#0f172a] tracking-normal leading-normal">Manage academic programs and faculty assignments</h2>
            {/* <p className="text-[13px] font-medium text-slate-400 mt-1 uppercase tracking-widest">Manage academic programs and faculty assignments</p> */}
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {(stats || []).map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-[24px] md:rounded-[28px] border border-slate-200 shadow-sm transition-all duration-200 hover:shadow-lg hover:shadow-black/5 group cursor-pointer active:scale-[0.98]">
              <div className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl ${stat.color} flex items-center justify-center mb-4 md:mb-5 shrink-0 transition-transform duration-200 group-hover:scale-110`}>
                <stat.icon className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 opacity-60">{stat.label}</p>
              <h4 className="text-3xl font-bold text-[#0f172a] tracking-tighter">{stat.val}</h4>
            </div>
          ))}
        </div>

        {/* Filters bar */}
        <div className="bg-white rounded-[24px] border border-slate-200 p-4 md:p-6 flex flex-wrap gap-4 items-end shadow-sm">
          <div className="flex flex-col gap-1 flex-grow min-w-[200px] sm:min-w-[300px]">
             <label className="text-[13px] font-medium text-[#475569] ml-1">Search Courses</label>
             <div className="relative">
                <input 
                  type="text" 
                  placeholder="ID or Course Name..." 
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="w-full bg-white border border-[#f1f5f9] rounded-xl px-4 py-2.5 pl-10 text-[14px] font-medium outline-none focus:ring-4 focus:ring-[#0284c7]/10 focus:border-[#0284c7] transition-all placeholder:text-[#94a3b8] text-[#0f172a]"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
             </div>
          </div>
          
          <div className="grid grid-cols-2 md:flex md:flex-row gap-4 w-full lg:w-auto">
             <Dropdown label="Institute" value={filters.institute} options={["All Institute", "GIT", "GICSA"]} onChange={(v) => setFilters(prev => ({ ...prev, institute: v }))} />
             <Dropdown label="Status" value={filters.status} options={["All Status", "Active", "Inactive"]} onChange={(v) => setFilters(prev => ({ ...prev, status: v }))} />
             <Dropdown label="Fee Range" value={filters.feeRange} options={["All Fees", "Under INR 3L", "INR 3L - INR 5L", "Over INR 5L"]} onChange={(v) => setFilters(prev => ({ ...prev, feeRange: v }))} />
             <Dropdown label="Faculty" value={filters.faculty} options={facultyOptions} onChange={(v) => setFilters(prev => ({ ...prev, faculty: v }))} />
          </div>
        </div>

        {/* Main Table */}
        <div className="bg-white rounded-[24px] border border-[#e2e8f0] shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 md:p-8 border-b border-slate-50 bg-slate-50/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
             <h3 className="text-xl font-bold text-[#0f172a] tracking-tight truncate uppercase">System Courses List</h3>
          </div>
          <div className="overflow-x-auto md:overflow-visible lg:overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200">
             {coursesLoading ? (
                <div className="py-24 flex flex-col items-center justify-center bg-slate-50/5 animate-in fade-in duration-500">
                   <InfinityLoader size={80} className="[&>svg>path:last-child]:stroke-primary [&>svg>path:last-child]:drop-shadow-[0_0_12px_rgba(79,70,229,0.2)]" />
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-8 flex items-center gap-2">
                      <span className="w-8 h-[1px] bg-slate-200"></span>
                      Processing Records
                      <span className="w-8 h-[1px] bg-slate-200"></span>
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
                    {(currentCoursesRows || []).map((row) => (
                      <tr 
                        key={row.id} 
                        onClick={() => setSelectedCourse(row.original)}
                        className={`group border-b border-[#f1f5f9] hover:bg-[#f8fafc] transition-all duration-200 cursor-pointer ${selectedCourse?.id === row.original.id ? 'bg-primary/5' : ''}`}
                      >
                        {row.getVisibleCells().map(cell => (
                          <td key={cell.id} className="py-4 md:py-5 px-6 md:px-8 text-[#0f172a]">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
             )}
          </div>
          
          {/* Pagination */}
          <div className="p-6 border-t border-slate-50 bg-slate-50/5 flex flex-col sm:flex-row justify-between items-center gap-6">
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest order-2 sm:order-1">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredCourses.length)} of {filteredCourses.length} entries
             </span>
             <div className="flex items-center gap-2 order-1 sm:order-2">
                <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} className="w-9 h-9 md:w-10 md:h-10 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-primary hover:bg-white transition-all duration-200 active:scale-95"><ChevronLeft className="w-4 h-4" /></button>
                {[...Array(Math.min(5, totalPages))].map((_, i) => (
                  <button 
                    key={i} 
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-9 h-9 md:w-10 md:h-10 rounded-xl text-[10px] md:text-[11px] font-bold transition-all duration-200 active:scale-95 ${currentPage === i + 1 ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'border border-slate-100 text-slate-400 hover:text-primary hover:bg-white'}`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} className="w-9 h-9 md:w-10 md:h-10 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-primary hover:bg-white transition-all duration-200 active:scale-95"><ChevronRight className="w-4 h-4" /></button>
             </div>
          </div>
        </div>

        {/* Details Section */}
        <AnimatePresence mode="wait">
          {selectedCourse && (
            <motion.div 
              key={selectedCourse.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[24px] md:rounded-[32px] border border-slate-200 shadow-sm p-6 md:p-10 relative overflow-hidden"
            >
              <button 
                onClick={() => setSelectedCourse(null)}
                className="absolute top-6 right-6 md:top-8 md:right-8 p-2 hover:bg-slate-50 rounded-full transition-all text-slate-300"
              >
                 <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col gap-10 md:gap-12">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
                  <div className="flex-1">
                    <h3 className="text-3xl font-bold text-[#0f172a] tracking-tighter mb-4 truncate">{selectedCourse.name}</h3>
                    <p className="text-[14px] font-medium text-slate-400 leading-relaxed mb-8 max-w-2xl">{selectedCourse.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
                       <DetailItem label="Course ID" val={selectedCourse.id} />
                       <DetailItem label="Course Fee" val={`INR ${Number(selectedCourse.fee || 0).toFixed(2)} Lakh`} />
                       <DetailItem label="Duration" val={selectedCourse.duration} />
                       <DetailItem label="Faculty" val={selectedCourse.faculty} />
                       <DetailItem label="Status" val={selectedCourse.status} />
                    </div>
                  </div>

                </div>

                {/* Enrolled Students Table */}
                <div className="flex flex-col gap-6">
                   <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-primary" />
                      <h4 className="text-xl font-bold text-[#0f172a] tracking-tight">Currently Enrolled Students</h4>
                   </div>

                   <div className="bg-[#F8FAFC] rounded-[20px] md:rounded-[24px] border border-slate-200 overflow-hidden">
                      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200">
                         <table className="w-full text-left min-w-[600px]">
                           <thead>
                              {enrolledTable.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id} className="bg-[#f8fafc]">
                                  {(headerGroup.headers || []).map(header => (
                                    <th key={header.id} className="py-3 px-6 md:px-8 text-[10px] font-bold text-[#94a3b8] uppercase tracking-widest">
                                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </th>
                                  ))}
                                </tr>
                              ))}
                           </thead>
                           <tbody className="divide-y divide-[#f1f5f9]">
                              {enrolledTable.getRowModel().rows.map((row) => (
                                 <tr key={row.id} className="hover:bg-[#f8fafc] transition-all border-b border-[#f1f5f9]">
                                    {row.getVisibleCells().map(cell => (
                                      <td key={cell.id} className="py-3 md:py-4 px-6 md:px-8 text-[#0f172a]">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                      </td>
                                    ))}
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                      </div>
                   </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
    return noLayout ? content : <AdminLayout>{content}</AdminLayout>;

}


// Subcomponents
function Dropdown({ label, value, options, onChange }) {
  return (

    <div className="flex flex-col gap-1 flex-1 min-w-[150px]">
       <label className="text-[13px] font-medium text-[#475569] ml-1">{label}</label>
       <div className="relative">
          <select 
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-white border border-[#f1f5f9] rounded-xl px-4 py-2.5 text-[14px] font-medium appearance-none outline-none focus:ring-4 focus:ring-[#0284c7]/10 focus:border-[#0284c7] transition-all cursor-pointer pr-10 text-[#0f172a]"
          >
             {(options || []).map(opt => <option key={opt}>{opt}</option>)}
          </select>
          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
       </div>
    </div>
  );
}

function DetailItem({ label, val }) {
  return (
    <div>
       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
       <p className="text-[14px] font-medium text-slate-700 tracking-tight">{val}</p>
       </div>
  );
}

function ChevronDown(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
  );
}
