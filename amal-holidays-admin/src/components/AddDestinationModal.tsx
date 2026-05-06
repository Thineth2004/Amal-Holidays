import React, { useState } from 'react';
import api from '../api/axiosInstance';
import toast from 'react-hot-toast';

interface AddDestinationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddDestinationModal: React.FC<AddDestinationModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({ name: '', location: '', description: '' });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select an image.');
      return;
    }

    setLoading(true);
    try {
      const imageFormData = new FormData();
      imageFormData.append('image', file);
      const imageRes = await api.post('/api/images/upload', imageFormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const image_uuid = imageRes.data.uuid;

      await api.post('/api/destinations', { ...formData, image_uuid });
      toast.success('Destination added successfully!');
      onSuccess();
      onClose();
    } catch (error: unknown) {
      toast.error((error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to add destination');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1b1c1c]/40 backdrop-blur-sm">
      <div className="bg-white/90 backdrop-blur-xl border border-white/50 w-full max-w-lg rounded-lg shadow-2xl p-6 animate-in fade-in zoom-in duration-300">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-[#1b1c1c] tracking-tight">New Destination</h2>
          <button onClick={onClose} className="hover:bg-black/5 transition-colors rounded-full">
            <span className="material-symbols-outlined text-[#717786] p-2">close</span>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <input 
                className="w-full bg-[#f4f6fa] border-none rounded-2xl p-4 pl-5 text-sm focus:ring-2 focus:ring-[#0059bb] outline-none transition-all" 
                placeholder="Destination Name" 
                required 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
              />
            </div>
            <div className="relative">
              <input 
                className="w-full bg-[#f4f6fa] border-none rounded-2xl p-4 pl-5 text-sm focus:ring-2 focus:ring-[#0059bb] outline-none transition-all" 
                placeholder="Location (e.g., Badulla District)" 
                required 
                onChange={(e) => setFormData({...formData, location: e.target.value})} 
              />
            </div>
            <div className="relative">
              <textarea 
                className="w-full bg-[#f4f6fa] border-none rounded-2xl p-4 pl-5 text-sm focus:ring-2 focus:ring-[#0059bb] outline-none transition-all h-24 resize-none" 
                placeholder="Brief description..." 
                required 
                onChange={(e) => setFormData({...formData, description: e.target.value})} 
              />
            </div>
            
            <div className="border-2 border-dashed border-[#c1c6d7] rounded-2xl p-6 text-center hover:border-[#0059bb] transition-colors cursor-pointer bg-[#f8fbff]">
              <input 
                type="file" 
                id="image-upload"
                onChange={(e) => setFile(e.target.files?.[0] || null)} 
                className="hidden" 
                accept="image/*" 
              />
              <label htmlFor="image-upload" className="cursor-pointer space-y-2">
                <span className="material-symbols-outlined text-4xl text-[#0059bb]">cloud_upload</span>
                <p className="text-sm font-bold text-[#1b1c1c]">{file ? file.name : 'Click to upload image'}</p>
                <p className="text-xs text-[#717786]">PNG, JPG up to 5MB</p>
              </label>
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button type="button" onClick={onClose} className="flex-1 py-3.5 rounded-full bg-[#e8eaf0] hover:bg-[#d8e2ff] font-bold text-sm text-[#414754] transition-all">Cancel</button>
            <button type="submit" disabled={loading} className="flex-[2] py-3.5 rounded-full bg-[#0059bb] hover:bg-[#004799] text-white font-bold text-sm shadow-lg shadow-blue-500/20 active:scale-95 transition-all">
              {loading ? 'Processing...' : 'Save Destination'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDestinationModal;
