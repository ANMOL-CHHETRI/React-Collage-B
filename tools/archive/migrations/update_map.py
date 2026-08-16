import sys

with open('src/components/NepalDeliveryMap.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace map colors
content = content.replace('const DEFAULT_COLOR  = "#94a3b8"', 'const DEFAULT_COLOR  = "#938ba1"')
content = content.replace('const HOVER_COLOR    = "#f97316"', 'const HOVER_COLOR    = "#6f1d1b"')
content = content.replace('const SELECTED_COLOR = "#ea580c"', 'const SELECTED_COLOR = "#f06543"')

# Replace pin HTML color (two instances)
content = content.replace('background:#f97316;', 'background:#f06543;')

# Replace CSS .pin-label border/arrow
content = content.replace('border: 2px solid #f97316 !important;', 'border: 2px solid #f06543 !important;')
content = content.replace('border-bottom-color: #f97316 !important;', 'border-bottom-color: #f06543 !important;')

# Replace leaflet zoom hover
content = content.replace('background: #f97316 !important;', 'background: #f06543 !important;')

# Replace Legend
legend_old = """          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-sm bg-slate-400 inline-block" />
            <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Unselected</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-sm bg-orange-500 inline-block" />
            <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Hover</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-sm bg-orange-600 inline-block" />
            <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Selected</span>
          </div>"""

legend_new = """          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-sm bg-[#938ba1] inline-block" />
            <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Unselected</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-sm bg-[#6f1d1b] inline-block" />
            <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Hover</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-sm bg-[#f06543] inline-block" />
            <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Selected</span>
          </div>"""
content = content.replace(legend_old, legend_new)

# Replace Quick-Select Pills
pills_old = """                  isSel
                    ? "bg-orange-600 text-white border-orange-600 shadow-sm shadow-orange-200 dark:shadow-orange-900/30"
                    : "bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-orange-500 hover:text-white hover:border-orange-500\""""

pills_new = """                  isSel
                    ? "bg-[#f06543] text-white border-[#f06543] shadow-sm shadow-orange-200 dark:shadow-orange-900/30"
                    : "bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-[#6f1d1b] hover:text-white hover:border-[#6f1d1b]\""""
content = content.replace(pills_old, pills_new)

with open('src/components/NepalDeliveryMap.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Map theme updated successfully.")
