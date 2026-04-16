import { useMemo, useState, useEffect, useRef } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import { Users, Phone, MapPin, X, Search,ChevronDown, Trash2, Eye, UserCheck, UserPlus, ArrowUpDown, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearch } from "../../../context/SearchContext";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
} from "@tanstack/react-table";

import { useAdminData } from "../../../context/AdminDataContext";
import { useAuth } from "../../../context/AuthContext";
import { InfinityLoader } from "../../../components/ui/loader-13";
import { cardVariants, buttonVariants, staggerContainer } from "../../../utils/motion";

const API = "http://localhost:8000";


const StatCardShort = ({ icon: Icon, title, value, subtext, color, i }) => (
  <motion.div 
    variants={cardVariants}
    whileHover="hover"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: i * 0.1 }}
    className="bg-white rounded-[20px] p-6 flex items-center gap-6 border border-slate-200 shadow-sm flex-1 cursor-default"
  >
    <div className={`w-14 h-14 rounded-full ${color} bg-opacity-10 flex items-center justify-center text-primary`}>
      <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
    </div>
    <div>
       <p className="text-[10px] font-black text-primary uppercase tracking-widest opacity-60 mb-1">{title}</p>
       <h3 className="text-2xl font-black text-[#1E293B] tracking-tight">{value}</h3>
       <p className="text-[10px] font-bold text-slate-400 mt-0.5">{subtext}</p>
    </div>
  </motion.div>
);

const EditStudentModal = ({ isOpen, onClose, student, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    course: "",
    status: "",
    admissionDate: "",
    address: "",
    avatar: ""
  });

  useEffect(() => {
    if (student) {
      setFormData({ ...student });
    }
  }, [student, isOpen]);

  if (!isOpen || !student) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-[32px] w-full max-w-2xl overflow-hidden shadow-2xl"
        >
          <div className="p-8 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-xl font-bold text-[#0f172a] tracking-tight">Edit Student Details</h3>
            <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-all text-slate-400">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5">
            <div className="space-y-4">
               <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block">Full Name</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
               </div>
               <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block">Email Address</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
               </div>
               <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block">Phone Number</label>
                  <input 
                    type="text" 
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
               </div>
            </div>

            <div className="space-y-4">
               <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block">Course / Program</label>
                  <input 
                    type="text" 
                    value={formData.course}
                    onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
               </div>
               <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block">Status</label>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  >
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
               </div>
               <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block">Residential Address</label>
                  <input 
                    type="text" 
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
               </div>
            </div>

            <div className="md:col-span-2 mt-8 flex justify-end gap-4">
               <button onClick={onClose} className="px-8 py-3.5 bg-slate-100 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest">Cancel</button>
               <button 
                 onClick={() => { onSave(formData); onClose(); }}
                 className="px-10 py-3.5 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20"
               >
                 Save Student
               </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, studentName }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl p-10 text-center"
      >
        <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-8">
          <Trash2 className="w-10 h-10" />
        </div>
        <h3 className="text-2xl font-bold text-[#0f172a] tracking-tight mb-4">Delete Record?</h3>
        <p className="text-xs font-bold text-slate-400 leading-relaxed mb-10 px-6">
          You are about to permanently delete the profile of <span className="text-slate-800 font-bold">{studentName}</span>. This action cannot be undone.
        </p>
        <div className="flex gap-4">
           <button onClick={onClose} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all hover:bg-slate-200">Cancel</button>
           <button 
             onClick={() => { onConfirm(); onClose(); }}
             className="flex-1 py-4 bg-rose-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-rose-500/20 transition-all hover:bg-rose-600"
           >
             Yes, Delete
           </button>
        </div>
      </motion.div>
    </div>
  );
};

