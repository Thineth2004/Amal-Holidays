import React, { useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import toast from 'react-hot-toast';

interface Destination {
  destination_id: number;
  name: string;
  location: string;
  description: string;
  image_uuid: string;
  imageUrl?: string;
}

interface AddDestinationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newDestination: Destination) => void;
  editData?: Destination;
}

const AddDestinationModal: React.FC<AddDestinationModalProps> = ({ isOpen, onClose, onSuccess, editData }) => {
  const [formData, setFormData] = useState({ name: '', location: '', description: '' });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && editData) {
      setFormData({
        name: editData.name,
        location: editData.location,
        description: editData.description,
      });
      setFile(null);
    }
    if (isOpen && !editData) {
      setFormData({ name: '', location: '', description: '' });
      setFile(null);
    }
  }, [isOpen, editData]);

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

      const payload: any = {
        ...formData,
      };

      if (image_uuid) {
        payload.image_uuid = image_uuid;
      }

      let destRes;
      if (editData) {
        destRes = await api.put(`/api/destinations/${editData.destination_id}`, payload);
        toast.success('Destination updated successfully!');
      } else {
        destRes = await api.post('/api/destinations', payload);
        toast.success('Destination added successfully!');
      }

      onSuccess(destRes.data);
      onClose();
    } catch (error: unknown) {
      toast.error((error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to save destination');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1b1c1c]/40 backdrop-blur-sm">
      <div className="bg-white/90 backdrop-blur-xl border border-white/50 w-full max-w-lg rounded-lg shadow-2xl p-6 animate-in fade-in zoom-in duration-300">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-[#1b1c1c] tracking-tight">
            {editData ? 'Edit Destination' : 'New Destination'}
          </h2>
          <button onClick={onClose} className="hover:bg-black/5 transition-colors rounded-full">
            <span className="material-symbols-outlined text-[#717786] p-2">close</span>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <input 
                value={formData.name}
                className="w-full bg-[#f4f6fa] border-none rounded-2xl p-4 pl-5 text-sm focus:ring-2 focus:ring-[#0059bb] outline-none transition-all" 
                placeholder="Destination Name" 
                required 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
              />
            </div>
            <div className="relative">
              <input 
                value={formData.location}
                className="w-full bg-[#f4f6fa] border-none rounded-2xl p-4 pl-5 text-sm focus:ring-2 focus:ring-[#0059bb] outline-none transition-all" 
                placeholder="Location (e.g., Badulla District)" 
                required 
                onChange={(e) => setFormData({...formData, location: e.target.value})} 
              />
            </div>
            <div className="relative">
              <textarea 
                value={formData.description}
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
                <p className="text-sm font-bold text-[#1b1c1c]">{file ? file.name : editData ? 'Leave blank to keep existing image' : 'Click to upload image'}</p>
                <p className="text-xs text-[#717786]">PNG, JPG up to 5MB</p>
              </label>
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button type="button" onClick={onClose} className="flex-1 py-3.5 rounded-full bg-[#e8eaf0] hover:bg-[#d8e2ff] font-bold text-sm text-[#414754] transition-all">Cancel</button>
            <button type="submit" disabled={loading} className="flex-[2] py-3.5 rounded-full bg-[#0059bb] hover:bg-[#004799] text-white font-bold text-sm shadow-lg shadow-blue-500/20 active:scale-95 transition-all">
              {loading ? 'Processing...' : editData ? 'Update Destination' : 'Save Destination'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDestinationModal;
