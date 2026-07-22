const OutOfStockModal = ({ productName, onClose }) => {
  if (!productName) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 text-center">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>
        </div>

        <h3 className="text-lg font-bold text-slate-900 mb-1">Out of Stock</h3>
        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
          <span className="font-medium text-slate-700">{productName}</span> is currently out of stock.
         
        </p>

        <button
          onClick={onClose}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 rounded-xl transition cursor-pointer"
        >
          Got it
        </button>
      </div>
    </div>
  )
}

export default OutOfStockModal