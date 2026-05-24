import React, { useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import toast from 'react-hot-toast';

interface Destination {
  destination_id: number;
  name: string;
}

interface PackageForm {
  title: string;
  description: string;
  price: string;
  available_slots: string;
  capacity: string;
  start_date: string;
  end_date: string;
  destination_id: string;
}

interface AddPackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newPkg: any) => void;
  editData?: any;
}

const AddPackageModal: React.FC<AddPackageModalProps> = ({ isOpen, onClose, onSuccess, editData }) => {
  const [formData, setFormData] = useState<PackageForm>({
    title: '',
    description: '',
    price: '',
    available_slots: '',
    capacity: '',
    start_date: '',
    end_date: '',
    destination_id: '',
  });
  
  const [files, setFiles] = useState<File[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const fetchDestinations = async () => {
        try {
          const res = await api.get('/api/destinations');
          setDestinations(res.data.map((d: any) => ({ destination_id: d.destination_id || d.id, name: d.name })));
        } catch (error) {
          toast.error("Failed to load destinations.");
        }
      };
      fetchDestinations();
      if (editData) {
        setFormData({
          title: editData.title,
          description: editData.description,
          price: editData.price.toString(),
          available_slots: editData.available_slots.toString(),
          capacity: editData.capacity.toString(),
          start_date: new Date(editData.start_date).toISOString().split('T')[0],
          end_date: new Date(editData.end_date).toISOString().split('T')[0],
          destination_id: editData.destination_id.toString(),
        });
      } else {
        setFormData({
          title: '',
          description: '',
          price: '',
          available_slots: '',
          capacity: '',
          start_date: '',
          end_date: '',
          destination_id: '',
        });
      }
      setFiles([]);
    }
  }, [isOpen, editData]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      if (selectedFiles.length + files.length > 5) {
        toast.error('You can only upload up to 5 images.');
        return;
      }
      setFiles((prev) => [...prev, ...selectedFiles].slice(0, 5));
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editData && files.length !== 5) {
      toast.error('Please upload exactly 5 images.');
      return;
    }
    if (editData && files.length > 0 && files.length !== 5) {
      toast.error('If you are updating images, please upload exactly 5 images.');
      return;
    }

    if (!formData.destination_id) {
      toast.error('Please select a destination.');
      return;
    }

    setLoading(true);
    try {
      const image_uuids: string[] = [];
      if (files.length === 5) {
        for (const file of files) {
          const imageFormData = new FormData();
          imageFormData.append('image', file);
          const imageRes = await api.post('/api/images/upload', imageFormData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          image_uuids.push(imageRes.data.uuid);
        }
      }

      const payload: any = {
        ...formData,
        price: Number(formData.price),
        available_slots: Number(formData.available_slots),
        capacity: Number(formData.capacity),
        destination_id: Number(formData.destination_id),
      };

      if (image_uuids.length === 5) {
        payload.image_uuids = image_uuids;
      }

      let pkgRes;
      if (editData) {
        pkgRes = await api.put(`/api/packages/${editData.package_id}`, payload);
        toast.success('Package updated successfully!');
      } else {
        pkgRes = await api.post('/api/packages', payload);
        toast.success('Package added successfully!');
      }
      onSuccess(pkgRes.data);
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save package');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1b1c1c]/40 backdrop-blur-sm">
      <div className="bg-white/90 backdrop-blur-xl border border-white/50 w-full max-w-2xl rounded-lg shadow-2xl p-6 animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-[#1b1c1c] tracking-tight">
            {editData ? 'Edit Tour Package' : 'New Tour Package'}
          </h2>
          <button onClick={onClose} className="hover:bg-black/5 transition-colors rounded-full">
            <span className="material-symbols-outlined text-[#717786] p-2">close</span>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2 flex flex-col gap-1">
              <label className="block text-xs font-bold text-[#717786] mb-1 ml-2">Package Title</label>
              <input 
                className="w-full bg-[#f4f6fa] border-none rounded-2xl p-4 pl-5 text-sm focus:ring-2 focus:ring-[#0059bb] outline-none transition-all" 
                placeholder="e.g. 3 Days in Nuwara Eliya" 
                required 
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})} 
              />
            </div>

            <div className="md:col-span-2 flex flex-col gap-1">
              <label className="block text-xs font-bold text-[#717786] mb-1 ml-2">Description</label>
              <textarea 
                className="w-full bg-[#f4f6fa] border-none rounded-2xl p-4 pl-5 text-sm focus:ring-2 focus:ring-[#0059bb] outline-none transition-all h-24 resize-none" 
                placeholder="Enter detailed package description..." 
                required 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})} 
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#717786] mb-1 ml-2">Destination</label>
              <select
                required
                className="w-full bg-[#f4f6fa] border-none rounded-2xl p-4 pl-5 text-sm focus:ring-2 focus:ring-[#0059bb] outline-none transition-all"
                value={formData.destination_id}
                onChange={(e) => setFormData({...formData, destination_id: e.target.value})}
              >
                <option value="" disabled>Select Destination</option>
                {destinations.map(d => (
                  <option key={d.destination_id} value={d.destination_id}>{d.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#717786] mb-1 ml-2">Price (Rs.)</label>
              <input 
                type="number"
                min="0"
                className="w-full bg-[#f4f6fa] border-none rounded-2xl p-4 pl-5 text-sm focus:ring-2 focus:ring-[#0059bb] outline-none transition-all" 
                placeholder="Price" 
                required 
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})} 
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#717786] mb-1 ml-2">Total Capacity</label>
              <input 
                type="number"
                min="1"
                className="w-full bg-[#f4f6fa] border-none rounded-2xl p-4 pl-5 text-sm focus:ring-2 focus:ring-[#0059bb] outline-none transition-all" 
                placeholder="Capacity" 
                required 
                value={formData.capacity}
                onChange={(e) => setFormData({...formData, capacity: e.target.value})} 
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#717786] mb-1 ml-2">Available Slots</label>
              <input 
                type="number"
                min="0"
                className="w-full bg-[#f4f6fa] border-none rounded-2xl p-4 pl-5 text-sm focus:ring-2 focus:ring-[#0059bb] outline-none transition-all" 
                placeholder="Available Slots" 
                required 
                value={formData.available_slots}
                onChange={(e) => setFormData({...formData, available_slots: e.target.value})} 
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#717786] mb-1 ml-2">Start Date</label>
              <input 
                type="date"
                className="w-full bg-[#f4f6fa] border-none rounded-2xl p-4 pl-5 text-sm focus:ring-2 focus:ring-[#0059bb] outline-none transition-all" 
                required 
                value={formData.start_date}
                onChange={(e) => setFormData({...formData, start_date: e.target.value})} 
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#717786] mb-1 ml-2">End Date</label>
              <input 
                type="date"
                className="w-full bg-[#f4f6fa] border-none rounded-2xl p-4 pl-5 text-sm focus:ring-2 focus:ring-[#0059bb] outline-none transition-all" 
                required 
                value={formData.end_date}
                onChange={(e) => setFormData({...formData, end_date: e.target.value})} 
              />
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-bold text-[#717786] mb-2 ml-2">Upload Images (Up to 5)</label>
            <div className="border-2 border-dashed border-[#c1c6d7] rounded-2xl p-6 text-center hover:border-[#0059bb] transition-colors bg-[#f8fbff] relative">
              <input 
                type="file" 
                id="images-upload"
                multiple
                onChange={handleFileChange} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                accept="image/*" 
                disabled={files.length >= 5}
              />
              <div className="space-y-2 pointer-events-none">
                <span className="material-symbols-outlined text-4xl text-[#0059bb]">collections</span>
                <p className="text-sm font-bold text-[#1b1c1c]">
                  {editData && files.length === 0 ? 'Leave empty to keep existing images, or upload exactly 5 new images' : 'Drag & Drop or Click to Browse'}
                </p>
                <p className="text-xs text-[#717786]">{files.length}/5 images selected</p>
              </div>
            </div>

            {files.length > 0 && (
              <div className="mt-4 flex gap-2 flex-wrap">
                {files.map((f, i) => (
                  <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden shadow-sm border border-slate-200">
                    <img src={URL.createObjectURL(f)} alt="preview" className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => removeFile(i)}
                      className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-red-500 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[12px]">close</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-8">
            <button type="button" onClick={onClose} className="flex-1 py-3.5 rounded-full bg-[#e8eaf0] hover:bg-[#d8e2ff] font-bold text-sm text-[#414754] transition-all">Cancel</button>
            <button type="submit" disabled={loading} className="flex-[2] py-3.5 rounded-full bg-[#0059bb] hover:bg-[#004799] text-white font-bold text-sm shadow-lg shadow-blue-500/20 active:scale-95 transition-all">
              {loading ? 'Processing...' : 'Save Package'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPackageModal;
