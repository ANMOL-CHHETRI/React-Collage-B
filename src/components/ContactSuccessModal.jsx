import { ImageWithSkeleton } from "./ImageWithSkeleton";

const ContactSuccessModal = ({
  open,
  onClose,
  product,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-2xl animate-[fadeIn_.25s] border border-slate-200 dark:border-slate-800 max-h-[90dvh] overflow-y-auto">
        {/* Header */}
        <div className="bg-emerald-500 text-white px-6 py-4 flex justify-between items-center">
          <h2 className="font-bold text-lg">
            Message Sent Successfully
          </h2>
          <button
            onClick={onClose}
            className="text-2xl cursor-pointer"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex gap-5">
          <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0">
            <ImageWithSkeleton
              src={product?.images?.[0] || product?.image || product?.imageUrl || product?.downloadUrl}
              alt={product?.name || "Product"}
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              {product?.name}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
              Your message has been sent to the seller.
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              They will contact you shortly.
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="bg-slate-50 dark:bg-slate-950 p-5 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={onClose}
            className="border border-slate-300 dark:border-slate-700 px-5 py-2 rounded-lg hover:bg-white dark:hover:bg-slate-800 text-sm font-semibold text-slate-700 dark:text-slate-200 transition cursor-pointer"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactSuccessModal;