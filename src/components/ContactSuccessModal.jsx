import { useNavigate } from "react-router-dom";

const ContactSuccessModal = ({
  open,
  onClose,
  product,
}) => {
  const navigate = useNavigate();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">

      <div className="w-[500px] bg-white rounded-2xl overflow-hidden shadow-2xl animate-[fadeIn_.25s]">

        {/* Header */}
        <div className="bg-emerald-500 text-white px-6 py-4 flex justify-between items-center">
          <h2 className="font-bold text-lg">
            Message Sent Successfully
          </h2>

          <button
            onClick={onClose}
            className="text-2xl"
          >
            ×
          </button>
        </div>

        {/* Body */}

        <div className="p-6 flex gap-5">

          <img
            src={product?.image}
            alt={product?.name}
            className="w-24 h-24 object-cover rounded-lg"
          />

          <div>

            <h3 className="text-lg font-semibold">
              {product?.name}
            </h3>

            <p className="text-slate-500 mt-2">
              Your message has been sent to the seller.
            </p>

            <p className="text-sm text-slate-400 mt-2">
              They will contact you shortly.
            </p>

          </div>

        </div>

        {/* Buttons */}

        <div className="bg-slate-100 p-5 flex justify-end gap-3">

          <button
            onClick={onClose}
            className="border px-5 py-2 rounded-lg hover:bg-white"
          >
            Continue Shopping
          </button>

        </div>

      </div>

    </div>
  );
};

export default ContactSuccessModal;