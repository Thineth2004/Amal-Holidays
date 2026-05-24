import React, { useState } from 'react';
import api from '../api/axiosInstance';
import toast from 'react-hot-toast';

interface Hotel {
  hotel_id: number;
  name: string;
  location: string;
  contact_no: string;
  rating: number;
  description: string;
  image_uuid: string;
  price_per_night: number;
  imageUrl?: string;
}

interface AddHotelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newHotel: Hotel) => void;
  editData?: Hotel;
}

const AddHotelModal: React.FC<AddHotelModalProps> = ({ isOpen, onClose, onSuccess, editData }) => {
  const [formData, setFormData] = useState({ name: '', location: '', description: '', contact_no: '', rating: 3, price_per_night: 0 });
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
          location: editData.location,
          description: editData.description,
          contact_no: editData.contact_no,
          rating: editData.rating,
          price_per_night: editData.price_per_night,
        });
      } else {
        setFormData({ name: '', location: '', description: '', contact_no: '', rating: 3, price_per_night: 0 });
      }
      setFile(null);
    }
  }

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editData && !file) {
      toast.error('Please select an image.');
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

      const payload: Partial<Hotel> = { ...formData };
      if (image_uuid) payload.image_uuid = image_uuid;

      let res;
      if (editData) {
        res = await api.put(`/api/hotels/${editData.hotel_id}`, payload);
        toast.success('Hotel updated successfully!');
      } else {
        res = await api.post('/api/hotels', payload);
        toast.success('Hotel added successfully!');
      }

      onSuccess(res.data);
      onClose();
    } catch (error: unknown) {
      toast.error((error as { response?: { data?: { message: string } } }).response?.data?.message || 'Failed to save hotel');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1b1c1c]/40 backdrop-blur-sm">
      <div className="bg-white/90 backdrop-blur-xl border border-white/50 w-full max-w-xl rounded-lg shadow-2xl p-6 animate-in fade-in zoom-in duration-300">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-[#1b1c1c]">{editData ? 'Edit Hotel' : 'New Hotel'}</h2>
          <button onClick={onClose} className="hover:bg-black/5 rounded-full p-2"><span className="material-symbols-outlined">close</span></button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600 ml-1">Hotel Name</label>
              <input value={formData.name} className="bg-[#f4f6fa] rounded-2xl p-4 text-sm outline-none w-full" placeholder="e.g. Grand Hotel" required onChange={(e) => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600 ml-1">Location</label>
              <input value={formData.location} className="bg-[#f4f6fa] rounded-2xl p-4 text-sm outline-none w-full" placeholder="e.g. Nuwara Eliya" required onChange={(e) => setFormData({...formData, location: e.target.value})} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600 ml-1">Contact No</label>
              <input value={formData.contact_no} className="bg-[#f4f6fa] rounded-2xl p-4 text-sm outline-none w-full" placeholder="e.g. 077 123 4567" required onChange={(e) => setFormData({...formData, contact_no: e.target.value})} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600 ml-1">Rating (Stars)</label>
              <input type="number" min="1" max="5" value={formData.rating} className="bg-[#f4f6fa] rounded-2xl p-4 text-sm outline-none w-full" placeholder="1-5" required onChange={(e) => setFormData({...formData, rating: Number(e.target.value)})} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600 ml-1">Price per Night (LKR)</label>
              <input type="number" min="0" value={formData.price_per_night} className="bg-[#f4f6fa] rounded-2xl p-4 text-sm outline-none w-full" placeholder="e.g. 15000" required onChange={(e) => setFormData({...formData, price_per_night: Number(e.target.value)})} />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-600 ml-1">Description</label>
            <textarea value={formData.description} className="bg-[#f4f6fa] rounded-2xl p-4 text-sm outline-none w-full h-24 resize-none" placeholder="Enter hotel description..." required onChange={(e) => setFormData({...formData, description: e.target.value})} />
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
            <button type="submit" disabled={loading} className="flex-[2] py-3 bg-[#0059bb] text-white rounded-full font-bold text-sm shadow-lg active:scale-95">{loading ? 'Processing...' : 'Save Hotel'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddHotelModal;
