import { useEffect, useRef, useState } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { provincesData } from "../data/provincesData"
import nepalGeoJson from "../data/nepal-with-provinces.json"

// Map province numeric IDs → our internal keys
const PROVINCE_ID_MAP = {
  1: "koshi",
  2: "madhesh",
  3: "bagmati",
  4: "gandaki",
  5: "lumbini",
  6: "karnali",
  7: "sudurpashchim",
}


// Unified color scheme — orange on interact, slate default
const DEFAULT_COLOR  = "#94a3b8"  // slate-400  — resting state
const HOVER_COLOR    = "#fdba74"  // orange-300 — mouse-over (lighter)
const SELECTED_COLOR = "#ea580c"  // orange-600 — clicked / active

// Province display names — override GeoJSON defaults
const PROVINCE_NAME_MAP = {
  1: "Koshi Province",
  2: "Madhesh Province",
  3: "Bagmati",
  4: "Gandaki",
  5: "Lumbini",
  6: "Karnali",
  7: "Sudurpashchim",
}

// Province Details panel
const ProvinceDetails = ({ province }) => (
  <div className="bg-amber-50/60 dark:bg-amber-950/10 rounded-2xl border border-amber-100 dark:border-amber-900/30 p-5 shadow-sm space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
    <div className="flex items-center justify-between border-b border-amber-100/60 dark:border-amber-900/20 pb-2">
      <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
        {province.name}
      </h4>
      <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase bg-white dark:bg-slate-900 px-2 py-0.5 rounded-full border border-amber-100 dark:border-amber-900/30 shrink-0">
        {province.status.includes("Express") || province.status.includes("Same")
          ? "Express Available"
          : "Standard Active"}
      </span>
    </div>
    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
      {province.description}
    </p>
    <div className="grid grid-cols-2 gap-3 text-xs pt-0.5">
      <div>
        <span className="text-slate-400 dark:text-slate-500 block text-[9px] font-bold uppercase mb-0.5">
          Delivery Speed
        </span>
        <span className="font-bold text-slate-700 dark:text-slate-300">{province.deliveryTime}</span>
      </div>
      <div>
        <span className="text-slate-400 dark:text-slate-500 block text-[9px] font-bold uppercase mb-0.5">
          Shipping Fee
        </span>
        <span className="font-bold text-slate-700 dark:text-slate-300">Rs. {province.shippingFee}</span>
      </div>
    </div>
    <div>
      <span className="text-slate-400 dark:text-slate-500 block text-[9px] font-bold uppercase mb-0.5">
        Primary Logistics Hubs
      </span>
      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{province.hubs}</span>
    </div>
  </div>
)

