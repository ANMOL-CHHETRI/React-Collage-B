import { useState } from "react"

// Realistic Nepal province SVG paths — viewBox 0 0 800 330
const PROVINCE_PATHS = [
  {
    id: "sudurpashchim",
    label: "Sudurpashchim Province",
    cx: 80,
    cy: 180,
    d: `M 30,155 L 55,118 L 78,95 L 105,88 L 128,105 L 142,130
        L 148,158 L 138,182 L 120,205 L 108,228 L 95,252
        L 80,268 L 58,278 L 38,265 L 22,245 L 18,220 Z`,
  },
  {
    id: "karnali",
    label: "Karnali Province",
    cx: 200,
    cy: 120,
    d: `M 105,88 L 135,68 L 168,52 L 205,45 L 238,48 L 268,60
        L 288,82 L 298,108 L 292,135 L 278,158 L 258,175
        L 238,188 L 215,198 L 192,205 L 168,200 L 148,182
        L 138,182 L 148,158 L 142,130 L 128,105 Z`,
  },
  {
    id: "lumbini",
    label: "Lumbini Province",
    cx: 180,
    cy: 250,
    d: `M 95,252 L 108,228 L 120,205 L 138,182 L 148,182
        L 168,200 L 192,205 L 215,198 L 238,188 L 258,200
        L 268,220 L 272,248 L 262,272 L 245,288 L 218,298
        L 190,305 L 162,310 L 135,305 L 112,295 L 95,278
        L 80,268 Z`,
  },
  {
    id: "gandaki",
    label: "Gandaki Province",
    cx: 320,
    cy: 120,
    d: `M 238,48 L 270,38 L 308,30 L 348,28 L 385,32 L 415,42
        L 435,62 L 445,88 L 440,115 L 428,140 L 410,160
        L 390,178 L 368,192 L 342,200 L 318,205 L 292,198
        L 268,220 L 258,200 L 238,188 L 258,175 L 278,158
        L 292,135 L 298,108 L 288,82 L 268,60 Z`,
  },
  {
    id: "bagmati",
    label: "Bagmati Province",
    cx: 500,
    cy: 120,
    d: `M 415,42 L 452,38 L 492,35 L 528,38 L 562,48 L 590,65
        L 608,88 L 615,115 L 608,142 L 592,162 L 572,178
        L 548,190 L 522,198 L 495,202 L 468,205 L 445,200
        L 420,205 L 410,185 L 410,160 L 428,140 L 440,115
        L 445,88 L 435,62 Z`,
  },
  {
    id: "madhesh",
    label: "Madhesh Province",
    cx: 450,
    cy: 230,
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
    label: "Koshi Province",
    cx: 660,
    cy: 130,
    d: `M 562,48 L 598,42 L 635,38 L 672,40 L 705,48 L 732,62
        L 752,85 L 762,112 L 758,140 L 748,165 L 732,185
        L 712,200 L 688,210 L 662,218 L 635,222 L 610,220
        L 585,228 L 608,215 L 625,195 L 632,168 L 625,140
        L 615,115 L 608,88 L 590,65 Z`,
  },
]

export default function NepalInteractiveMap({ selectedProvince, onSelectProvince }) {
  const [hoveredProvince, setHoveredProvince] = useState(null)

  const selectedPath = selectedProvince
    ? PROVINCE_PATHS.find((p) => p.id === selectedProvince)
    : null

  const handleClick = (e, id) => {
    e.stopPropagation() // Prevent click from bubbling to Add to Cart buttons
    if (onSelectProvince) onSelectProvince(id)
  }

  return (
    <div className="flex flex-col items-center justify-center p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm w-full relative">
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
                ? "fill-red-400 dark:fill-red-800"
                : hoveredProvince === p.id
                ? "fill-red-300 dark:fill-red-900/50"
                : "fill-slate-300 dark:fill-slate-700"
            }`}
            onClick={(e) => handleClick(e, p.id)}
            onMouseEnter={() => setHoveredProvince(p.id)}
            onMouseLeave={() => setHoveredProvince(null)}
          />
        ))}

        {/* Selected province pin + name label */}
        {selectedPath && (
          <g transform={`translate(${selectedPath.cx}, ${selectedPath.cy})`} className="pointer-events-none">
            {/* Bounce animation for pin */}
            <style dangerouslySetInnerHTML={{__html: `
              @keyframes bouncePin {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-8px); }
              }
              .animate-bounce-pin {
                animation: bouncePin 1.5s infinite ease-in-out;
              }
            `}} />
            
            {/* Pin body */}
            <g className="animate-bounce-pin">
              {/* Drop-pin path */}
              <path
                d="M 0,0 C -8,-8 -12,-16 -12,-24 A 12,12 0 0,1 12,-24 C 12,-16 8,-8 0,0 Z"
                fill="#F59E0B"
                stroke="#FFFFFF"
                strokeWidth="2"
                className="drop-shadow-md"
              />
              {/* Inner pin circle */}
              <circle cx="0" cy="-24" r="4" fill="#FFFFFF" />
            </g>
            
            {/* Province label badge */}
            <g transform="translate(0, 8)">
              {/* Text background bubble */}
              <rect
                x="-70"
                y="0"
                width="140"
                height="22"
                rx="11"
                fill="#1E293B"
                className="stroke-amber-500/50 stroke-[1]"
                opacity="0.95"
              />
              {/* Province label text */}
              <text
                x="0"
                y="14"
                fill="#FFFFFF"
                fontSize="10"
                fontWeight="bold"
                textAnchor="middle"
              >
                {selectedPath.label}
              </text>
            </g>
          </g>
        )}
      </svg>
    </div>
  )
}
