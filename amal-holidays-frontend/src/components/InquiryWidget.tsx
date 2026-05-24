import React, { useState } from 'react';
import api from '../api/axiosInstance';
import toast from 'react-hot-toast';

const InquiryWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    subject: '',
    content: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleModal = () => setIsOpen(!isOpen);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/inquiries', formData);
      toast.success('Inquiry sent successfully!');
      setFormData({ name: '', contact: '', subject: '', content: '' });
      setIsOpen(false);
    } catch (error: unknown) {
      toast.error((error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to send inquiry');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={toggleModal}
        className="fixed bottom-6 right-6 z-50 bg-[#0059bb] text-white w-14 h-14 rounded-full shadow-xl flex items-center justify-center hover:scale-110 hover:bg-[#004494] transition-all duration-300 active:scale-95"
        title="Send an Inquiry"
      >
        <span className="material-symbols-outlined text-[28px]">
          {isOpen ? 'close' : 'chat_bubble'}
        </span>
      </button>

      {/* Inquiry Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col font-['Plus_Jakarta_Sans'] animate-in fade-in zoom-in-95 duration-300">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#0059bb] to-[#0070e0] text-white">
              <h2 className="text-xl font-extrabold tracking-tight flex items-center gap-2">
                <span className="material-symbols-outlined">help</span>
                Send an Inquiry
              </h2>
              <button
                onClick={toggleModal}
                className="text-white/80 hover:text-white transition-colors"
                title="Close"
              >
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 bg-slate-50">
              <div>
                <label className="block text-sm font-bold text-[#414754] mb-1">Your Name</label>
                <input
                  required
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. John Doe"
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-md text-sm focus:ring-4 focus:ring-[#0059bb]/10 focus:border-[#0059bb] outline-none transition-all placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#414754] mb-1">Contact (Email or Phone)</label>
                <input
                  required
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  placeholder="e.g. john@example.com or +123456789"
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-md text-sm focus:ring-4 focus:ring-[#0059bb]/10 focus:border-[#0059bb] outline-none transition-all placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#414754] mb-1">Subject</label>
                <input
                  required
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="e.g. Custom Tour Package"
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-md text-sm focus:ring-4 focus:ring-[#0059bb]/10 focus:border-[#0059bb] outline-none transition-all placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#414754] mb-1">Inquiry Details</label>
                <textarea
                  required
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="How can we help you?"
                  rows={4}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-md text-sm focus:ring-4 focus:ring-[#0059bb]/10 focus:border-[#0059bb] outline-none transition-all resize-none placeholder:text-slate-400"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-[#0059bb] text-white rounded-xl font-bold hover:bg-[#004494] transition-all shadow-md active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span className="material-symbols-outlined animate-spin">refresh</span>
                  ) : (
                    <span className="material-symbols-outlined">send</span>
                  )}
                  {isSubmitting ? 'Sending...' : 'Inquire Now'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default InquiryWidget;
