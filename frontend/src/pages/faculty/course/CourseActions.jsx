import React, { useState } from 'react';
import { useAdminData } from '../../../context/AdminDataContext';
import { useAuth } from '../../../context/AuthContext';
import { BookPlus, RefreshCcw, CheckCircle, AlertCircle } from 'lucide-react';

const API = "http://localhost:8000";

export default function CourseActions() {
   const { courses, refreshCourses } = useAdminData();
   const { getToken } = useAuth();
   const [loading, setLoading] = useState(false);

   // ➕ ADD STATE
   const [addData, setAddData] = useState({
      id: '',
      name: '',
      duration: '',
      fee: '',
      institute: 'GIT',
      faculty: '',
      status: 'Active'
   });

   // 🔄 UPDATE STATE
   const [updateData, setUpdateData] = useState({
      id: '',
      name: '',
      duration: '',
      fee: '',
      institute: 'GIT',
      faculty: '',
      status: 'Active'
   });

   const [message, setMessage] = useState('');

   const showMessage = (msg) => {
      setMessage(msg);
      setTimeout(() => setMessage(''), 3000);
   };

   // ================= ADD COURSE =================
   const handleAddSubmit = async (e) => {
      e.preventDefault();

      if (!addData.id || !addData.name || !addData.duration || !addData.fee || !addData.faculty) {
         showMessage('error');
         return;
      }

      const payload = {
         course_id: addData.id.toUpperCase(),
         course_name: addData.name,
         duration: addData.duration,
         total_fee: parseInt(addData.fee),
         institute: addData.institute,
         faculty: addData.faculty,
         status: addData.status,
      };

      setLoading(true);
      try {
         const res = await fetch(`${API}/courses/`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify(payload),
         });

         if (!res.ok) {
            const err = await res.json();
            showMessage(err.detail || 'api-error');
            return;
         }

         await refreshCourses();
         showMessage('added');
         setAddData({ id: '', name: '', duration: '', fee: '', institute: 'GIT', faculty: '', status: 'Active' });
      } catch (err) {
         showMessage('server-error');
      } finally {
         setLoading(false);
      }
   };

   // ================= FETCH COURSE =================
   const handleFetchCourse = () => {
      if (!updateData.id) { showMessage('no-id'); return; }

      // Search in local courses list (already loaded from DB)
      const course = courses.find(
         c => (c.course_id || c.id || '').toLowerCase() === updateData.id.toLowerCase()
      );

      if (!course) { showMessage('not-found'); return; }

      setUpdateData({
         id: course.course_id || course.id || '',
         name: course.course_name || course.name || '',
         duration: course.duration || '',
         fee: course.total_fee || course.fee || '',
         institute: course.institute || 'GIT',
         faculty: course.faculty || '',
         status: course.status || 'Active'
      });

      showMessage('fetched');
   };

   // ================= UPDATE COURSE =================
   const handleUpdateSubmit = async (e) => {
      e.preventDefault();
      if (!updateData.id) { showMessage('no-id'); return; }

      const payload = {
         course_id: updateData.id.toUpperCase(),
         course_name: updateData.name,
         duration: updateData.duration,
         total_fee: parseInt(updateData.fee),
         institute: updateData.institute,
         faculty: updateData.faculty,
         status: updateData.status,
      };

      setLoading(true);
      try {
         const res = await fetch(`${API}/courses/${updateData.id.toUpperCase()}`, {
            method: 'PUT',
            headers: {
               'Content-Type': 'application/json',
               Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify(payload),
         });

         if (!res.ok) {
            const err = await res.json();
            showMessage(err.detail || 'api-error');
            return;
         }

         await refreshCourses();
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
               Course Actions
            </h1>
            <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">
               Create and modify academic programs
            </p>
         </div>

         {/* ================= ADD COURSE ================= */}
         <div className="bg-white rounded-[32px] border border-slate-100 p-8 md:p-10 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
               <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <BookPlus className="w-6 h-6" />
               </div>
               <h4 className="text-xl font-black text-[#1E293B] uppercase tracking-tight">
                  Add New Program
               </h4>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  <Input label="Course ID *" name="id" value={addData.id} onChange={handleAddChange} placeholder="e.g. CRS-101" />
                  <Input label="Course Name *" name="name" value={addData.name} onChange={handleAddChange} placeholder="e.g. B.Tech Computer Science" />
                  <Input label="Duration *" name="duration" value={addData.duration} onChange={handleAddChange} placeholder="e.g. 4 Years" />
                  <Input label="Course Fee (₹) *" name="fee" value={addData.fee} onChange={handleAddChange} placeholder="e.g. 450000" />
                  <Input label="Faculty Name *" name="faculty" value={addData.faculty} onChange={handleAddChange} placeholder="e.g. Dr. Sharma" />

                  <Select label="Institute" name="institute" value={addData.institute} onChange={handleAddChange} options={["GIT", "GICSA"]} />
                  <Select label="Program Status" name="status" value={addData.status} onChange={handleAddChange} options={["Active", "Inactive"]} />

               </div>

               <button disabled={loading} className={`px-8 py-3.5 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg ${loading ? 'opacity-60' : ''}`}>
                  {loading ? 'Publishing...' : 'Publish Program'}
               </button>
            </form>
         </div>

         {/* ================= UPDATE COURSE ================= */}
         <div className="bg-white rounded-[32px] border border-slate-100 p-8 md:p-10 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
               <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <RefreshCcw className="w-6 h-6" />
               </div>
               <h4 className="text-xl font-black text-[#1E293B] uppercase tracking-tight">
                  Update Program
               </h4>
            </div>

            {/* FETCH */}
            <div className="flex gap-4 mb-6">
               <input
                  name="id"
                  value={updateData.id}
                  onChange={handleUpdateChange}
                  placeholder="Enter Course ID (e.g. CRS-101)"
                  className="w-full h-12 bg-[#F8FAFC] border-none rounded-2xl px-5 text-sm font-bold"
               />
               <button
                  type="button"
                  onClick={handleFetchCourse}
                  className="px-6 bg-indigo-600 text-white rounded-2xl font-bold"
               >
                  Fetch
               </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  <Input label="Course Name" name="name" value={updateData.name} onChange={handleUpdateChange} placeholder="Edit course name" />
                  <Input label="Duration" name="duration" value={updateData.duration} onChange={handleUpdateChange} placeholder="Edit duration" />
                  <Input label="Course Fee (₹)" name="fee" value={updateData.fee} onChange={handleUpdateChange} placeholder="Edit fee" />
                  <Input label="Faculty Name" name="faculty" value={updateData.faculty} onChange={handleUpdateChange} placeholder="Edit faculty name" />

                  <Select label="Institute" name="institute" value={updateData.institute} onChange={handleUpdateChange} options={["GIT", "GICSA"]} />
                  <Select label="Program Status" name="status" value={updateData.status} onChange={handleUpdateChange} options={["Active", "Inactive"]} />

               </div>

               <button disabled={loading} className={`px-8 py-3.5 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg ${loading ? 'opacity-60' : ''}`}>
                  {loading ? 'Updating...' : 'Update Program'}
               </button>
            </form>
         </div>

         {/* ================= MESSAGE ================= */}
         {message && (
            <div className={`fixed bottom-6 right-6 px-6 py-3 rounded-xl text-white font-bold shadow-lg z-50 ${
               ['added','updated','fetched'].includes(message) ? 'bg-indigo-600' : 'bg-rose-500'
            }`}>
               {message === 'added' && "Course Added ✅"}
               {message === 'updated' && "Course Updated 🔄"}
               {message === 'fetched' && "Data Loaded ✅"}
               {message === 'not-found' && "Course Not Found ❌"}
               {message === 'no-id' && "Enter Course ID ❌"}
               {message === 'error' && "Fill all required fields ❌"}
               {message === 'server-error' && "Server error — is backend running? ❌"}
               {!['added','updated','fetched','not-found','no-id','error','server-error'].includes(message) && message}
            </div>
         )}
      </div>
   );

   function handleAddChange(e) { setAddData({ ...addData, [e.target.name]: e.target.value }); }
   function handleUpdateChange(e) { setUpdateData({ ...updateData, [e.target.name]: e.target.value }); }
}

/* REUSABLE INPUT */
const Input = ({ label, ...props }) => (
   <div className="space-y-2">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block">{label}</label>
      <input {...props} className="w-full h-12 bg-[#F8FAFC] border-none rounded-2xl px-5 text-sm font-bold" />
   </div>
);

/* REUSABLE SELECT */
const Select = ({ label, options, ...props }) => (
   <div className="space-y-2">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block">{label}</label>
      <select {...props} className="w-full h-12 bg-[#F8FAFC] border-none rounded-2xl px-5 text-sm font-bold">
         {(options || []).map(o => <option key={o}>{o}</option>)}
      </select>
   </div>
);