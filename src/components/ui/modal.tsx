// // import { useEffect, useState } from 'react';

// // // Modal Component - Reusable
// // export const Modal = ({ isOpen, onClose, title, children, width, footerBtnText, zIndex,  showFooter = true, onConfirm }) => {
// //    // Background scroll lock
// //   useEffect(() => {
// //     if (isOpen) {
// //       // Modal open hone pe body scroll lock karo
// //       document.body.style.overflow = 'hidden';
// //     } else {
// //       // Modal close hone pe scroll restore karo
// //       document.body.style.overflow = 'unset';
// //     }

// //     // Cleanup function - component unmount pe
// //     return () => {
// //       document.body.style.overflow = 'unset';
// //     };
// //   }, [isOpen]);

// //   // if (!isOpen) return null;
// //   if (!isOpen) return null;

// //   return (
// //     <div
// //       className={`fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center p-4  animate-fadeIn backdrop-blur-sm ${zIndex === true ? 'z-[9999]' : 'z-50'}`}
// //       // onClick={onClose}
// //     >
// //       <div
// //         className={`bg-white rounded-md shadow-2xl ${width} w-full animate-slideUp`}
// //         onClick={(e) => e.stopPropagation()}
// //       >
// //         {/* Modal Header */}
// //         <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200">
// //           <h2 className="md:text-2xl text-base font-bold text-black">
// //             {title}
// //           </h2>
// //           <button
// //             onClick={onClose}
// //             className="text-black  transition-colors duration-200"
// //           >
// //             <svg
// //               className="w-6 h-6"
// //               fill="none"
// //               stroke="currentColor"
// //               viewBox="0 0 24 24"
// //             >
// //               <path
// //                 strokeLinecap="round"
// //                 strokeLinejoin="round"
// //                 strokeWidth={2}
// //                 d="M6 18L18 6M6 6l12 12"
// //               />
// //             </svg>
// //           </button>
// //         </div>

// //         {/* Modal Body - Children */}
// //         <div className={`p-6 `}>
// //           {children}
// //         </div>

// //         {/* Modal Footer */}
// //         {showFooter && (
// //           <div className="flex gap-3 p-6 border-t border-gray-200">
// //             <button
// //               onClick={onClose}
// //               className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors duration-200"
// //             >
// //               Cancel
// //             </button>
// //             <button
// //               onClick={() => {
// //                 if (onConfirm) onConfirm();
// //                 onClose();
// //               }}
// //               className="flex-1 bg-[#186737] text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200"
// //             >
// //               {footerBtnText || 'Confirm'}
// //             </button>
// //           </div>
// //         )}
// //       </div>

// //       {/* Custom Animations */}
// //       <style>{`
// //         @keyframes fadeIn {
// //           from {
// //             opacity: 0;
// //           }
// //           to {
// //             opacity: 1;
// //           }
// //         }

// //         @keyframes slideUp {
// //           from {
// //             opacity: 0;
// //             transform: translateY(20px);
// //           }
// //           to {
// //             opacity: 1;
// //             transform: translateY(0);
// //           }
// //         }

// //         .animate-fadeIn {
// //           animation: fadeIn 0.2s ease-out;
// //         }

// //         .animate-slideUp {
// //           animation: slideUp 0.3s ease-out;
// //         }
// //       `}</style>
// //     </div>
// //   );
// // }


// // Modal.jsx
// import { useEffect, useState } from 'react';
// import ReactDOM from 'react-dom';

// export const Modal = ({ 
//   isOpen, 
//   onClose, 
//   title, 
//   children, 
//   showFooter, 
//   width = "max-w-3xl" 
// }) => {
//   const [isAnimating, setIsAnimating] = useState(false);

//   useEffect(() => {
//     if (isOpen) {
//       setIsAnimating(true);
//       document.body.style.overflow = 'hidden';
//     } else {
//       setIsAnimating(false);
//       document.body.style.overflow = 'unset';
//     }
    
//     return () => {
//       document.body.style.overflow = 'unset';
//     };
//   }, [isOpen]);

//   // ESC key se close
//   useEffect(() => {
//     const handleEsc = (e) => {
//       if (e.key === 'Escape' && isOpen) {
//         onClose();
//       }
//     };
    
//     window.addEventListener('keydown', handleEsc);
//     return () => window.removeEventListener('keydown', handleEsc);
//   }, [isOpen, onClose]);

//   if (!isOpen && !isAnimating) return null;

//   return ReactDOM.createPortal(
//     <div className="fixed inset-0 z-[9999] overflow-y-auto">
//       {/* Backdrop */}
//       <div 
//         className={`fixed inset-0 bg-black transition-opacity duration-300 ${
//           isAnimating ? 'bg-opacity-50' : 'bg-opacity-0'
//         }`}
//         onClick={onClose}
//       />
      
//       {/* Modal Content */}
//       <div className="flex min-h-full items-center justify-center p-4 sm:p-6 lg:p-8">
//         <div 
//           className={`relative bg-white rounded-lg shadow-xl ${width} w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 ${
//             isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
//           }`}
//           onClick={(e) => e.stopPropagation()}
//         >
//           {/* Header */}
//           <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-4 border-b">
//             <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
//             <button
//               onClick={onClose}
//               className="text-gray-400 hover:text-gray-600 transition-colors text-2xl leading-none w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
//               aria-label="Close modal"
//             >
//               ×
//             </button>
//           </div>
          
//           {/* Body */}
//           <div className="p-4 sm:p-6">
//             {children}
//           </div>
          
//           {/* Footer (optional) */}
//           {showFooter && (
//             <div className="sticky bottom-0 bg-white border-t p-4 sm:p-6">
//               {/* Footer content */}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>,
//     document.body
//   );
// };

// Modal.jsx


import { useEffect, useState, ReactNode } from 'react';
import ReactDOM from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  width?: string;
  footerBtnText?: string;
  zIndex?: boolean;
  showFooter?: boolean;
  onConfirm?: () => void;
}

export const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  width = "max-w-3xl",
  footerBtnText,
  zIndex,
  showFooter = false,
  onConfirm 
}: ModalProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      document.body.style.overflow = 'hidden';
    } else {
      setIsAnimating(false);
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // ESC key se close
  useEffect(() => {
    const handleEsc = (e:any) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen && !isAnimating) return null;

  return ReactDOM.createPortal(
    <div 
      className={`fixed inset-0  bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-300 ${
        zIndex === true ? 'z-[9999]' : 'z-50'
      } ${isAnimating ? 'animate-fadeIn' : 'opacity-0'}`}
    >
      {/* Modal Content */}
      <div 
        className={`bg-white rounded-md shadow-2xl ${width} w-full max-h-[90vh] overflow-hidden ${
          isAnimating ? 'animate-slideUp' : 'opacity-0 translate-y-5'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200">
          <h2 className="md:text-2xl text-base font-bold text-black">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-black hover:text-black transition-colors duration-200"
            aria-label="Close modal"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {children}
        </div>

        {/* Modal Footer */}
        {showFooter && (
          <div className="flex gap-3 p-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (onConfirm) onConfirm();
                onClose();
              }}
              className="flex-1 bg-[#186737] text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              {footerBtnText || 'Confirm'}
            </button>
          </div>
        )}
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>,
    document.body
  );
};