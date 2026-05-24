import React, { useEffect, useRef } from 'react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scrolling
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Panel */}
      <div 
        ref={modalRef}
        className="relative bg-white rounded-[24px] shadow-2xl w-full max-w-md overflow-hidden transform transition-all duration-300 scale-100 opacity-100"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-headline"
      >
        <div className="px-8 py-8 sm:p-8">
          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-12 sm:w-12">
              <span className="material-symbols-outlined text-[28px] text-red-600">warning</span>
            </div>
            <div className="mt-5 text-center sm:ml-6 sm:mt-0 sm:text-left">
              <h3 className="text-xl font-bold leading-6 text-[#1b1c1c]" id="modal-headline">
                {title}
              </h3>
              <div className="mt-3">
                <p className="text-sm font-medium text-[#717786] leading-relaxed">
                  {message}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-50 px-6 py-5 sm:flex sm:flex-row-reverse sm:px-8 border-t border-slate-100 gap-3">
          <button
            type="button"
            className="inline-flex w-full justify-center rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm shadow-red-500/25 hover:bg-red-500 active:scale-95 transition-all sm:ml-3 sm:w-auto"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Delete Permanently
          </button>
          <button
            type="button"
            className="mt-3 inline-flex w-full justify-center rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-[#717786] shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 active:scale-95 transition-all sm:mt-0 sm:w-auto"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
