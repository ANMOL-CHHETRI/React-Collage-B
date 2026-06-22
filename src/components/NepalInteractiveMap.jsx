import { useState } from "react"

const PROVINCES = [
  { id: "sudurpashchim", name: "Sudurpashchim Province", label: "Sudurpashchim" },
  { id: "karnali", name: "Karnali", label: "Karnali" },
  { id: "lumbini", name: "Lumbini", label: "Lumbini" },
  { id: "gandaki", name: "Gandaki", label: "Gandaki" },
  { id: "bagmati", name: "Bagmati", label: "Bagmati" },
  { id: "madhesh", name: "Madhesh", label: "Madhesh" },
  { id: "koshi", name: "Koshi", label: "Koshi" },
]

export default function NepalInteractiveMap({ selectedProvince, onSelectProvince }) {
  const [hoveredProvince, setHoveredProvince] = useState(null)

  const handleProvinceClick = (id) => {
    if (onSelectProvince) onSelectProvince(id)
  }

  const getFillClass = (id) => {
    if (selectedProvince === id) return "fill-orange-500"
    if (hoveredProvince === id) return "fill-orange-400"
    return "fill-slate-200"
  }

  const getLabelClass = (id) => {
    return selectedProvince === id ? "fill-white text-[16px] font-extrabold" : "fill-slate-700 text-[14px]"
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm max-w-5xl mx-auto w-full group">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Interactive Map of Nepal</h2>
        <p className="text-sm text-slate-500 mt-1">
          Active: <span className="font-bold text-orange-600 capitalize">{selectedProvince}</span>
          {hoveredProvince && hoveredProvince !== selectedProvince && (
            <span className="ml-3 text-slate-400">
              Hovering: <span className="capitalize">{hoveredProvince}</span>
            </span>
          )}
        </p>
      </div>

      <div className="relative w-full aspect-[2.5/1] bg-white rounded-2xl p-4 border border-slate-100/80 shadow-inner">
        <svg
          viewBox="0 0 1000 400"
          className="w-full h-full drop-shadow-md"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* P7 (Sudurpashchim) */}
          <polygon
            points="50,160 120,100 165,190 150,310 80,270"
            className={`cursor-pointer stroke-white stroke-[2.5] transition-all duration-300 ease-in-out hover:opacity-90 ${getFillClass("sudurpashchim")}`}
            onClick={() => handleProvinceClick("sudurpashchim")}
            onMouseEnter={() => setHoveredProvince("sudurpashchim")}
            onMouseLeave={() => setHoveredProvince(null)}
          />

          {/* Karnali */}
          <polygon
            points="120,100 265,40 338,150 252,270 165,190"
            className={`cursor-pointer stroke-white stroke-[2.5] transition-all duration-300 ease-in-out hover:opacity-90 ${getFillClass("karnali")}`}
            onClick={() => handleProvinceClick("karnali")}
            onMouseEnter={() => setHoveredProvince("karnali")}
            onMouseLeave={() => setHoveredProvince(null)}
          />

          {/* Lumbini */}
          <polygon
            points="165,190 252,270 350,330 466,290 435,390 295,380 150,310"
            className={`cursor-pointer stroke-white stroke-[2.5] transition-all duration-300 ease-in-out hover:opacity-90 ${getFillClass("lumbini")}`}
            onClick={() => handleProvinceClick("lumbini")}
            onMouseEnter={() => setHoveredProvince("lumbini")}
            onMouseLeave={() => setHoveredProvince(null)}
          />

          {/* Gandaki */}
          <polygon
            points="265,40 440,90 510,210 466,290 350,330 252,270 338,150"
            className={`cursor-pointer stroke-white stroke-[2.5] transition-all duration-300 ease-in-out hover:opacity-90 ${getFillClass("gandaki")}`}
            onClick={() => handleProvinceClick("gandaki")}
            onMouseEnter={() => setHoveredProvince("gandaki")}
            onMouseLeave={() => setHoveredProvince(null)}
          />

          {/* Bagmati */}
          <polygon
            points="440,90 650,140 692,275 595,310 466,290 510,210"
            className={`cursor-pointer stroke-white stroke-[2.5] transition-all duration-300 ease-in-out hover:opacity-90 ${getFillClass("bagmati")}`}
            onClick={() => handleProvinceClick("bagmati")}
            onMouseEnter={() => setHoveredProvince("bagmati")}
            onMouseLeave={() => setHoveredProvince(null)}
          />

          {/* Madhesh */}
          <polygon
            points="595,310 692,275 850,310 835,360 605,345"
            className={`cursor-pointer stroke-white stroke-[2.5] transition-all duration-300 ease-in-out hover:opacity-90 ${getFillClass("madhesh")}`}
            onClick={() => handleProvinceClick("madhesh")}
            onMouseEnter={() => setHoveredProvince("madhesh")}
            onMouseLeave={() => setHoveredProvince(null)}
          />

          {/* Koshi */}
          <polygon
            points="650,140 865,170 895,340 850,310 692,275"
            className={`cursor-pointer stroke-white stroke-[2.5] transition-all duration-300 ease-in-out hover:opacity-90 ${getFillClass("koshi")}`}
            onClick={() => handleProvinceClick("koshi")}
            onMouseEnter={() => setHoveredProvince("koshi")}
            onMouseLeave={() => setHoveredProvince(null)}
          />

          {/* Labels */}
          <g className="pointer-events-none select-none font-sans font-bold transition-all duration-200">
            <text
              x="115"
              y="225"
              textAnchor="middle"
              className={getLabelClass("sudurpashchim")}
              style={{ fontSize: selectedProvince === "sudurpashchim" ? 13 : 11 }}
            >
              Sudurpashchim
            </text>
            <text x="240" y="150" textAnchor="middle" className={getLabelClass("karnali")}>Karnali</text>
            <text x="300" y="300" textAnchor="middle" className={getLabelClass("lumbini")}>Lumbini</text>
            <text x="380" y="180" textAnchor="middle" className={getLabelClass("gandaki")}>Gandaki</text>
            <text x="545" y="210" textAnchor="middle" className={getLabelClass("bagmati")}>Bagmati</text>
            <text x="720" y="325" textAnchor="middle" className={getLabelClass("madhesh")}>Madesh</text>
            <text x="785" y="240" textAnchor="middle" className={getLabelClass("koshi")}>Koshi</text>
          </g>
        </svg>
      </div>
    </div>
  )
}
