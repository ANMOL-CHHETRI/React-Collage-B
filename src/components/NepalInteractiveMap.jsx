import { useState } from "react"

// Realistic Nepal province SVG paths — viewBox 0 0 800 330
const PROVINCE_PATHS = [
  {
    id: "sudurpashchim",
    label: "Sudurpashchim",
    labelX: 72,
    labelY: 218,
    d: `M 30,155 L 55,118 L 78,95 L 105,88 L 128,105 L 142,130
        L 148,158 L 138,182 L 120,205 L 108,228 L 95,252
        L 80,268 L 58,278 L 38,265 L 22,245 L 18,220 Z`,
  },
  {
    id: "karnali",
    label: "Karnali",
    labelX: 212,
    labelY: 145,
    d: `M 105,88 L 135,68 L 168,52 L 205,45 L 238,48 L 268,60
        L 288,82 L 298,108 L 292,135 L 278,158 L 258,175
        L 238,188 L 215,198 L 192,205 L 168,200 L 148,182
        L 138,182 L 148,158 L 142,130 L 128,105 Z`,
  },
  {
    id: "lumbini",
    label: "Lumbini",
    labelX: 218,
    labelY: 275,
    d: `M 95,252 L 108,228 L 120,205 L 138,182 L 148,182
        L 168,200 L 192,205 L 215,198 L 238,188 L 258,200
        L 268,220 L 272,248 L 262,272 L 245,288 L 218,298
        L 190,305 L 162,310 L 135,305 L 112,295 L 95,278
        L 80,268 Z`,
  },
  {
    id: "gandaki",
    label: "Gandaki",
    labelX: 355,
    labelY: 168,
    d: `M 238,48 L 270,38 L 308,30 L 348,28 L 385,32 L 415,42
        L 435,62 L 445,88 L 440,115 L 428,140 L 410,160
        L 390,178 L 368,192 L 342,200 L 318,205 L 292,198
        L 268,220 L 258,200 L 238,188 L 258,175 L 278,158
        L 292,135 L 298,108 L 288,82 L 268,60 Z`,
  },
  {
    id: "bagmati",
    label: "Bagmati",
    labelX: 528,
    labelY: 165,
    d: `M 415,42 L 452,38 L 492,35 L 528,38 L 562,48 L 590,65
        L 608,88 L 615,115 L 608,142 L 592,162 L 572,178
        L 548,190 L 522,198 L 495,202 L 468,205 L 445,200
        L 420,205 L 410,185 L 410,160 L 428,140 L 440,115
        L 445,88 L 435,62 Z`,
  },
  {
    id: "madhesh",
    label: "Madhesh",
    labelX: 465,
    labelY: 255,
    d: `M 268,220 L 292,218 L 318,205 L 342,200 L 368,192
        L 390,178 L 410,160 L 410,185 L 420,205 L 445,200
        L 468,205 L 495,202 L 522,198 L 548,190 L 572,178
        L 592,162 L 608,142 L 625,140 L 632,168 L 625,195
        L 608,215 L 585,228 L 558,238 L 525,248 L 492,255
        L 458,260 L 422,262 L 388,260 L 355,255 L 328,245
        L 308,232 L 292,218 L 285,202 L 272,248 L 268,220 Z`,
  },
  {
    id: "koshi",
    label: "Koshi",
    labelX: 695,
    labelY: 168,
    d: `M 562,48 L 598,42 L 635,38 L 672,40 L 705,48 L 732,62
        L 752,85 L 762,112 L 758,140 L 748,165 L 732,185
        L 712,200 L 688,210 L 662,218 L 635,222 L 610,220
        L 585,228 L 608,215 L 625,195 L 632,168 L 625,140
        L 615,115 L 608,88 L 590,65 Z`,
  },
]

export default function NepalInteractiveMap({ selectedProvince, onSelectProvince }) {
  const [hoveredProvince, setHoveredProvince] = useState(null)

  const handleClick = (id) => {
    if (onSelectProvince) onSelectProvince(id)
  }

  return (
    <div className="flex flex-col items-center justify-center p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm w-full">
      <div className="mb-4 text-center">
        <h2 className="text-sm font-bold text-slate-800 dark:text-white">Select Province</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Active:{" "}
          <span className="font-bold text-orange-600 dark:text-orange-400 capitalize">
            {selectedProvince}
          </span>
        </p>
      </div>

      <svg
        viewBox="0 0 800 330"
        className="w-full h-auto drop-shadow-md select-none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Nepal province map"
      >
        {PROVINCE_PATHS.map((p) => (
          <path
            key={p.id}
            d={p.d}
            className={`stroke-white dark:stroke-slate-700 stroke-[2] cursor-pointer transition-all duration-200 ${
              selectedProvince === p.id
                ? "fill-orange-500"
                : hoveredProvince === p.id
                ? "fill-orange-300 dark:fill-orange-400/70"
                : "fill-slate-300 dark:fill-slate-700"
            }`}
            onClick={() => handleClick(p.id)}
            onMouseEnter={() => setHoveredProvince(p.id)}
            onMouseLeave={() => setHoveredProvince(null)}
          />
        ))}

        {/* Labels */}
        {PROVINCE_PATHS.map((p) => (
          <text
            key={`${p.id}-lbl`}
            x={p.labelX}
            y={p.labelY}
            textAnchor="middle"
            style={{
              fontSize: p.id === "sudurpashchim" ? 7 : 8.5,
              fontWeight: 700,
              fontFamily: "sans-serif",
              pointerEvents: "none",
              fill: selectedProvince === p.id ? "#ffffff" : "#475569",
            }}
          >
            {p.label}
          </text>
        ))}
      </svg>

      <div className="flex items-center justify-center gap-5 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-[9px] font-bold text-slate-500 uppercase tracking-wider">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-orange-500 inline-block"></span>
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-slate-300 dark:bg-slate-700 inline-block"></span>
          <span>Coverage Active</span>
        </div>
      </div>
    </div>
  )
}