const NepalDeliveryMap = ({
  selectedProvince,
  onSelectProvince,
  showDetails = true,
  compact = false,
}) => {
  const mapContainerRef = useRef(null)
  const mapRef          = useRef(null)
  const geoJsonLayerRef = useRef(null)
  const selectedProvinceRef = useRef(selectedProvince)
  const setHoverInfoRef = useRef(null)
  const [hoverInfo, setHoverInfo] = useState(null)
  setHoverInfoRef.current = setHoverInfo

  const activeProvince = provincesData[selectedProvince]

  // Keep ref in sync so Leaflet event handlers always read latest value
  useEffect(() => {
    selectedProvinceRef.current = selectedProvince
  }, [selectedProvince])

  // ── Initialize Leaflet map once ─────────────────────────────────────
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return

    // Create map — fully locked, always shows whole Nepal
    const map = L.map(mapContainerRef.current, {
      scrollWheelZoom:  false,
      touchZoom:        false,
      doubleClickZoom:  false,
      zoomControl:      false,
      dragging:         false,
      boxZoom:          false,
      keyboard:         false,
      attributionControl: false,
    })

    mapRef.current = map

    // Style function — uniform slate default, orange variants on interact
    function getStyle(feature) {
      const pid   = feature.properties.id
      const key   = PROVINCE_ID_MAP[pid]
      const isSel = selectedProvinceRef.current === key
      return {
        weight:      isSel ? 2.5 : 1.5,
        opacity:     1,
        color:       "#ffffff",   // white borders between provinces
        dashArray:   "",
        fillOpacity: isSel ? 0.92 : 0.78,
        fillColor:   isSel ? SELECTED_COLOR : DEFAULT_COLOR,
      }
    }

    // Highlight on hover — orange
    function highlightFeature(e) {
      const layer = e.target
      const pid   = layer.feature.properties.id
      const key   = PROVINCE_ID_MAP[pid]
      const name  = PROVINCE_NAME_MAP[pid] || layer.feature.properties.name || `Province ${pid}`
      const rect  = mapContainerRef.current.getBoundingClientRect()
      setHoverInfoRef.current({
        name,
        x: e.originalEvent.clientX - rect.left,
        y: e.originalEvent.clientY - rect.top,
      })

      if (selectedProvinceRef.current === key) return

      layer.setStyle({
        weight:      2.5,
        color:       "#ffffff",
        dashArray:   "",
        fillOpacity: 0.92,
        fillColor:   HOVER_COLOR,
      })
      if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront()
      }
    }

    // Reset on mouse-out
    function resetHighlight(e) {
      setHoverInfoRef.current(null)
      geoJsonLayerRef.current?.resetStyle(e.target)
    }


    // Click → select province only (no zoom — map stays fixed)
    function clickProvince(e) {
      const pid = e.target.feature.properties.id
      const key = PROVINCE_ID_MAP[pid]
      onSelectProvince(key)
    }

    // Build GeoJSON layer
    const geoLayer = L.geoJson(nepalGeoJson, {
      style: getStyle,
      onEachFeature(feature, layer) {
        const pid  = feature.properties.id
        const name = PROVINCE_NAME_MAP[pid] || feature.properties.name || `Province ${pid}`

        // Tooltip (permanent label)
        const tooltipClass = pid === 7 ? "nepal-province-label nepal-province-label-sm" : "nepal-province-label"
        layer.bindTooltip(name, {
          permanent:  true,
          direction:  "center",
          className:  tooltipClass,
        }).openTooltip()

        layer.on({
          mouseover: highlightFeature,
          mouseout:  resetHighlight,
          click:     clickProvince,
        })
      },
    }).addTo(map)

    geoJsonLayerRef.current = geoLayer

    // Fit Nepal bounds
    map.fitBounds(geoLayer.getBounds())

    return () => {
      map.remove()
      mapRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Re-style all layers whenever selectedProvince changes ───────────
  useEffect(() => {
    const geoLayer = geoJsonLayerRef.current
    if (!geoLayer) return

    geoLayer.eachLayer((layer) => {
      const pid = layer.feature.properties.id
      const key = PROVINCE_ID_MAP[pid]
      const isSel = selectedProvince === key
      layer.setStyle({
        weight:      isSel ? 2.5 : 1.5,
        color:       "#ffffff",
        dashArray:   "",
        fillOpacity: isSel ? 0.92 : 0.78,
        fillColor:   isSel ? SELECTED_COLOR : DEFAULT_COLOR,
      })
    })
  }, [selectedProvince])

  const mapBlock = (
    <div className={`w-full ${compact ? "" : "max-w-[800px]"}`}>
      {/* Header */}
      <div className="text-center mb-3">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 block">
          🗺 Nepal Delivery Coverage
        </span>
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          Click a province to view delivery details
        </span>
      </div>

      {/* Map Container */}
      <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-lg relative">
        {/* Leaflet overrides — labels always white, clean background */}
        <style>{`
          .nepal-province-label {
            background: transparent !important;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            font-size: 11px !important;
            font-weight: 800 !important;
            font-family: Inter, system-ui, sans-serif !important;
            color: #ffffff !important;
            text-shadow:
              0 0 4px rgba(0,0,0,0.8),
              0 1px 6px rgba(0,0,0,0.6) !important;
            letter-spacing: 0.02em !important;
            white-space: nowrap !important;
            pointer-events: none !important;
            text-align: center !important;
            transform: translate(-50%, -50%) !important;
          }
          .nepal-province-label::before,
          .nepal-province-label::after {
            display: none !important;
          }
          .nepal-province-label-sm {
            font-size: 9px !important;
          }
          .leaflet-container {
            background: #f1f5f9 !important;
            font-family: Inter, system-ui, sans-serif !important;
          }
          .leaflet-control-zoom {
            border: none !important;
            box-shadow: 0 1px 6px rgba(0,0,0,0.15) !important;
          }
          .leaflet-control-zoom a {
            background: #fff !important;
            color: #374151 !important;
            font-weight: 700 !important;
            border-color: #e5e7eb !important;
          }
          .leaflet-control-zoom a:hover {
            background: #f97316 !important;
            color: #fff !important;
          }
        `}</style>
        <div
          ref={mapContainerRef}
          id="nepal-leaflet-map"
          style={{ width: "100%", height: compact ? 640 : 800 }}
        />
        {hoverInfo && (
          <div
            className="absolute z-[9999] px-3 py-1.5 bg-slate-800 text-white text-xs font-bold rounded-lg shadow-lg pointer-events-none whitespace-nowrap"
            style={{ left: hoverInfo.x + 12, top: hoverInfo.y - 30 }}
          >
            {hoverInfo.name}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        {/* Color key */}
        <div className="flex items-center justify-center gap-6 mb-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-sm bg-slate-400 inline-block" />
            <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Unselected</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-sm bg-orange-300 inline-block" />
            <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Hover</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-sm bg-orange-600 inline-block" />
            <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Selected</span>
          </div>
        </div>
        {/* Province quick-select pills */}
        <div className="flex flex-wrap gap-1.5 justify-center">
          {[
            { id: "sudurpashchim", name: "Sudurpashchim" },
            { id: "karnali", name: "Karnali" },
            { id: "lumbini", name: "Lumbini" },
            { id: "gandaki", name: "Gandaki" },
            { id: "bagmati", name: "Bagmati" },
            { id: "madhesh", name: "Madhesh Province" },
            { id: "koshi", name: "Koshi Province" },
          ].map(({ id, name }) => {
            const key   = id

            const isSel = selectedProvince === key
            return (
              <button
                key={id}
                onClick={() => onSelectProvince(key)}
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border transition-all duration-150 cursor-pointer ${
                  isSel
                    ? "bg-orange-600 text-white border-orange-600 shadow-sm shadow-orange-200 dark:shadow-orange-900/30"
                    : "bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-orange-500 hover:text-white hover:border-orange-500"
                }`}
              >
                {name}
              </button>
            )
          })}
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
      {/* Left info panel */}
      <div className="lg:col-span-5 space-y-6">
        <span className="text-xs font-extrabold text-amber-600 uppercase tracking-widest block">
          Delivery Network
        </span>
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
          Express Shipping Throughout Nepal
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
          Click any province on the interactive map to check delivery speed, shipping costs, and
          logistics hubs in your region. We deliver across all 7 provinces with Cash on Delivery.
        </p>

        {/* Feature badges */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">24h Express</span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500">Available in Kathmandu Valley</span>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Cash on Delivery</span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500">100% secure payment on delivery</span>
          </div>
        </div>

        {/* Province delivery info */}
        {showDetails && activeProvince && <ProvinceDetails province={activeProvince} />}
      </div>

      {/* Right panel — Leaflet map */}
      <div className="lg:col-span-7">{mapBlock}</div>
    </div>
  )
}

export default NepalDeliveryMap
