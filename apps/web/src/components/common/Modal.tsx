import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  imageSrc?: string;
  description: string;
  details?: string[];
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  imageSrc,
  description,
  details = [],
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/60 backdrop-blur-sm transition-opacity duration-300">
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl transition-all transform scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/40 text-white hover:bg-black/70 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header Image */}
        {imageSrc && (
          <div className="relative h-64 sm:h-80 w-full overflow-hidden">
            <img src={imageSrc} alt={title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6">
              <h3 className="text-2xl sm:text-3xl font-serif-display font-medium text-white">
                {title}
              </h3>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-4 max-h-[60vh] overflow-y-auto">
          {!imageSrc && (
            <h3 className="text-2xl sm:text-3xl font-serif-display font-medium text-[#151717]">
              {title}
            </h3>
          )}
          <p className="text-base text-[#4A4D4D] leading-relaxed">{description}</p>

          {details.length > 0 && (
            <ul className="space-y-2 pt-4 border-t border-[#E4E6E6]">
              {details.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm sm:text-base text-[#151717]">
                  <span className="w-2 h-2 rounded-full bg-[#004D40] mt-2 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}

          <div className="pt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-full bg-[#151717] text-white text-sm font-medium hover:bg-[#2C2E2E] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
