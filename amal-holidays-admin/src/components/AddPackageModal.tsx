import React from 'react';

interface AddPackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newPkg: any) => void;
}

const AddPackageModal: React.FC<AddPackageModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6">
        <h2 className="text-2xl font-extrabold text-[#1b1c1c] mb-6">Add New Package</h2>
        <p className="text-[#717786] mb-6">Modal functionality will be implemented later.</p>
        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-full font-bold text-sm text-[#414754] bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPackageModal;
