import { provincesData } from "../data/provincesData"

const provincePaths = [
  { id: "sudurpashchim", d: "M 20 120 L 70 80 L 100 130 L 90 200 L 40 180 Z", label: "P7", x: 50, y: 150 },
  { id: "karnali", d: "M 70 80 L 170 40 L 220 95 L 160 160 L 100 130 Z", label: "Karnali", x: 140, y: 110 },
  { id: "lumbini", d: "M 90 200 L 100 130 L 160 160 L 230 200 L 310 180 L 290 240 L 190 235 Z", label: "Lumbini", x: 180, y: 200 },
  { id: "gandaki", d: "M 170 40 L 290 70 L 340 140 L 310 180 L 230 200 L 160 160 L 220 95 Z", label: "Gandaki", x: 235, y: 125 },
  { id: "bagmati", d: "M 290 70 L 440 100 L 470 180 L 400 200 L 310 180 L 340 140 Z", label: "Bagmati", x: 350, y: 145 },
  { id: "madhesh", d: "M 400 200 L 470 180 L 580 200 L 570 230 L 410 220 Z", label: "Madhesh", x: 470, y: 210 },
  { id: "koshi", d: "M 440 100 L 590 120 L 610 220 L 580 200 L 470 180 Z", label: "Koshi", x: 525, y: 160 },
]

const ProvinceDetails = ({ province }) => (
  <div className="bg-amber-50/50 rounded-2xl border border-amber-100 p-5 shadow-sm space-y-3.5">
    <div className="flex items-center justify-between border-b border-amber-100/50 pb-2">
      <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
        {province.name}
      </h4>
      <span className="text-[10px] font-bold text-amber-600 uppercase bg-white px-2 py-0.5 rounded-full border border-amber-100">
        {province.status.includes("Express") ? "Express Available" : "Standard Active"}
      </span>
    </div>
    <p className="text-xs text-slate-600 leading-relaxed font-medium">{province.description}</p>
    <div className="grid grid-cols-2 gap-3 text-xs pt-1">
      <div>
        <span className="text-slate-400 block text-[9px] font-bold uppercase">Delivery Speed</span>
        <span className="font-bold text-slate-700">{province.deliveryTime}</span>
      </div>
      <div>
        <span className="text-slate-400 block text-[9px] font-bold uppercase">Shipping Fee</span>
        <span className="font-bold text-slate-700">Rs. {province.shippingFee}</span>
      </div>
    </div>
    <div>
      <span className="text-slate-400 block text-[9px] font-bold uppercase">Primary Logistics Hubs</span>
      <span className="text-xs font-bold text-slate-700">{province.hubs}</span>
    </div>
  </div>
)

const NepalDeliveryMap = ({ selectedProvince, onSelectProvince, showDetails = true, compact = false }) => {
  const activeProvince = provincesData[selectedProvince]

  const mapBlock = (
    <div className={`w-full bg-slate-50 rounded-3xl border border-slate-200 p-6 shadow-inner ${compact ? "" : "max-w-[620px]"}`}>
      <div className="text-center mb-4">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">Nepal Delivery Map</span>
        <span className="text-xs font-bold text-slate-600">Click a province to check delivery info</span>
      </div>

      <svg viewBox="0 0 700 300" className="w-full h-auto drop-shadow-lg select-none" role="img" aria-label="Interactive map of Nepal provinces">
        {provincePaths.map((province) => (
          <path
            key={province.id}
            d={province.d}
            onClick={() => onSelectProvince(province.id)}
            className={`stroke-white stroke-2 cursor-pointer transition-all duration-300 hover:fill-amber-400 ${
              selectedProvince === province.id ? "fill-amber-500" : "fill-slate-300"
            }`}
          />
        ))}
        {provincePaths.map((province) => (
          <text key={`${province.id}-label`} x={province.x} y={province.y} className="text-[9px] font-bold fill-slate-700 pointer-events-none">
            {province.label}
          </text>
        ))}
      </svg>

      <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 bg-amber-500 rounded-sm"></span>
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 bg-slate-300 rounded-sm"></span>
          <span>Coverage Active</span>
        </div>
      </div>
    </div>
  )

  if (compact) {
    return (
      <div className="space-y-4">
        {mapBlock}
        {showDetails && activeProvince && <ProvinceDetails province={activeProvince} />}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
      <div className="lg:col-span-5 space-y-6">
        <span className="text-xs font-extrabold text-amber-600 uppercase tracking-widest block">Delivery Network</span>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Express Shipping Throughout Nepal
        </h2>
        <p className="text-slate-500 text-sm leading-relaxed">
          Click on the interactive map to check delivery speed, shipping cost, and logistics hubs for your region. We deliver right to your door with Cash on Delivery.
        </p>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center mb-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-xs font-bold text-slate-800 block">24h Express</span>
            <span className="text-[10px] text-slate-400">Available in Kathmandu Valley</span>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center mb-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <span className="text-xs font-bold text-slate-800 block">Cash on Delivery</span>
            <span className="text-[10px] text-slate-400">100% secure payment on delivery</span>
          </div>
        </div>

        {showDetails && activeProvince && <ProvinceDetails province={activeProvince} />}
      </div>

      <div className="lg:col-span-7 flex flex-col items-center">{mapBlock}</div>
    </div>
  )
}

export default NepalDeliveryMap
