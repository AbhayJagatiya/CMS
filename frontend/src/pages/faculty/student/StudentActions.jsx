import React, { useState } from 'react';
import { useAdminData } from '../../../context/AdminDataContext';
import { useAuth } from '../../../context/AuthContext';
import { UserPlus, RefreshCcw } from 'lucide-react';

const API = "http://localhost:8000";

export default function StudentActions() {
  const { students, refreshStudents, courses } = useAdminData();
  const { getToken } = useAuth();

  const [addData, setAddData] = useState({
    studentId: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    institute: '',
    course: '',
    status: 'Active'
  });

  const [updateData, setUpdateData] = useState({
    studentId: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    course: '',
    status: 'Active'
  });

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3500);
  };

  // ================= ADD =================
  const handleAddSubmit = async (e) => {
    e.preventDefault();

    const cleanId = addData.studentId.trim().toUpperCase();
    if (!cleanId || !addData.name || !addData.email || !addData.course) {
      return showMessage('error');
    }

    // Derive institute from selected course
    const courseObj = (courses || []).find(c => c.name === addData.course);
    const institute = courseObj?.institute || addData.institute || 'GIT';

    const payload = {
      student_id: cleanId,
      name: addData.name,
      email: addData.email.toLowerCase(),
      phone: addData.phone || '',
      address: addData.address || '',
      Institude: institute,
      course: addData.course,
      admission_date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      status: addData.status,
    };

    setLoading(true);
    try {
      const res = await fetch(`${API}/students/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        return showMessage(err.detail || 'api-error');
      }

      await refreshStudents(); // reload from DB
      showMessage('added');
      setAddData({ studentId: '', name: '', email: '', phone: '', address: '', institute: '', course: '', status: 'Active' });
    } catch (err) {
      showMessage('server-error');
    } finally {
      setLoading(false);
    }
  };

  // ================= FETCH =================
  const handleFetchStudent = () => {
    if (!updateData.studentId) return showMessage('no-id');

    const student = students.find(
      s => s.studentId.toLowerCase() === updateData.studentId.toLowerCase()
    );

    if (!student) return showMessage('not-found');

    setUpdateData({
      studentId: student.studentId,
      dbId: student.id,       // keep DB id for PUT
      name: student.name || '',
      email: student.email || '',
      phone: student.phone || '',
      address: student.address || '',
      course: student.course || '',
      status: student.status || 'Active'
    });

    showMessage('fetched');
  };

  // ================= UPDATE =================
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    if (!updateData.studentId) return showMessage('no-id');
    const student = students.find(s => s.studentId.toLowerCase() === updateData.studentId.toLowerCase());
    if (!student) return showMessage('not-found');

    const payload = {
      student_id: student.studentId,
      name: updateData.name,
      email: updateData.email.toLowerCase(),
      phone: updateData.phone || '',
      address: updateData.address || '',
      Institude: student.institute || 'GIT',
      course: updateData.course,
      admission_date: student.admissionDate || new Date().toISOString().split('T')[0],
      status: updateData.status,
    };

    setLoading(true);
    try {
      const res = await fetch(`${API}/students/${student.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        return showMessage(err.detail || 'api-error');
      }

      await refreshStudents(); // reload from DB
      showMessage('updated');
    } catch (err) {
      showMessage('server-error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-black text-[#1E293B] uppercase tracking-tight">
          Student Actions
        </h1>
        <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">
          Manage student registration and updates
        </p>
      </div>

      {/* ADD STUDENT */}
      <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm">

        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <UserPlus className="w-6 h-6" />
          </div>
          <h4 className="text-xl font-black uppercase tracking-tight">
            Register New Student
          </h4>
        </div>

        <form onSubmit={handleAddSubmit} className="grid md:grid-cols-2 gap-6">

          <Input
            label="Student ID"
            placeholder="Enter student ID (e.g. STU-001)"
            value={addData.studentId}
            onChange={v => setAddData({ ...addData, studentId: v.toUpperCase() })}
          />

          <Input label="Full Name" placeholder="Enter full name" value={addData.name} onChange={v => setAddData({ ...addData, name: v })} />
          <Input label="Email" placeholder="Enter email address" value={addData.email} onChange={v => setAddData({ ...addData, email: v })} />
          <Input label="Phone" placeholder="Enter phone number" value={addData.phone} onChange={v => setAddData({ ...addData, phone: v })} />
          <Input label="Address" placeholder="Enter address" value={addData.address} onChange={v => setAddData({ ...addData, address: v })} />

          <Select label="Course" placeholder="Select course" value={addData.course} onChange={v => setAddData({ ...addData, course: v })} options={(courses || []).map(c => c.name)} />
          <Select label="Status" placeholder="Select status" value={addData.status} onChange={v => setAddData({ ...addData, status: v })} options={['Active', 'Inactive']} />

          <button disabled={loading} className={`col-span-2 px-8 py-3.5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg ${loading ? 'opacity-60' : ''}`}>
            {loading ? 'Saving...' : 'Add Student'}
          </button>
        </form>
      </div>

      {/* UPDATE STUDENT */}
      <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm">

        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <RefreshCcw className="w-6 h-6" />
          </div>
          <h4 className="text-xl font-black uppercase tracking-tight">
            Update Student
          </h4>
        </div>

        <div className="flex gap-3 mb-6">
          <input
            value={updateData.studentId}
            onChange={(e) => setUpdateData({ ...updateData, studentId: e.target.value.toUpperCase() })}
            placeholder="Enter Student ID"
            className="w-full h-12 bg-[#F8FAFC] rounded-2xl px-5 text-sm font-bold"
          />
          <button onClick={handleFetchStudent} className="px-6 bg-indigo-600 text-white rounded-2xl font-bold">
            Fetch
          </button>
        </div>

        <form onSubmit={handleUpdateSubmit} className="grid md:grid-cols-2 gap-6">

          <Input label="Name" placeholder="Enter name" value={updateData.name} onChange={v => setUpdateData({ ...updateData, name: v })} />
          <Input label="Email" placeholder="Enter email" value={updateData.email} onChange={v => setUpdateData({ ...updateData, email: v })} />
          <Input label="Phone" placeholder="Enter phone" value={updateData.phone} onChange={v => setUpdateData({ ...updateData, phone: v })} />
          <Input label="Address" placeholder="Enter address" value={updateData.address} onChange={v => setUpdateData({ ...updateData, address: v })} />

          <Select label="Course" placeholder="Select course" value={updateData.course} onChange={v => setUpdateData({ ...updateData, course: v })} options={(courses || []).map(c => c.name)} />
          <Select label="Status" placeholder="Select status" value={updateData.status} onChange={v => setUpdateData({ ...updateData, status: v })} options={['Active', 'Inactive']} />

          <button disabled={loading} className={`col-span-2 px-8 py-3.5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg ${loading ? 'opacity-60' : ''}`}>
            {loading ? 'Updating...' : 'Update Student'}
          </button>
        </form>
      </div>

      {/* MESSAGE */}
      {message && (
        <div className={`fixed bottom-6 right-6 px-6 py-3 rounded-xl font-bold shadow-lg text-white ${
          ['added', 'updated', 'fetched'].includes(message) ? 'bg-indigo-600' : 'bg-rose-500'
        }`}>
          {message === 'added' && "Student Added ✅"}
          {message === 'updated' && "Student Updated 🔄"}
          {message === 'fetched' && "Data Loaded ✅"}
          {message === 'duplicate' && "Student ID already exists ❌"}
          {message === 'error' && "Fill required fields ❌"}
          {message === 'not-found' && "Student not found ❌"}
          {message === 'no-id' && "Enter Student ID ❌"}
          {message === 'server-error' && "Server error — is backend running? ❌"}
          {!['added','updated','fetched','duplicate','error','not-found','no-id','server-error'].includes(message) && message}
        </div>
      )}
    </div>
  );
}

/* REUSABLE */
const Input = ({ label, value, onChange, placeholder }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</label>
    <input
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-12 bg-[#F8FAFC] rounded-2xl px-5 text-sm font-bold placeholder:text-slate-400"
    />
  </div>
);

const Select = ({ label, value, onChange, options = [], placeholder }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-12 bg-[#F8FAFC] rounded-2xl px-5 text-sm font-bold text-slate-700"
    >
      <option value="">{placeholder}</option>
      {(options || []).map(o => <option key={o}>{o}</option>)}
    </select>
  </div>
);