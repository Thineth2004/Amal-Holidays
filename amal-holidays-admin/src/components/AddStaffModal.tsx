import React, { useState } from 'react';
import api from '../api/axiosInstance';
import toast from 'react-hot-toast';

interface Staff {
  user_id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  price_per_day: number;
  image_uuid: string;
  imageUrl?: string;
}

interface AddStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newStaff: Staff) => void;
  editData?: Staff;
  role: 'Driver' | 'Guide';
  endpoint: string;
}

const AddStaffModal: React.FC<AddStaffModalProps> = ({ isOpen, onClose, onSuccess, editData, role, endpoint }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '', price_per_day: 0 });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  const [prevEditData, setPrevEditData] = useState(editData);

  if (isOpen !== prevIsOpen || editData !== prevEditData) {
    setPrevIsOpen(isOpen);
    setPrevEditData(editData);
    if (isOpen) {
      if (editData) {
        setFormData({
          name: editData.name,
          email: editData.email,
          password: '', // Don't show existing password
          phone: editData.phone || '',
          price_per_day: editData.price_per_day || 0,
        });
      } else {
        setFormData({ name: '', email: '', password: '', phone: '', price_per_day: 0 });
      }
      setFile(null);
    }
  }

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editData && !formData.password) {
      toast.error('Password is required for new staff.');
      return;
    }

    setLoading(true);
    try {
      let image_uuid: string | undefined;
      if (file) {
        const imageFormData = new FormData();
        imageFormData.append('image', file);
        const imageRes = await api.post('/api/images/upload', imageFormData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        image_uuid = imageRes.data.uuid;
      }

      const payload: Record<string, string | number | undefined> = { ...formData, role };
      if (image_uuid) payload.image_uuid = image_uuid;
      if (editData && !formData.password) delete payload.password;

      let res;
      if (editData) {
        res = await api.put(`/api/${endpoint}/${editData.user_id}`, payload);
        toast.success(`${role} updated successfully!`);
      } else {
        res = await api.post(`/api/${endpoint}`, payload);
        toast.success(`${role} added successfully!`);
      }

      onSuccess(res.data);
      onClose();
    } catch (error: unknown) {
      toast.error((error as { response?: { data?: { message: string } } }).response?.data?.message || `Failed to save ${role.toLowerCase()}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1b1c1c]/40 backdrop-blur-sm">
      <div className="bg-white/90 backdrop-blur-xl border border-white/50 w-full max-w-xl rounded-lg shadow-2xl p-6 animate-in fade-in zoom-in duration-300">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-[#1b1c1c]">{editData ? `Edit ${role}` : `New ${role}`}</h2>
          <button onClick={onClose} className="hover:bg-black/5 rounded-full p-2"><span className="material-symbols-outlined">close</span></button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600 ml-1">Full Name</label>
              <input value={formData.name} className="bg-[#f4f6fa] rounded-2xl p-4 text-sm outline-none w-full" placeholder="e.g. John Doe" required onChange={(e) => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600 ml-1">Email Address</label>
              <input type="email" value={formData.email} className="bg-[#f4f6fa] rounded-2xl p-4 text-sm outline-none w-full" placeholder="e.g. john@example.com" required onChange={(e) => setFormData({...formData, email: e.target.value})} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600 ml-1">Password {editData && <span className="font-normal text-slate-400">(Leave blank to keep existing)</span>}</label>
              <input type="password" value={formData.password} className="bg-[#f4f6fa] rounded-2xl p-4 text-sm outline-none w-full" placeholder={editData ? "New Password" : "Password"} required={!editData} onChange={(e) => setFormData({...formData, password: e.target.value})} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600 ml-1">Phone Number</label>
              <input value={formData.phone} className="bg-[#f4f6fa] rounded-2xl p-4 text-sm outline-none w-full" placeholder="e.g. 077 123 4567" required onChange={(e) => setFormData({...formData, phone: e.target.value})} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div className="flex flex-col gap-1.5">
               <label className="text-xs font-semibold text-slate-600 ml-1">Price per Day (LKR)</label>
               <input type="number" min="0" value={formData.price_per_day} className="bg-[#f4f6fa] rounded-2xl p-4 text-sm outline-none w-full" placeholder="e.g. 5000" required onChange={(e) => setFormData({...formData, price_per_day: Number(e.target.value)})} />
             </div>
          </div>
          
          <div className="border-2 border-dashed border-[#c1c6d7] rounded-2xl p-6 text-center cursor-pointer">
            <input type="file" id="image-upload" onChange={(e) => setFile(e.target.files?.[0] || null)} className="hidden" accept="image/*" />
            <label htmlFor="image-upload" className="cursor-pointer">
              <span className="material-symbols-outlined text-4xl text-[#0059bb]">cloud_upload</span>
              <p className="font-bold">{file ? file.name : editData ? 'Leave blank to keep existing' : 'Upload image'}</p>
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-3 bg-[#e8eaf0] rounded-full font-bold text-sm">Cancel</button>
            <button type="submit" disabled={loading} className="flex-[2] py-3 bg-[#0059bb] text-white rounded-full font-bold text-sm shadow-lg active:scale-95">{loading ? 'Processing...' : `Save ${role}`}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStaffModal;
