import React, { useState } from "react";
import { useAdminData } from "../../../context/AdminDataContext";
import { useAuth } from "../../../context/AuthContext";
import { CreditCard, Calendar } from "lucide-react";

const API = "http://localhost:8000";

export default function FeesActions() {
const { fees, setFees, courses, fetchFeeDetail, makePayment, setDueDate } = useAdminData();
  const { getToken } = useAuth();

  const [studentId, setStudentId] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [paymentData, setPaymentData] = useState({
    amount: "",
    method: "UPI"
  });

  const [dueDateData, setDueDateData] = useState({
    institute: "",
    course: "",
    dueDate: ""
  });

  const [message, setMessage] = useState("");

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  // ================= FETCH =================
  const handleFetchStudent = async () => {
    const sid = studentId.trim();
    if (!sid) return showMessage("not-found");
    
    try {
      const data = await fetchFeeDetail(sid);
      if (!data) return showMessage("not-found");
      
      setSelectedStudent(data);
      showMessage("fetched");
    } catch {
      showMessage("not-found");
    }
  };


  // ================= PAYMENT =================
  const handlePayment = async (e) => {
    e.preventDefault();
    if (!selectedStudent || !paymentData.amount) return showMessage("error");

    try {
      const result = await makePayment({
        student_id: selectedStudent.id,
        amount: parseInt(paymentData.amount),
        method: paymentData.method,
      });

      if (!result.success) {
        if (result.message && result.message.includes("exceeds")) {
          return showMessage("overpay");
        }
        return showMessage("error");
      }

      showMessage("paid");
      setPaymentData({ amount: "", method: "UPI" });
      // Refresh selected student view
      await handleFetchStudent();
    } catch {
      showMessage("error");
    }
  };

  // ================= DUE DATE =================
  const handleSetDueDate = async (e) => {
    e.preventDefault();
    if (!dueDateData.course || !dueDateData.dueDate) return showMessage("error");

    try {
      const result = await setDueDate({
        course: dueDateData.course,
        due_date: dueDateData.dueDate,
      });

      if (!result.success) return showMessage("error");
      showMessage("due-set");
    } catch {
      showMessage("error");
    }
  };


  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-black text-[#1E293B] uppercase tracking-tight">
          Fees Actions
        </h1>
        <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">
          Manage payments and due schedules
        </p>
      </div>

      {/* ================= DIRECT PAYMENT ================= */}
      <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm">

        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <CreditCard className="w-6 h-6" />
          </div>
          <h4 className="text-xl font-black text-[#1E293B] uppercase tracking-tight">
            Direct Payment
          </h4>
        </div>

        {/* FETCH */}
        <div className="flex gap-4 mb-6">
          <input
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="Enter Student ID"
            className="w-full h-12 bg-[#F8FAFC] rounded-2xl px-5 text-sm font-bold"
          />
          <button
            onClick={handleFetchStudent}
            className="px-6 bg-indigo-600 text-white rounded-2xl font-bold"
          >
            Fetch
          </button>
        </div>

        {/* STUDENT INFO */}
        {selectedStudent && (
          <div className="mb-6 bg-[#F8FAFC] rounded-2xl p-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <Detail label="Name" val={selectedStudent.name} />
              <Detail label="Course" val={selectedStudent.course} />
              <Detail label="Paid" val={`₹${selectedStudent.paid}`} />
              {selectedStudent.credit > 0 ? (
                <Detail label="Advance Paid" val={`₹${selectedStudent.credit}`} color="text-emerald-600" />
              ) : (
                <Detail label="Total Due" val={`₹${Math.max(0, selectedStudent.remaining)}`} />
              )}


            </div>
          </div>
        )}

        {/* FORM */}
        {selectedStudent && (
          <form onSubmit={handlePayment} className="grid md:grid-cols-2 gap-6">

            <input
              type="number"
              placeholder="Enter Amount"
              value={paymentData.amount}
              onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
              className="w-full h-12 bg-[#F8FAFC] rounded-2xl px-5 text-sm font-bold"
            />

            <select
              value={paymentData.method}
              onChange={(e) => setPaymentData({ ...paymentData, method: e.target.value })}
              className="w-full h-12 bg-[#F8FAFC] rounded-2xl px-5 text-sm font-bold"
            >
              <option>UPI</option>
              <option>Cash</option>
              <option>Card</option>
              <option>Net Banking</option>
            </select>

            <button className="px-8 py-3.5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg col-span-2">
              Pay Fees
            </button>
          </form>
        )}
      </div>

      {/* ================= DUE DATE ================= */}
      <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm">

        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
          <h4 className="text-xl font-black uppercase tracking-tight">
            Set Due Date
          </h4>
        </div>

        <form onSubmit={handleSetDueDate} className="grid md:grid-cols-2 gap-6">

          <Select label="Institute" value={dueDateData.institute} onChange={(v) => setDueDateData({ ...dueDateData, institute: v })} options={["GIT", "GICSA"]} />
          <Select label="Course" value={dueDateData.course} onChange={(v) => setDueDateData({ ...dueDateData, course: v })} options={(courses || []).map(c => c.name)} />

          <Input label="Due Date" type="date" value={dueDateData.dueDate} onChange={(v) => setDueDateData({ ...dueDateData, dueDate: v })} />

          <button className="px-8 py-3.5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg col-span-2">
            Apply Due Date
          </button>
        </form>
      </div>

      {/* MESSAGE */}
      {message && (
        <div className="fixed bottom-6 right-6 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg z-50">
          {message === "fetched" && "Student Loaded ✅"}
          {message === "paid" && "Payment Successful 💳"}
          {message === "due-set" && "Due Date Updated 📅"}
          {message === "not-found" && "Student Not Found ❌"}
          {message === "overpay" && "Amount exceeds remaining ❌"}
          {message === "error" && "Fill all fields ❌"}
        </div>
      )}
    </div>
  );
}

/* REUSABLE */
const Detail = ({ label, val, color }) => (
  <div>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
    <p className={`text-sm font-black ${color || 'text-[#1E293B]'}`}>{val}</p>
  </div>
);


const Input = ({ label, value, onChange, type = "text" }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</label>
    <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full h-12 bg-[#F8FAFC] rounded-2xl px-5 text-sm font-bold" />
  </div>
);

const Select = ({ label, value, onChange, options = [] }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</label>
    <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full h-12 bg-[#F8FAFC] rounded-2xl px-5 text-sm font-bold">
      <option value="">Select</option>
      {(options || []).map(o => <option key={o}>{o}</option>)}
    </select>
  </div>
);