export default function StudentManagement({ noLayout = false, hideStats = false }){
  const { searchQuery, setSearchQuery } = useSearch();
  const [localSearch, setLocalSearch] = useState("");
  const { students, studentsLoading, setStudents, refreshStudents, courses, refreshDashboardStats } = useAdminData();
  const { getToken } = useAuth();
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [sorting, setSorting] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [instituteFilter, setInstituteFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [currentPage, setCurrentPage] = useState(1);

  const handleReset = () => {
    setInstituteFilter("");
    setCourseFilter("");
    setStatusFilter("All Status");
    setLocalSearch("");
    setCurrentPage(1);
    setSorting([]);
  };

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [instituteFilter, courseFilter, statusFilter, localSearch]);




  const filteredStudents = useMemo(() => {
    
    const filtered = students.filter(s => {
      const search = localSearch.toLowerCase();
      const matchesSearch = (s.name?.toLowerCase() || "").includes(search) || 
                           (s.email?.toLowerCase() || "").includes(search) ||
                           (s.course?.toLowerCase() || "").includes(search) ||
                           (s.studentId?.toLowerCase() || "").includes(search);
      
      const matchesInstitute = !instituteFilter || s.institute === instituteFilter;
const matchesCourse = !courseFilter || s.course === courseFilter;
      const matchesStatus = statusFilter === "All Status" || s.status === statusFilter;

      return matchesSearch && matchesInstitute && matchesCourse && matchesStatus;
    });


    return filtered;
  }, [students, localSearch, instituteFilter, courseFilter, statusFilter]);

  // Status Badge Component for reusability within columns
  const StatusBadge = ({ status }) => (
    <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
      status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
    }`}>
      {status}
    </span>
  );

  // Column definitions for TanStack Table
  const columns = useMemo(() => [
    {
      accessorKey: "studentId",
      header: ({ column }) => (
        <div className="flex items-center gap-2 cursor-pointer select-none" onClick={() => column.toggleSorting()}>
          STUDENT ID
          <ArrowUpDown className="w-3 h-3 text-slate-400" />
        </div>
      ),
      cell: ({ row }) => <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{row.getValue("studentId")}</span>,
    },
    {
      accessorKey: "name",
      header: "NAME",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0 bg-slate-100">
            <img src={row.original.avatar} alt={row.getValue("name")} className="w-full h-full object-cover" />
          </div>
          <span className="text-[14px] font-bold text-[#0f172a] tracking-tight whitespace-nowrap">{row.getValue("name")}</span>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "EMAIL",
      cell: ({ row }) => <span className="text-xs font-bold text-slate-500 lowercase">{row.getValue("email")}</span>,
    },
    {
      accessorKey: "phone",
      header: "PHONE",
      cell: ({ row }) => <span className="text-xs font-bold text-slate-500 whitespace-nowrap">{row.getValue("phone")}</span>,
    },
    {
      accessorKey: "institute",
      header: "INSTITUTE",
      cell: ({ row }) => <span className="text-xs font-bold text-slate-500 whitespace-nowrap">{row.getValue("institute")}</span>,
    },
    {
      accessorKey: "course",
      header: "COURSE",
      cell: ({ row }) => <span className="text-xs font-bold text-slate-500 whitespace-nowrap">{row.getValue("course")}</span>,
    },
    {
      accessorKey: "admissionDate",
      header: "ADMISSION DATE",
      cell: ({ row }) => <span className="text-xs font-bold text-slate-500 whitespace-nowrap">{row.getValue("admissionDate")}</span>,
    },
    {
      accessorKey: "status",
      header: "STATUS",
      cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
    },
    {
      id: "actions",
      header: () => <div className="text-right">ACTIONS</div>,
      cell: ({ row }) => (
        <div className="flex items-center justify-end">
          <motion.button
            whileHover="hover"
            whileTap="tap"
            variants={buttonVariants}
            onClick={(e) => { e.stopPropagation(); setSelectedStudent(row.original); }}
            className="p-2 hover:bg-white rounded-lg border border-slate-200 shadow-sm transition-all"
          >
            <Eye className="w-3.5 h-3.5 text-primary" />
          </motion.button>
        </div>
      ),
    },
  ], []);

  const table = useReactTable({
    data: filteredStudents,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const handleConfirmDelete = async () => {
    if (!studentToDelete) return;
    try {
      const res = await fetch(`${API}/students/${studentToDelete.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.ok) {
        await refreshStudents();
        refreshDashboardStats();
        if (selectedStudent?.studentId === studentToDelete.studentId) setSelectedStudent(null);
      } else {
        console.error('[Delete] Failed:', res.status);
      }
    } catch (err) {
      console.error('[Delete] Error:', err);
    } finally {
      setStudentToDelete(null);
    }
  };

  const handleSaveStudent = async (updatedData) => {
    if (!updatedData.id) return;
    try {
      const res = await fetch(`${API}/students/${updatedData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          name: updatedData.name,
          email: updatedData.email,
          phone: updatedData.phone,
          course: updatedData.course,
          status: updatedData.status,
          address: updatedData.address,
        }),
      });
      if (res.ok) {
        await refreshStudents();
        refreshDashboardStats();
        if (selectedStudent?.studentId === updatedData.studentId) {
          setSelectedStudent(prev => ({ ...prev, ...updatedData }));
        }
      } else {
        console.error('[Update] Failed:', res.status);
      }
    } catch (err) {
      console.error('[Update] Error:', err);
    }
  };

  const currentMonthShort = new Date().toLocaleString('en-US', { month: 'short' });
  const currentYearStr = new Date().getFullYear().toString();
  const newAdmissionsCount = students.filter(s =>
    s.admissionDate &&
    s.admissionDate.includes(currentMonthShort) &&
    s.admissionDate.includes(currentYearStr)
  ).length;

  const content = (
    <>
      {/* 1. Header Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
        <StatCardShort icon={Users} title="Total Students" value={students.filter(s => s.institute === "GIT" || s.institute === "GICSA").length} subtext="All registered students" color="bg-primary" />
        <StatCardShort icon={UserCheck} title="Active Students" value={students.filter(s => s.status === 'Active').length} subtext="Currently active students" color="bg-emerald-600" />
        <StatCardShort icon={Users} title="Inactive Students" value={students.filter(s => s.status === 'Inactive').length} subtext="Currently inactive students" color="bg-rose-600" />
        <StatCardShort icon={UserPlus} title="New Admissions" value={newAdmissionsCount} subtext="This month" color="bg-Yellow" />
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 md:p-6 mb-8 flex flex-col gap-4 shadow-sm">
        <div className="relative w-full h-12">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
           <input 
             type="text" 
             placeholder="Search by name, email or course..." 
             className="w-full h-full bg-[#F8FAFC] border-none rounded-xl pl-12 pr-4 text-xs font-bold focus:ring-2 focus:ring-primary/20 transition-all outline-none"
             value={localSearch}
             onChange={(e) => setLocalSearch(e.target.value)}
           />
        </div>
        
         <div className="flex flex-wrap items-end gap-4 md:gap-6">
            <div className="flex-1 min-w-[140px]">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Institute</label>
               <div className="relative group">
                  <select 
                    value={instituteFilter}
                    onChange={(e) => {
                      setInstituteFilter(e.target.value);
                      setCourseFilter("");
                    }}
                    className="w-full h-11 bg-[#F8FAFC] border border-slate-100 rounded-xl px-4 text-xs font-black appearance-none cursor-pointer focus:ring-2 focus:ring-primary/20 transition-all outline-none pr-10"
                  >
                    <option value="" hidden>Select Institute</option>
                    <option value="GIT">GIT</option>
                    <option value="GICSA">GICSA</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none group-hover:text-primary transition-colors" />
               </div>
            </div>

            <div className={`flex-1 min-w-[140px] ${!instituteFilter ? 'opacity-50' : ''}`}>
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Course</label>
               <div className="relative group">
                  <select 
                    value={courseFilter}
                    onChange={(e) => setCourseFilter(e.target.value)}
                    disabled={!instituteFilter}
                    className="w-full h-11 bg-[#F8FAFC] border border-slate-100 rounded-xl px-4 text-xs font-black appearance-none cursor-pointer focus:ring-2 focus:ring-primary/20 transition-all outline-none pr-10 disabled:cursor-not-allowed"
                  >
                     <option value="" hidden>Select Course</option>
                     {(courses || [])
                       .filter(c => !instituteFilter || c.institute === instituteFilter)
                       .map(c => <option key={c.id || c.name} value={c.name}>{c.name}</option>)
                     }
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none group-hover:text-primary transition-colors" />
               </div>
            </div>

            <div className={`flex-1 min-w-[140px] ${!instituteFilter ? 'opacity-50' : ''}`}>
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Status</label>
               <div className="relative group">
                  <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    disabled={!instituteFilter}
                    className="w-full h-11 bg-[#F8FAFC] border border-slate-100 rounded-xl px-4 text-xs font-black appearance-none cursor-pointer focus:ring-2 focus:ring-primary/20 transition-all outline-none pr-10 disabled:cursor-not-allowed"
                  >
                    <option>All Status</option>
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none group-hover:text-primary transition-colors" />
               </div>
            </div>

            <button 
              onClick={handleReset} 
              className="h-11 px-6 bg-slate-50 text-[#1E293B] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center justify-center gap-2 shrink-0 border border-slate-100 w-full sm:w-auto mt-2 sm:mt-0"
            >
               <RotateCcw className="w-3.5 h-3.5" />
               Reset
            </button>
         </div>
      </div>

      {/* 3. Main Table Section */}
      <div className="bg-white rounded-[24px] md:rounded-[32px] border border-slate-200 overflow-hidden mb-12 shadow-sm">
        <div className="p-6 md:p-8 border-b border-[#F1F5F9] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h3 className="text-lg md:text-xl font-black text-[#1E293B] tracking-tight uppercase">Students List</h3>
            <div className="flex gap-4">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Showing {filteredStudents.length} of {students.length} students</span>
            </div>
        </div>
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200">
            {studentsLoading ? (
               <div className="py-32 flex flex-col items-center justify-center bg-slate-50/5 animate-in fade-in duration-500">
                  <InfinityLoader size={80} className="[&>svg>path:last-child]:stroke-primary [&>svg>path:last-child]:drop-shadow-[0_0_12px_rgba(79,70,229,0.2)]" />
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-8 flex items-center gap-2">
                     <span className="w-8 h-[1px] bg-slate-200"></span>
                     Processing Records
                     <span className="w-8 h-[1px] bg-slate-200"></span>
                  </p>
               </div>
            ) : (
               <table className="w-full text-left min-w-[1000px]">
                 <thead>
                   {table.getHeaderGroups().map(headerGroup => (
                     <tr key={headerGroup.id} className="bg-slate-50/50">
                       {(headerGroup.headers || []).map(header => (
                         <th key={header.id} className="py-4 md:py-5 px-6 md:px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                           {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                         </th>
                       ))}
                     </tr>
                   ))}
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                   {table.getRowModel().rows.map(row => (
                     <tr 
                       key={row.id} 
                       onClick={() => setSelectedStudent(row.original)}
                       className={`group transition-all cursor-pointer ${selectedStudent?.studentId === row.original.studentId ? 'bg-primary/5' : 'hover:bg-slate-50'}`}
                     >
                       {row.getVisibleCells().map(cell => (
                         <td key={cell.id} className="py-4 md:py-5 px-6 md:px-8">
                           {flexRender(cell.column.columnDef.cell, cell.getContext())}
                         </td>
                       ))}
                     </tr>
                   ))}
                 </tbody>
               </table>
            )}
        </div>
      </div>

      {/* 4. Detailed View (Below Table) */}
      <AnimatePresence mode="wait">
        {selectedStudent && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 20 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12"
          >
            {/* View Student Details Card */}
            <div className="bg-white rounded-[32px] border border-[#F1F5F9] shadow-sm p-10 relative overflow-hidden">
               <div className="flex justify-between items-center mb-10">
                  <h3 className="text-xl font-black text-[#1E293B] tracking-tight">View Student Details</h3>
                  <button 
                    onClick={() => setSelectedStudent(null)}
                    className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-400"
                  >
                    <X className="w-5 h-5" />
                  </button>
               </div>

               <div className="flex flex-col sm:flex-row gap-10">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-50 shadow-xl shrink-0">
                    <img src={selectedStudent.avatar} alt={selectedStudent.name} className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8 flex-grow">
                     <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Full Name</p>
                        <h4 className="text-base font-black text-[#1E293B] tracking-tight">{selectedStudent.name}</h4>
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Course</p>
                        <h4 className="text-base font-black text-[#1E293B] tracking-tight">{selectedStudent.course}</h4>
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Student ID</p>
                        <h4 className="text-base font-black text-[#1E293B] tracking-tight">{selectedStudent.studentId}</h4>
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Admission Date</p>
                        <h4 className="text-base font-black text-[#1E293B] tracking-tight">{selectedStudent.admissionDate}</h4>
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Email</p>
                        <h4 className="text-base font-black text-[#1E293B] tracking-tight truncate">{selectedStudent.email}</h4>
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Status</p>
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest inline-block mt-1 ${
                          selectedStudent.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                        }`}>{selectedStudent.status}</span>
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                           <Phone className="w-2 h-2" /> Phone
                        </p>
                        <h4 className="text-base font-black text-[#1E293B] tracking-tight">{selectedStudent.phone}</h4>
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                           <MapPin className="w-2 h-2" /> Address
                        </p>
                        <h4 className="text-base font-bold text-[#1E293B] tracking-tight leading-relaxed">{selectedStudent.address}</h4>
                     </div>
                  </div>
               </div>

              <div className="mt-12 flex justify-end">
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="px-10 py-4 bg-[#F8FAFC] hover:bg-slate-100 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-[0.25em] transition-all shadow-sm border border-slate-100"
                >
                  Close Profile
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <EditStudentModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        student={editingStudent}
        onSave={handleSaveStudent}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        studentName={studentToDelete?.name}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
return noLayout ? content : <AdminLayout>{content}</AdminLayout>;
}

