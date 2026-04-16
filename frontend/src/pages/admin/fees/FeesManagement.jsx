import { useMemo, useState, useEffect, useRef } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import { TrendingUp, AlertTriangle, FileText, PieChart, Search, ChevronLeft, ChevronRight, X, History, ArrowUpDown, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
} from "@tanstack/react-table";

import { useAdminData } from "../../../context/AdminDataContext";
import { InfinityLoader } from "../../../components/ui/loader-13";

export default function FeesManagement({noLayout = false, hideStats = false }) {
  const { fees, feesLoading, setFees } = useAdminData();
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sorting, setSorting] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    status: "All Status",
    institute: "",
    course: ""
  });
  const itemsPerPage = 8;
  const detailRef = useRef(null);

  const handleReset = () => {
    setFilters({
      search: "",
      institute: "",
      course: "",
      status: "All Status"
    });
    setCurrentPage(1);
    setSorting([]);
  };

  useEffect(() => {
    if (selectedStudent && detailRef.current) {
      detailRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  }, [selectedStudent]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const filteredStudents = useMemo(() => {
    return fees.filter(student => {

      // 🔍 SEARCH
      const matchesSearch =
        !filters.search ||
        (student.id || "").toString().toLowerCase().includes(filters.search.toLowerCase()) ||
        (student.name || "").toLowerCase().includes(filters.search.toLowerCase());

      // 🎯 FILTERS
      const matchesInstitute =
        !filters.institute || student.institute === filters.institute;

      const matchesCourse =
        !filters.course || student.course === filters.course;

      const matchesStatus =
        filters.status === "All Status" || student.status === filters.status;

      return matchesSearch && matchesInstitute && matchesCourse && matchesStatus;
    });
  }, [fees, filters]);
  // Main Table Columns
  const mainColumns = useMemo(() => [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <div className="flex items-center justify-center gap-2 cursor-pointer select-none" onClick={() => column.toggleSorting()}>
          STUDENT ID
          <ArrowUpDown className="w-3 h-3" />
        </div>
      ),
      cell: ({ row }) => <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{row.getValue("id")}</span>,
    },
    {
      accessorKey: "name",
      header: "NAME",
      cell: ({ row }) => <span className="text-sm font-bold text-[#0f172a] tracking-tight">{row.getValue("name")}</span>,
    },
    {
      accessorKey: "course",
      header: "COURSE",
      cell: ({ row }) => <span className="text-xs font-bold text-slate-400 opacity-60 whitespace-nowrap uppercase tracking-tight">{row.getValue("course")}</span>,
    },
      {
        accessorKey: "totalFees",
        header: () => <div className="text-right">TOTAL FEES</div>,
        cell: ({ row }) => <div className="text-sm font-bold text-[#0f172a] text-right">₹{(row.getValue("totalFees") || 0).toLocaleString()}</div>,
      },
      {
        accessorKey: "paid",
        header: () => <div className="text-right">PAID AMOUNT</div>,
        cell: ({ row }) => <div className="text-sm font-bold text-emerald-600 text-right">₹{(row.getValue("paid") || 0).toLocaleString()}</div>,
      },
      {
        accessorKey: "remaining",
        header: () => <div className="text-right">BALANCE</div>,
        cell: ({ row }) => {
          const remaining = row.original.remaining;
          const credit = row.original.credit;
          if (credit > 0) {
            return <div className="text-right"><span className="text-xs font-bold text-emerald-600">ADVANCE: ₹{credit.toLocaleString()}</span></div>;
          }
          return <div className="text-right"><span className="text-xs font-bold text-slate-500">DUE: ₹{remaining.toLocaleString()}</span></div>;
        },
      },

    {
      accessorKey: "dueDate",
      header: "DUE DATE",
      cell: ({ row }) => <span className="text-xs font-bold text-slate-400 opacity-60 whitespace-nowrap uppercase tracking-tight">{row.getValue("dueDate")}</span>,
    },
    {
      accessorKey: "status",
      header: "STATUS",
      cell: ({ row }) => {
        const status = row.getValue("status");
        return (
          <div className="text-center">
            <span className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-[0.3em] ${
              status === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 
              status === 'Pending' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
            }`}>
              {status}
            </span>
          </div>
        );
      },
    },
  ], []);

  const table = useReactTable({
    data: filteredStudents,
    columns: mainColumns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });



  const historyColumns = useMemo(() => [
    { accessorKey: "date", header: "TRANSACTION DATE", cell: ({ row }) => <span className="text-[14px] font-bold text-slate-500">{row.getValue("date")}</span> },
    { accessorKey: "amount", header: () => <div className="text-right">AMOUNT</div>, cell: ({ row }) => <div className="text-[14px] font-bold text-[#0284c7] text-right">₹{row.getValue("amount").toLocaleString()}</div> },
    { accessorKey: "method", header: () => <div className="text-center">METHOD</div>, cell: ({ row }) => <div className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">{row.getValue("method")}</div> },
    { accessorKey: "status", header: () => <div className="text-right">STATUS</div>, cell: ({ row }) => (
      <div className="text-right">
        <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-[0.3em]">{row.getValue("status")}</span>
      </div>
    )},
  ], []);

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const rows = table.getRowModel().rows;
  const currentRows = rows.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const stats = useMemo(() => {
    const totalCollection = Math.max(0, fees.reduce((acc, curr) => acc + (curr.paid || 0), 0));
    const pendingFees = Math.max(0, fees.reduce((acc, curr) => acc + (curr.remaining || 0), 0));


    return [
      {
        label: "Total Collection",
        val: `₹${(totalCollection / 100000).toFixed(2)}L`, // Showing in Lakhs for M-like feel but accurate
        subVal: `₹${totalCollection.toLocaleString()}`,
        icon: TrendingUp,
        color: "bg-emerald-50 text-emerald-600"
      },
      {
        label: "Pending Fees",
        val: `₹${(pendingFees / 1000).toFixed(1)}k`,
        subVal: `₹${pendingFees.toLocaleString()}`,
        icon: AlertTriangle,
        color: "bg-amber-50 text-amber-600"
      },
    ];
  }, [fees]);

  const courseOptions = [...new Set((fees || []).map(s => s.course))];


const content = (
  <>
   
      <div className="flex flex-col gap-8">
        <div>
          <h2 className="text-3xl font-bold text-[#0f172a] tracking-normal leading-normal">Track student payments and financial records</h2>
        
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          {(stats || []).map((stat, i) => (
            <div key={i} className="bg-white p-8 rounded-[24px] border border-[#f1f5f9] shadow-sm flex flex-col justify-between transition-all duration-200 hover:shadow-lg group">
              <div className={`w-12 h-12 rounded-2xl ${stat.color} flex items-center justify-center mb-8 shrink-0 transition-transform duration-200 group-hover:scale-110`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 opacity-60">{stat.label}</p>
                 <h4 className="text-3xl font-bold text-[#0f172a] tracking-tighter">{stat.val}</h4>
              </div>
            </div>
            ))}
            </div>

        <div className="bg-white rounded-[24px] border border-[#e2e8f0] p-4 md:p-6 shadow-sm flex flex-col gap-4">
           <div className="flex flex-wrap gap-4 items-end">
              <div className="flex flex-col gap-1 flex-grow min-w-[200px] sm:min-w-[300px]">
                 <label className="text-[13px] font-medium text-[#475569] mb-1">Search Students</label>
                 <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Name or Student ID..." 
                      value={filters.search}
                      onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                      className="w-full bg-white border border-[#f1f5f9] rounded-xl px-4 py-2.5 pl-10 text-[14px] font-medium outline-none focus:ring-4 focus:ring-[#0284c7]/10 focus:border-[#0284c7] transition-all placeholder:text-[#94a3b8] text-[#0f172a]"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                 </div>
              </div>
              
              <Dropdown 
                label="Institute" 
                value={filters.institute} 
                options={["GIT", "GICSA"]} 
                placeholder="Select Institute"
                onChange={(v) => {
                  setFilters(prev => ({ ...prev, institute: v, course: "" }));
                }} 
              />
              <Dropdown 
                label="Course" 
                value={filters.course} 
                options={filters.institute === "GIT" ? ["B-Tech (CS)", "B-Tech (CSE)", "B-Tech (AI)"] : 
                         filters.institute === "GICSA" ? ["BSC (IT)", "MSC (IT) INT", "BCA"] : []} 
                disabled={!filters.institute}
                placeholder="Select Course"
                onChange={(v) => setFilters(prev => ({ ...prev, course: v }))} 
              />
           </div>

           <div className="flex flex-wrap gap-4 items-end">
              <Dropdown 
                label="Status" 
                value={filters.status} 
                options={["All Status", "Paid", "Pending", "Overdue"]} 
                disabled={!filters.institute}
                onChange={(v) => setFilters(prev => ({ ...prev, status: v }))} 
              />
              <button 
                onClick={handleReset} 
                className="bg-slate-50 text-[#0f172a] border border-[#e2e8f0] rounded-xl px-4 py-2.5 hover:bg-slate-100 transition-all flex items-center justify-center gap-2 shrink-0 w-full sm:w-auto font-bold text-[12px] active:scale-95"
              >
                 <RotateCcw className="w-4 h-4" />
                 Reset
              </button>
           </div>
        </div>

        <div className="bg-white rounded-[24px] border border-[#e2e8f0] shadow-sm overflow-hidden flex flex-col">
           <div className="p-6 md:p-8 border-b border-[#f1f5f9] flex justify-between items-center bg-[#f8fafc]">
               <h3 className="text-xl font-bold text-[#0f172a] tracking-tight truncate">Student Fees Records</h3>
               <button 
                onClick={() => {
                  const headers = ["Student ID", "Name", "Course", "Total Fees", "Paid", "Remaining", "Status"];
                  const csvContent = [
                    headers.join(","),
                    ...filteredStudents.map(s => [
                      s.id,
                      s.name,
                      s.course,
                      s.totalFees,
                      s.paid,
                      s.remaining,
                      s.status
                    ].join(","))
                  ].join("\n");
                  
                  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  link.setAttribute("href", url);
                  link.setAttribute("download", `fees_report_${new Date().toISOString().split('T')[0]}.csv`);
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="bg-[#0284c7] hover:bg-[#0369a1] text-white font-medium rounded-xl px-4 py-2.5 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
               >
                 <FileText className="w-4 h-4" />
                 Export Data
               </button>

           </div>
           
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200">
                {feesLoading ? (
                  <div className="py-24 flex flex-col items-center justify-center bg-slate-50/5 animate-in fade-in duration-500">
                     <InfinityLoader size={80} className="[&>svg>path:last-child]:stroke-[#0284c7] [&>svg>path:last-child]:drop-shadow-[0_0_12px_rgba(2,132,199,0.2)]" />
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-8 flex items-center gap-2">
                        <span className="w-8 h-[1px] bg-[#f1f5f9]"></span>
                        Processing Records
                        <span className="w-8 h-[1px] bg-[#f1f5f9]"></span>
                     </p>
                  </div>
               ) : (
                  <table className="w-full text-left min-w-[1000px]">
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
                        {(currentRows || []).map((row) => (
                          <tr key={row.id} onClick={() => setSelectedStudent(row.original)} className={`group hover:bg-[#f8fafc] transition-all cursor-pointer ${selectedStudent?.id === row.original.id ? 'bg-[#0284c7]/5' : ''}`}>
                             {row.getVisibleCells().map(cell => (
                               <td key={cell.id} className="py-4 md:py-6 px-6 md:px-8">
                                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                               </td>
                             ))}
                          </tr>
                        ))}
                     </tbody>
                  </table>
               )}
            </div>

           <div className="p-6 border-t border-[#f1f5f9] flex flex-col sm:flex-row items-center justify-between gap-6 bg-[#f8fafc]">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest order-2 sm:order-1 text-center sm:text-left">
                 Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredStudents.length)} of {filteredStudents.length} entries
              </span>
              <div className="flex items-center gap-2 order-1 sm:order-2">
                 <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} className="w-9 h-9 md:w-10 md:h-10 border border-[#f1f5f9] rounded-xl flex items-center justify-center text-slate-400 hover:text-[#0284c7] hover:bg-white transition-all"><ChevronLeft className="w-4 h-4" /></button>
                 {[...Array(Math.min(5, totalPages))].map((_, i) => (
                   <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-9 h-9 md:w-10 md:h-10 rounded-xl text-[10px] md:text-[11px] font-bold transition-all ${currentPage === i + 1 ? 'bg-[#0284c7] text-white shadow-lg shadow-indigo-500/20' : 'border border-[#f1f5f9] text-slate-400 hover:text-[#0284c7] hover:bg-white'}`}>
                     {i + 1}
                   </button>
                 ))}
                 <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} className="w-9 h-9 md:w-10 md:h-10 border border-[#f1f5f9] rounded-xl flex items-center justify-center text-slate-400 hover:text-[#0284c7] hover:bg-white transition-all"><ChevronRight className="w-4 h-4" /></button>
              </div>
           </div>
        </div>

        <AnimatePresence mode="wait">
          {selectedStudent && (
             <motion.div key={selectedStudent.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-[32px] border border-[#e2e8f0] shadow-sm p-6 md:p-10 flex flex-col gap-10 md:gap-12 relative overflow-hidden">
                <button onClick={() => setSelectedStudent(null)} className="absolute top-6 right-6 md:top-8 md:right-8 p-2 hover:bg-slate-50 rounded-full transition-all text-slate-300">
                   <X className="w-5 h-5" />
                </button>

                <div className="w-full">
                   <h3 className="text-lg md:text-xl font-bold text-[#0f172a] tracking-tight mb-6 md:mb-8">Detailed Fees Overview</h3>
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-10 md:mb-12">
                      <DetailItem label="Full Name" val={selectedStudent.name} />
                      <DetailItem label="Student ID" val={selectedStudent.id} />
                      <DetailItem label="Course" val={selectedStudent.course} />
                      {selectedStudent.credit > 0 ? (
                        <DetailItem label="Advance Paid" val={`₹${selectedStudent.credit.toLocaleString()}`} color="text-emerald-600" />
                      ) : (
                        <DetailItem label="Total Due" val={`₹${selectedStudent.remaining.toLocaleString()}`} color="text-rose-500" />
                      )}
                   </div>


                 </div>
 
                 <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-3">
                       <History className="w-5 h-5 text-[#0284c7]" />
                       <h4 className="text-lg md:text-xl font-bold text-[#0f172a] tracking-tight">Recent Payment History</h4>
                    </div>
                    <div className="bg-[#f8fafc] rounded-[24px] border border-[#f1f5f9] overflow-hidden">
                       <SubTable data={selectedStudent.history || []} columns={historyColumns} />
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

function SubTable({ data, columns }) {
  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() });
  return (
    <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200">
      <table className="w-full text-left">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id} className="bg-[#f8fafc]">
              {(headerGroup.headers || []).map(header => (
                <th key={header.id} className="py-5 px-8 text-[10px] font-bold text-[#94a3b8] uppercase tracking-widest">
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-[#f1f5f9]">
          {table.getRowModel().rows.map(row => (
            <tr key={row.id} className="hover:bg-[#fafafa] bg-white transition-all">
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="py-5 px-8 text-[#0f172a]">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Dropdown({ label, value, options, onChange, disabled, placeholder }) {
  return (
    <div className={`flex flex-col gap-1 flex-1 min-w-[150px] ${disabled ? 'opacity-50' : ''}`}>
       <label className="text-[13px] font-medium text-[#475569] ml-1">{label}</label>
       <div className="relative">
          <select 
            value={value} 
            onChange={(e) => onChange(e.target.value)} 
            disabled={disabled}
            className="w-full bg-white border border-[#f1f5f9] rounded-xl px-4 py-2.5 text-[14px] font-medium text-[#0f172a] outline-none focus:ring-4 focus:ring-[#0284c7]/10 focus:border-[#0284c7] transition-all appearance-none cursor-pointer pr-10 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-50 disabled:border-none"
          >
             {placeholder && <option value="" hidden>{placeholder}</option>}
             {(options || []).map(o => <option key={o} value={o}>{o}</option>)}
          </select>
          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
       </div>
    </div>
  );
}

function DetailItem({ label, val, color }) {
  return (
    <div>
       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
       <p className={`text-[14px] font-bold tracking-tight ${color || 'text-[#0f172a]'}`}>{val}</p>
    </div>
  );
}

function ChevronDown(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
  );
}
