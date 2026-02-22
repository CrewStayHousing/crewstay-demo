import { useState, useEffect, useRef } from "react";

const COLORS = {
  navy: "#1B2A4A", navyDark: "#111D33", navyLight: "#243357",
  orange: "#E8883A", orangeLight: "#F5A05A", orangeDark: "#C96E20",
  white: "#FFFFFF", offWhite: "#F4F6F9", gray: "#8C96A8",
  grayLight: "#E2E8F0", grayBorder: "#D0D8E4",
  green: "#2ECC71", red: "#E74C3C", yellow: "#F39C12",
};

const listings = [
  { id: 1, address: "1847 Habersham St", city: "Savannah", state: "GA", zip: "31401", lat: 32.0602, lng: -81.0888, beds: 6, baths: 3, sqft: 2400, lease: 5500, perBed: 917, status: "Available", parking: 4, parkingType: "Driveway + Street", amenities: ["Washer/Dryer", "High-Speed WiFi", "Covered Parking", "Outdoor Grill", "Blackout Curtains", "Tool Storage", "Keypad Entry"], crewFeatures: { truckParking: true, washerDryer: true, wifi: true, blackoutCurtains: true, toolStorage: true, outdoorSpace: true, nightShiftFriendly: true }, distanceToSite: "4.2 mi to SVN-SOL-001", description: "Spacious 6-bed SFR in historic Savannah. Fully furnished, utilities capped at $400/mo. 4 full truck spaces in private driveway. Ideal for foreman + crew.", available: "Now" },
  { id: 2, address: "334 Waters Ave", city: "Savannah", state: "GA", zip: "31404", lat: 32.0481, lng: -81.0761, beds: 5, baths: 2, sqft: 1950, lease: 4800, perBed: 960, status: "Available", parking: 3, parkingType: "Private Lot", amenities: ["Washer/Dryer", "WiFi", "Private Lot Parking", "Tool Storage", "Patio", "Extra Fridge"], crewFeatures: { truckParking: true, washerDryer: true, wifi: true, blackoutCurtains: false, toolStorage: true, outdoorSpace: true, nightShiftFriendly: false }, distanceToSite: "6.1 mi to SVN-SOL-001", description: "5-bed crew house with private lot for 3 trucks. Fully furnished, extra refrigerator for large crews. Quiet street, low HOA risk neighborhood.", available: "Now" },
  { id: 3, address: "2210 Abercorn St", city: "Savannah", state: "GA", zip: "31401", lat: 32.0534, lng: -81.0812, beds: 4, baths: 2, sqft: 1650, lease: 3800, perBed: 950, status: "Available", parking: 2, parkingType: "Garage + Driveway", amenities: ["Washer/Dryer", "WiFi", "Garage", "Patio", "Blackout Curtains", "Keypad Entry"], crewFeatures: { truckParking: true, washerDryer: true, wifi: true, blackoutCurtains: true, toolStorage: false, outdoorSpace: true, nightShiftFriendly: true }, distanceToSite: "3.8 mi to SVN-SOL-001", description: "4-bed home with attached garage. Great for a small crew or supervisor + 3 techs. Blackout curtains throughout — night shift friendly.", available: "Mar 1" },
  { id: 4, address: "512 E 52nd St", city: "Savannah", state: "GA", zip: "31405", lat: 32.0398, lng: -81.0923, beds: 8, baths: 3, sqft: 3100, lease: 6800, perBed: 850, status: "Available", parking: 5, parkingType: "Large Private Lot", amenities: ["Washer/Dryer x2", "High-Speed WiFi", "Large Lot", "Outdoor Grill", "Blackout Curtains", "Tool Storage", "Extra Fridge x2", "Covered Carport"], crewFeatures: { truckParking: true, washerDryer: true, wifi: true, blackoutCurtains: true, toolStorage: true, outdoorSpace: true, nightShiftFriendly: true }, distanceToSite: "7.3 mi to BRN-EVI-002", description: "Best value per bed in the portfolio. 8-bed crew house with large private lot for 5 trucks, dual washer/dryer, covered carport. Built for full crew deployment.", available: "Now" },
  { id: 5, address: "78 Barnard St", city: "Savannah", state: "GA", zip: "31401", lat: 32.0762, lng: -81.0958, beds: 3, baths: 2, sqft: 1300, lease: 3200, perBed: 1067, status: "Available", parking: 2, parkingType: "Street + Driveway", amenities: ["Washer/Dryer", "WiFi", "Patio", "Keypad Entry"], crewFeatures: { truckParking: false, washerDryer: true, wifi: true, blackoutCurtains: false, toolStorage: false, outdoorSpace: true, nightShiftFriendly: false }, distanceToSite: "2.1 mi to SVN-SOL-001", description: "3-bed home ideal for superintendent + 2 leads. Closest property to SVN-SOL-001. Limited truck parking — best for personal vehicles.", available: "Now" },
  { id: 6, address: "1104 Bull St", city: "Savannah", state: "GA", zip: "31401", lat: 32.0681, lng: -81.0912, beds: 5, baths: 3, sqft: 2100, lease: 5100, perBed: 1020, status: "Reserved", parking: 3, parkingType: "Private Rear Lot", amenities: ["Washer/Dryer", "High-Speed WiFi", "Rear Lot", "Blackout Curtains", "Tool Storage", "Outdoor Grill", "Generator Hookup"], crewFeatures: { truckParking: true, washerDryer: true, wifi: true, blackoutCurtains: true, toolStorage: true, outdoorSpace: true, nightShiftFriendly: true }, distanceToSite: "5.5 mi to SVN-SOL-001", description: "Premium crew house with generator hookup — critical for storm season work. Rear private lot fits 3 full-size trucks. Reserved for BRN-EVI-002 starting Feb 28.", available: "Feb 28" },
];

const mockData = {
  projects: [
    { id: 1, name: "Savannah Solar Grid Phase 1", location: "Savannah, GA", start: "Jan 15, 2026", end: "Apr 30, 2026", bedsAllocated: 18, bedsOccupied: 15, jobCode: "SVN-SOL-001", status: "Active", hotelBaseline: 115, crewStayRate: 42 },
    { id: 2, name: "Brunswick EV Infrastructure", location: "Brunswick, GA", start: "Feb 1, 2026", end: "May 15, 2026", bedsAllocated: 12, bedsOccupied: 12, jobCode: "BRN-EVI-002", status: "Active", hotelBaseline: 115, crewStayRate: 38 },
    { id: 3, name: "Hilton Head Substation Upgrade", location: "Hilton Head, SC", start: "Mar 1, 2026", end: "Jun 30, 2026", bedsAllocated: 8, bedsOccupied: 4, jobCode: "HHI-SUB-003", status: "Pending", hotelBaseline: 135, crewStayRate: 48 },
  ],
  crew: [
    { id: 1, name: "Derek Simmons", role: "Foreman", project: "SVN-SOL-001", property: "1847 Habersham St", bed: "Rm 1 - Bed A", checkin: "Jan 15", checkout: "Apr 30", status: "Active" },
    { id: 2, name: "Marcus Webb", role: "Electrician", project: "SVN-SOL-001", property: "1847 Habersham St", bed: "Rm 2 - Bed A", checkin: "Jan 15", checkout: "Mar 15", status: "Active" },
    { id: 3, name: "Tony Reyes", role: "Lineman", project: "SVN-SOL-001", property: "1847 Habersham St", bed: "Rm 2 - Bed B", checkin: "Jan 20", checkout: "Apr 30", status: "Active" },
    { id: 4, name: "J. Kowalski", role: "Tech", project: "SVN-SOL-001", property: "334 Waters Ave", bed: "Rm 1 - Bed A", checkin: "Feb 1", checkout: "Apr 1", status: "Active" },
    { id: 5, name: "Ray Odom", role: "Electrician", project: "BRN-EVI-002", property: "TBD", bed: "Unassigned", checkin: "Feb 10", checkout: "May 15", status: "Unassigned" },
  ],
  tickets: [
    { id: 1, property: "1847 Habersham St", issue: "Hot water heater intermittent", severity: "Medium", status: "In Progress", opened: "Feb 17", assigned: "H&C Plumbing" },
    { id: 2, property: "334 Waters Ave", issue: "AC unit making noise", severity: "Low", status: "Scheduled", opened: "Feb 19", assigned: "Cool Air HVAC" },
    { id: 3, property: "1847 Habersham St", issue: "Parking gate broken", severity: "High", status: "Open", opened: "Feb 20", assigned: "Unassigned" },
  ],
};

const FEATURE_ICONS = {
  truckParking: { icon: "🚛", label: "Truck Parking" },
  washerDryer: { icon: "🧺", label: "Washer/Dryer" },
  wifi: { icon: "📶", label: "High-Speed WiFi" },
  blackoutCurtains: { icon: "🌙", label: "Night Shift Ready" },
  toolStorage: { icon: "🔧", label: "Tool Storage" },
  outdoorSpace: { icon: "🌿", label: "Outdoor Space" },
  nightShiftFriendly: { icon: "😴", label: "Night Shift OK" },
};

// ─── SHARED COMPONENTS ───────────────────────────────────

const Badge = ({ color, children }) => {
  const colors = { green: { bg: "#D4EDDA", text: "#155724" }, red: { bg: "#F8D7DA", text: "#721C24" }, yellow: { bg: "#FFF3CD", text: "#856404" }, blue: { bg: "#D1ECF1", text: "#0C5460" }, gray: { bg: "#E2E8F0", text: "#4A5568" }, orange: { bg: "#FDE8D4", text: "#7D3D0A" } };
  const c = colors[color] || colors.gray;
  return <span style={{ background: c.bg, color: c.text, padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase" }}>{children}</span>;
};

const StatCard = ({ label, value, sub, accent }) => (
  <div style={{ background: COLORS.white, borderRadius: 12, padding: "20px 24px", border: `1px solid ${COLORS.grayBorder}`, flex: 1, minWidth: 140, borderTop: `3px solid ${accent || COLORS.orange}`, boxShadow: "0 2px 8px rgba(27,42,74,0.06)" }}>
    <div style={{ color: COLORS.gray, fontSize: 11, fontWeight: 700, letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
    <div style={{ color: COLORS.navy, fontSize: 28, fontWeight: 800, lineHeight: 1 }}>{value}</div>
    {sub && <div style={{ color: COLORS.gray, fontSize: 12, marginTop: 4 }}>{sub}</div>}
  </div>
);

const SavingsBar = ({ hotel, crewstay }) => {
  const savings = Math.round(((hotel - crewstay) / hotel) * 100);
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: COLORS.gray, marginBottom: 4 }}>
        <span>CrewStay ${crewstay}/night</span>
        <span style={{ color: COLORS.green, fontWeight: 700 }}>↓ {savings}% vs hotel</span>
      </div>
      <div style={{ background: COLORS.grayLight, borderRadius: 4, height: 6, overflow: "hidden" }}>
        <div style={{ width: `${savings}%`, background: `linear-gradient(90deg, ${COLORS.orange}, ${COLORS.green})`, height: "100%", borderRadius: 4 }} />
      </div>
      <div style={{ fontSize: 11, color: COLORS.gray, marginTop: 3 }}>Hotel avg ${hotel}/night</div>
    </div>
  );
};

// ─── MAP COMPONENT ────────────────────────────────────────

function ListingsMap({ listingData, selected, onSelect }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;

    const initMap = () => {
      if (!mapRef.current || mapInstanceRef.current) return;
      const L = window.L;
      const map = L.map(mapRef.current, { zoomControl: true, scrollWheelZoom: false }).setView([32.055, -81.088], 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "© OpenStreetMap", maxZoom: 19 }).addTo(map);
      mapInstanceRef.current = map;

      listingData.forEach(l => {
        const isReserved = l.status === "Reserved";
        const html = `<div style="background:${isReserved ? "#888" : COLORS.navy};color:#fff;border-radius:8px;padding:6px 10px;font-size:12px;font-weight:800;white-space:nowrap;border:2px solid ${isReserved ? "#aaa" : COLORS.orange};box-shadow:0 3px 10px rgba(0,0,0,0.25);cursor:pointer;font-family:'Segoe UI',sans-serif;">🛏 ${l.beds} beds · $${l.perBed}/bed</div>`;
        const icon = L.divIcon({ html, className: "", iconAnchor: [60, 18] });
        const marker = L.marker([l.lat, l.lng], { icon }).addTo(map);
        marker.on("click", () => onSelect(l));
        marker.bindPopup(`<div style="font-family:'Segoe UI',sans-serif;min-width:190px"><div style="font-weight:800;color:${COLORS.navy};font-size:13px;margin-bottom:3px">${l.address}</div><div style="color:#666;font-size:11px;margin-bottom:6px">${l.city}, ${l.state}</div><div style="font-size:12px;margin-bottom:4px">🛏 ${l.beds} beds &nbsp; 🚿 ${l.baths} baths &nbsp; 🚛 ${l.parking} trucks</div><div style="font-size:13px;font-weight:800;color:${COLORS.orange}">$${l.lease.toLocaleString()}/mo total</div><div style="font-size:11px;color:#888;margin-top:3px">${l.distanceToSite}</div><div style="margin-top:6px;font-size:11px;color:${l.status === "Available" ? "#155724" : "#856404"};font-weight:700">${l.status} · ${l.available}</div></div>`);
        markersRef.current.push({ id: l.id, marker });
      });
    };

    if (window.L) { initMap(); return; }

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
    script.onload = initMap;
    document.head.appendChild(script);

    return () => { if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null; } };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current || !selected) return;
    const found = markersRef.current.find(m => m.id === selected.id);
    if (found) { mapInstanceRef.current.setView([selected.lat, selected.lng], 15, { animate: true }); found.marker.openPopup(); }
  }, [selected]);

  return <div ref={mapRef} style={{ width: "100%", height: "100%" }} />;
}

// ─── LISTINGS PORTAL ─────────────────────────────────────

function ListingsPortal() {
  const [filters, setFilters] = useState({ minBeds: 0, truckParking: false, washerDryer: false, blackoutCurtains: false, toolStorage: false, showReserved: true });
  const [selected, setSelected] = useState(listings[0]);
  const [view, setView] = useState("split");
  const [requestSent, setRequestSent] = useState(null);

  const filtered = listings.filter(l => {
    if (l.beds < filters.minBeds) return false;
    if (filters.truckParking && !l.crewFeatures.truckParking) return false;
    if (filters.washerDryer && !l.crewFeatures.washerDryer) return false;
    if (filters.blackoutCurtains && !l.crewFeatures.blackoutCurtains) return false;
    if (filters.toolStorage && !l.crewFeatures.toolStorage) return false;
    if (!filters.showReserved && l.status === "Reserved") return false;
    return true;
  });

  const toggle = k => setFilters(f => ({ ...f, [k]: !f[k] }));

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 56px)", background: COLORS.offWhite }}>
      {/* Filter Bar */}
      <div style={{ background: COLORS.white, borderBottom: `1px solid ${COLORS.grayBorder}`, padding: "10px 20px", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <div style={{ fontWeight: 800, color: COLORS.navy, fontSize: 13, marginRight: 4 }}>🔍 Filter</div>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ fontSize: 11, color: COLORS.gray, fontWeight: 700 }}>Min Beds:</span>
          {[0, 3, 4, 5, 6, 8].map(n => (
            <button key={n} onClick={() => setFilters(f => ({ ...f, minBeds: n }))} style={{ padding: "3px 9px", borderRadius: 6, border: `1px solid ${filters.minBeds === n ? COLORS.orange : COLORS.grayBorder}`, background: filters.minBeds === n ? COLORS.orange : COLORS.white, color: filters.minBeds === n ? COLORS.white : COLORS.navy, fontWeight: 700, fontSize: 11, cursor: "pointer" }}>{n === 0 ? "Any" : n + "+"}</button>
          ))}
        </div>
        <div style={{ width: 1, height: 20, background: COLORS.grayBorder }} />
        {[{ key: "truckParking", label: "🚛 Trucks" }, { key: "washerDryer", label: "🧺 W/D" }, { key: "blackoutCurtains", label: "🌙 Night Shift" }, { key: "toolStorage", label: "🔧 Tool Storage" }].map(f => (
          <button key={f.key} onClick={() => toggle(f.key)} style={{ padding: "4px 11px", borderRadius: 20, border: `1px solid ${filters[f.key] ? COLORS.navy : COLORS.grayBorder}`, background: filters[f.key] ? COLORS.navy : COLORS.white, color: filters[f.key] ? COLORS.white : COLORS.gray, fontWeight: 700, fontSize: 11, cursor: "pointer", transition: "all 0.15s" }}>{f.label}</button>
        ))}
        <button onClick={() => toggle("showReserved")} style={{ padding: "4px 11px", borderRadius: 20, border: `1px solid ${!filters.showReserved ? COLORS.navy : COLORS.grayBorder}`, background: !filters.showReserved ? COLORS.navy : COLORS.white, color: !filters.showReserved ? COLORS.white : COLORS.gray, fontWeight: 700, fontSize: 11, cursor: "pointer" }}>
          {filters.showReserved ? "Hide Reserved" : "Show Reserved"}
        </button>
        <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
          {[["split", "⬛ Split"], ["list", "☰ List"], ["map", "🗺 Map Only"]].map(([v, label]) => (
            <button key={v} onClick={() => setView(v)} style={{ padding: "4px 12px", borderRadius: 8, border: `1px solid ${view === v ? COLORS.orange : COLORS.grayBorder}`, background: view === v ? COLORS.orange : COLORS.white, color: view === v ? COLORS.white : COLORS.gray, fontWeight: 700, fontSize: 11, cursor: "pointer" }}>{label}</button>
          ))}
        </div>
        <div style={{ fontSize: 11, color: COLORS.gray, fontWeight: 700 }}>{filtered.length} properties</div>
      </div>

      {/* Main Body */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Card List */}
        {(view === "split" || view === "list") && (
          <div style={{ width: view === "list" ? "100%" : 360, flexShrink: 0, overflowY: "auto", padding: "14px", display: "flex", flexDirection: "column", gap: 10 }}>
            {filtered.length === 0 && (
              <div style={{ textAlign: "center", padding: "40px 20px", color: COLORS.gray }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>🔍</div>
                <div style={{ fontWeight: 700 }}>No properties match filters</div>
              </div>
            )}
            {filtered.map(l => (
              <div key={l.id} onClick={() => setSelected(l)} style={{ background: COLORS.white, borderRadius: 12, padding: "14px 16px", border: `2px solid ${selected?.id === l.id ? COLORS.orange : COLORS.grayBorder}`, cursor: "pointer", transition: "all 0.15s", boxShadow: selected?.id === l.id ? "0 4px 16px rgba(232,136,58,0.15)" : "0 1px 4px rgba(0,0,0,0.04)", opacity: l.status === "Reserved" ? 0.72 : 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                  <div>
                    <div style={{ fontWeight: 800, color: COLORS.navy, fontSize: 14 }}>{l.address}</div>
                    <div style={{ color: COLORS.gray, fontSize: 11 }}>{l.city}, {l.state} {l.zip}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 800, color: COLORS.orange, fontSize: 15 }}>${l.perBed}<span style={{ fontSize: 10, color: COLORS.gray, fontWeight: 400 }}>/bed/mo</span></div>
                    <Badge color={l.status === "Available" ? "green" : "yellow"}>{l.status}</Badge>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 12, fontSize: 12, color: COLORS.navy, marginBottom: 8, flexWrap: "wrap" }}>
                  <span>🛏 {l.beds} beds</span><span>🚿 {l.baths} baths</span><span>🚛 {l.parking} trucks</span><span>📐 {l.sqft.toLocaleString()} sqft</span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 8 }}>
                  {Object.entries(l.crewFeatures).filter(([, v]) => v).slice(0, 4).map(([k]) => (
                    <span key={k} style={{ background: "#EEF4FF", color: COLORS.navy, padding: "2px 8px", borderRadius: 10, fontSize: 10, fontWeight: 600 }}>{FEATURE_ICONS[k]?.icon} {FEATURE_ICONS[k]?.label}</span>
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
                  <span style={{ color: COLORS.gray }}>📍 {l.distanceToSite}</span>
                  <span style={{ color: COLORS.green, fontWeight: 700 }}>Available: {l.available}</span>
                </div>
                <div style={{ marginTop: 8, padding: "6px 10px", background: COLORS.offWhite, borderRadius: 6, display: "flex", justifyContent: "space-between", fontSize: 11 }}>
                  <span style={{ color: COLORS.gray }}>Total lease (utilities incl.)</span>
                  <span style={{ fontWeight: 800, color: COLORS.navy }}>${l.lease.toLocaleString()}/mo</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Map Panel */}
        {(view === "split" || view === "map") && (
          <div style={{ flex: 1, padding: view === "map" ? 14 : "14px 14px 14px 0" }}>
            <div style={{ height: "100%", borderRadius: 12, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.1)" }}>
              <ListingsMap listingData={filtered} selected={selected} onSelect={setSelected} />
            </div>
          </div>
        )}
      </div>

      {/* Detail Drawer */}
      {selected && (
        <div style={{ background: COLORS.white, borderTop: `2px solid ${COLORS.orange}`, padding: "16px 24px", boxShadow: "0 -4px 20px rgba(0,0,0,0.10)" }}>
          <div style={{ display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 240 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <div>
                  <div style={{ fontWeight: 800, color: COLORS.navy, fontSize: 15 }}>{selected.address}</div>
                  <div style={{ color: COLORS.gray, fontSize: 12 }}>{selected.city}, {selected.state} · {selected.sqft?.toLocaleString()} sqft · {selected.parkingType}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: COLORS.orange }}>${selected.lease?.toLocaleString()}<span style={{ fontSize: 12, color: COLORS.gray, fontWeight: 400 }}>/mo total</span></div>
                  <div style={{ fontSize: 12, color: COLORS.gray }}>${selected.perBed}/bed · {selected.beds} beds</div>
                </div>
              </div>
              <div style={{ fontSize: 12, color: COLORS.navy, lineHeight: 1.6, marginBottom: 8 }}>{selected.description}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {selected.amenities?.map(a => <span key={a} style={{ background: "#EEF4FF", color: COLORS.navy, padding: "2px 9px", borderRadius: 10, fontSize: 11, fontWeight: 600 }}>✓ {a}</span>)}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 170 }}>
              <button onClick={() => setRequestSent(selected.id)} style={{ background: requestSent === selected.id ? COLORS.green : COLORS.navy, color: COLORS.white, border: "none", borderRadius: 10, padding: "11px 18px", fontWeight: 800, fontSize: 13, cursor: "pointer", transition: "all 0.2s" }}>
                {requestSent === selected.id ? "✓ Request Sent!" : "Request This Property"}
              </button>
              <button onClick={() => setSelected(null)} style={{ background: "none", border: `1px solid ${COLORS.grayBorder}`, borderRadius: 10, padding: "9px 18px", fontWeight: 700, fontSize: 12, cursor: "pointer", color: COLORS.gray }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── PM PORTAL ───────────────────────────────────────────

function PMPortal() {
  const [activeProject, setActiveProject] = useState(mockData.projects[0]);
  const [showSwap, setShowSwap] = useState(false);
  const [swapCrew, setSwapCrew] = useState(null);
  const [swapped, setSwapped] = useState(false);

  const totalBeds = mockData.projects.reduce((a, p) => a + p.bedsAllocated, 0);
  const totalOccupied = mockData.projects.reduce((a, p) => a + p.bedsOccupied, 0);
  const totalNights = activeProject.bedsOccupied * 90;
  const hotelCost = totalNights * activeProject.hotelBaseline;
  const crewCost = totalNights * activeProject.crewStayRate;
  const savings = hotelCost - crewCost;

  return (
    <div style={{ padding: "28px 32px", background: COLORS.offWhite, minHeight: "100vh" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, color: COLORS.navy }}>Project Manager Dashboard</div>
          <div style={{ color: COLORS.gray, fontSize: 13, marginTop: 2 }}>Savannah Region — Q1 2026</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {[{ type: "danger", msg: "1847 Habersham — parking gate open ticket" }, { type: "warning", msg: "334 Waters Ave — cleaning overdue 2 days" }].map((a, i) => (
            <div key={i} style={{ background: a.type === "danger" ? "#FFF0F0" : "#FFFBF0", border: `1px solid ${a.type === "danger" ? "#FFCDD2" : "#FFE082"}`, borderRadius: 8, padding: "8px 12px", fontSize: 12, color: COLORS.navy, maxWidth: 190 }}>{a.type === "danger" ? "🔴" : "⚠️"} {a.msg}</div>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
        <StatCard label="Total Beds Active" value={totalBeds} sub="Across 3 projects" />
        <StatCard label="Occupancy Rate" value={`${Math.round((totalOccupied / totalBeds) * 100)}%`} sub={`${totalOccupied}/${totalBeds} beds filled`} accent={COLORS.green} />
        <StatCard label="Est. Savings vs Hotels" value={`$${(savings / 1000).toFixed(0)}K`} sub="This project cycle" accent={COLORS.orange} />
        <StatCard label="Active Projects" value={mockData.projects.filter(p => p.status === "Active").length} sub="1 pending start" accent={COLORS.navy} />
      </div>
      <div style={{ display: "flex", gap: 14, marginBottom: 20, flexWrap: "wrap" }}>
        {mockData.projects.map(p => (
          <div key={p.id} onClick={() => setActiveProject(p)} style={{ flex: 1, minWidth: 200, background: COLORS.white, borderRadius: 12, padding: "16px 18px", border: `2px solid ${activeProject.id === p.id ? COLORS.orange : COLORS.grayBorder}`, cursor: "pointer", transition: "all 0.2s" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ fontWeight: 800, color: COLORS.navy, fontSize: 13, flex: 1 }}>{p.name}</div>
              <Badge color={p.status === "Active" ? "green" : "yellow"}>{p.status}</Badge>
            </div>
            <div style={{ color: COLORS.gray, fontSize: 12, marginTop: 3 }}>📍 {p.location}</div>
            <div style={{ display: "flex", gap: 14, marginTop: 10 }}>
              <div><div style={{ fontSize: 17, fontWeight: 800, color: COLORS.navy }}>{p.bedsOccupied}/{p.bedsAllocated}</div><div style={{ fontSize: 10, color: COLORS.gray, textTransform: "uppercase" }}>Beds</div></div>
              <div><div style={{ fontSize: 17, fontWeight: 800, color: COLORS.orange }}>${p.crewStayRate}</div><div style={{ fontSize: 10, color: COLORS.gray, textTransform: "uppercase" }}>/night</div></div>
            </div>
            <SavingsBar hotel={p.hotelBaseline} crewstay={p.crewStayRate} />
          </div>
        ))}
      </div>
      <div style={{ background: COLORS.white, borderRadius: 12, border: `1px solid ${COLORS.grayBorder}`, overflow: "hidden", marginBottom: 20 }}>
        <div style={{ background: COLORS.navy, padding: "13px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ color: COLORS.white, fontWeight: 800, fontSize: 14 }}>🛏 Crew Assignment Engine — {activeProject.name}</div>
          <span style={{ color: COLORS.orange, fontSize: 12, fontWeight: 700 }}>Job Code: {activeProject.jobCode}</span>
        </div>
        <div style={{ padding: 18 }}>
          <div style={{ fontSize: 12, color: COLORS.gray, marginBottom: 12, fontStyle: "italic" }}>Bed stays with the project. Swap the occupant — not the reservation. No cancellation fees.</div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead><tr style={{ background: COLORS.offWhite }}>{["Crew Member", "Role", "Property", "Bed", "Check-In", "Check-Out", "Status", "Action"].map(h => <th key={h} style={{ padding: "9px 12px", textAlign: "left", color: COLORS.gray, fontWeight: 700, fontSize: 11, textTransform: "uppercase" }}>{h}</th>)}</tr></thead>
            <tbody>
              {mockData.crew.map((c, i) => (
                <tr key={c.id} style={{ borderTop: `1px solid ${COLORS.grayBorder}`, background: i % 2 === 0 ? COLORS.white : COLORS.offWhite }}>
                  <td style={{ padding: "9px 12px", fontWeight: 700, color: COLORS.navy }}>{c.name}</td>
                  <td style={{ padding: "9px 12px", color: COLORS.gray }}>{c.role}</td>
                  <td style={{ padding: "9px 12px", color: COLORS.navy, fontSize: 12 }}>{c.property}</td>
                  <td style={{ padding: "9px 12px", fontSize: 12 }}>{c.bed}</td>
                  <td style={{ padding: "9px 12px", color: COLORS.gray, fontSize: 12 }}>{c.checkin}</td>
                  <td style={{ padding: "9px 12px", color: COLORS.gray, fontSize: 12 }}>{c.checkout}</td>
                  <td style={{ padding: "9px 12px" }}><Badge color={c.status === "Active" ? "green" : "yellow"}>{c.status}</Badge></td>
                  <td style={{ padding: "9px 12px" }}><button onClick={() => { setSwapCrew(c); setShowSwap(true); setSwapped(false); }} style={{ background: COLORS.orange, color: COLORS.white, border: "none", borderRadius: 6, padding: "5px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Swap Bed</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div style={{ background: COLORS.navy, borderRadius: 12, padding: "22px 28px", color: COLORS.white }}>
        <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 14 }}>📊 Finance Report — {activeProject.jobCode}</div>
        <div style={{ display: "flex", gap: 28, flexWrap: "wrap", marginBottom: 14 }}>
          <div><div style={{ color: COLORS.orange, fontSize: 26, fontWeight: 800 }}>${hotelCost.toLocaleString()}</div><div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>Hotel baseline (est.)</div></div>
          <div><div style={{ color: COLORS.orangeLight, fontSize: 26, fontWeight: 800 }}>${crewCost.toLocaleString()}</div><div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>CrewStay actual</div></div>
          <div><div style={{ color: COLORS.green, fontSize: 26, fontWeight: 800 }}>+${savings.toLocaleString()}</div><div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>Direct savings</div></div>
          <div><div style={{ color: COLORS.white, fontSize: 26, fontWeight: 800 }}>{totalNights}</div><div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>Worker-nights</div></div>
        </div>
        <div style={{ padding: "10px 14px", background: "rgba(255,255,255,0.07)", borderRadius: 8, fontSize: 12, color: "rgba(255,255,255,0.7)" }}>All costs pre-mapped to {activeProject.jobCode}. Export includes bed-level detail, occupant names, dates, proration. No manual reconciliation needed.</div>
      </div>
      {showSwap && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(17,29,51,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }}>
          <div style={{ background: COLORS.white, borderRadius: 16, padding: 30, width: 400, boxShadow: "0 24px 60px rgba(0,0,0,0.3)" }}>
            {swapped ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ fontSize: 48 }}>✅</div>
                <div style={{ fontWeight: 800, color: COLORS.navy, fontSize: 18, marginTop: 12 }}>Bed Reassigned</div>
                <div style={{ color: COLORS.gray, marginTop: 8, fontSize: 13 }}>Cost stays on {activeProject.jobCode}. No cancellation fees. Finance ledger updated.</div>
              </div>
            ) : (
              <>
                <div style={{ fontWeight: 800, fontSize: 17, color: COLORS.navy, marginBottom: 6 }}>Reassign Bed</div>
                <div style={{ color: COLORS.gray, fontSize: 13, marginBottom: 18 }}>Swapping <strong>{swapCrew?.name}</strong> out of <strong>{swapCrew?.bed}</strong>.<br />Bed stays on project <strong>{activeProject.jobCode}</strong>. Billing continues uninterrupted.</div>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: COLORS.navy, display: "block", marginBottom: 5 }}>New Occupant Name</label>
                  <input defaultValue="Ryan Castellano" style={{ width: "100%", border: `1px solid ${COLORS.grayBorder}`, borderRadius: 8, padding: "9px 12px", fontSize: 14, boxSizing: "border-box" }} />
                </div>
                <div style={{ marginBottom: 18 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: COLORS.navy, display: "block", marginBottom: 5 }}>Check-In Date</label>
                  <input type="date" defaultValue="2026-02-22" style={{ width: "100%", border: `1px solid ${COLORS.grayBorder}`, borderRadius: 8, padding: "9px 12px", fontSize: 14, boxSizing: "border-box" }} />
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => setShowSwap(false)} style={{ flex: 1, padding: "10px", border: `1px solid ${COLORS.grayBorder}`, borderRadius: 8, background: "none", cursor: "pointer", fontWeight: 700, color: COLORS.gray }}>Cancel</button>
                  <button onClick={() => { setSwapped(true); setTimeout(() => setShowSwap(false), 2000); }} style={{ flex: 2, padding: "10px", border: "none", borderRadius: 8, background: COLORS.navy, color: COLORS.white, cursor: "pointer", fontWeight: 800, fontSize: 14 }}>Confirm Swap — No Fees</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── PROPERTY PORTAL ─────────────────────────────────────

function PropertyPortal() {
  const [selected, setSelected] = useState(listings[0]);
  const [ticketDone, setTicketDone] = useState(null);
  return (
    <div style={{ padding: "28px 32px", background: COLORS.offWhite, minHeight: "100vh" }}>
      <div style={{ fontSize: 22, fontWeight: 800, color: COLORS.navy, marginBottom: 4 }}>Property Manager Portal</div>
      <div style={{ color: COLORS.gray, fontSize: 13, marginBottom: 20 }}>Savannah Region — Live Property Dashboard</div>
      <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
        <StatCard label="Properties" value={listings.length} sub="Under CrewStay Master Lease" />
        <StatCard label="Total Beds" value={listings.reduce((a, p) => a + p.beds, 0)} sub="Across all units" />
        <StatCard label="Available Now" value={listings.filter(p => p.status === "Available" && p.available === "Now").length} sub="Ready to assign" accent={COLORS.green} />
        <StatCard label="Open Tickets" value={mockData.tickets.filter(t => t.status !== "Resolved").length} sub="1 high priority" accent={COLORS.red} />
      </div>
      <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
        <div style={{ width: 290, flexShrink: 0 }}>
          {listings.map(p => (
            <div key={p.id} onClick={() => setSelected(p)} style={{ background: COLORS.white, borderRadius: 12, padding: "14px 16px", marginBottom: 10, border: `2px solid ${selected?.id === p.id ? COLORS.orange : COLORS.grayBorder}`, cursor: "pointer", transition: "all 0.2s" }}>
              <div style={{ fontWeight: 800, color: COLORS.navy, fontSize: 13 }}>{p.address}</div>
              <div style={{ color: COLORS.gray, fontSize: 11 }}>{p.city}, {p.state}</div>
              <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                <Badge color={p.status === "Available" ? "green" : "yellow"}>{p.status}</Badge>
              </div>
              <div style={{ marginTop: 8, display: "flex", gap: 12, fontSize: 11, color: COLORS.gray }}>
                <span>🛏 {p.beds} beds</span><span>🚿 {p.baths} baths</span><span>🚛 {p.parking} trucks</span>
              </div>
            </div>
          ))}
        </div>
        {selected && (
          <div style={{ flex: 1 }}>
            <div style={{ background: COLORS.white, borderRadius: 12, border: `1px solid ${COLORS.grayBorder}`, overflow: "hidden", marginBottom: 14 }}>
              <div style={{ background: COLORS.navy, padding: "13px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ color: COLORS.white, fontWeight: 800, fontSize: 14 }}>{selected.address}, {selected.city}</div>
                <span style={{ color: COLORS.orange, fontWeight: 700, fontSize: 12 }}>Lease: ${selected.lease?.toLocaleString()}/mo</span>
              </div>
              <div style={{ padding: 18 }}>
                <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginBottom: 16 }}>
                  {[["Beds", selected.beds], ["Baths", selected.baths], ["Sqft", selected.sqft?.toLocaleString()], ["Truck Spaces", selected.parking], ["Available", selected.available]].map(([l, v]) => (
                    <div key={l}><div style={{ color: COLORS.gray, fontSize: 11 }}>{l}</div><div style={{ fontWeight: 800, color: COLORS.navy, fontSize: 17 }}>{v}</div></div>
                  ))}
                </div>
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontWeight: 700, color: COLORS.navy, fontSize: 13, marginBottom: 8 }}>Crew-Ready Amenities</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {selected.amenities?.map(a => <span key={a} style={{ background: "#EEF2FF", color: COLORS.navy, padding: "3px 10px", borderRadius: 16, fontSize: 11, fontWeight: 600 }}>✓ {a}</span>)}
                  </div>
                </div>
                <div style={{ background: COLORS.offWhite, borderRadius: 8, padding: "10px 14px", fontSize: 12, color: COLORS.navy }}>{selected.description}</div>
              </div>
            </div>
            <div style={{ background: COLORS.white, borderRadius: 12, border: `1px solid ${COLORS.grayBorder}`, overflow: "hidden" }}>
              <div style={{ padding: "13px 18px", borderBottom: `1px solid ${COLORS.grayBorder}`, fontWeight: 800, color: COLORS.navy }}>🔧 Maintenance Tickets</div>
              <div style={{ padding: 18 }}>
                {mockData.tickets.filter(t => t.property === selected.address).length === 0
                  ? <div style={{ color: COLORS.gray, fontSize: 13, textAlign: "center", padding: "16px 0" }}>No open tickets for this property. ✅</div>
                  : mockData.tickets.filter(t => t.property === selected.address).map(t => (
                    <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: `1px solid ${COLORS.grayBorder}` }}>
                      <Badge color={t.severity === "High" ? "red" : t.severity === "Medium" ? "yellow" : "gray"}>{t.severity}</Badge>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, color: COLORS.navy, fontSize: 13 }}>{t.issue}</div>
                        <div style={{ color: COLORS.gray, fontSize: 11 }}>Opened {t.opened} · {t.assigned}</div>
                      </div>
                      <Badge color={t.status === "In Progress" ? "blue" : t.status === "Scheduled" ? "yellow" : "red"}>{t.status}</Badge>
                      <button onClick={() => setTicketDone(t.id)} style={{ background: ticketDone === t.id ? COLORS.green : COLORS.navy, color: COLORS.white, border: "none", borderRadius: 6, padding: "5px 11px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>{ticketDone === t.id ? "✓ Done" : "Resolve"}</button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── CREW PORTAL ─────────────────────────────────────────

function CrewPortal() {
  const crew = mockData.crew[0];
  const [submitted, setSubmitted] = useState(false);
  return (
    <div style={{ padding: "28px 24px", background: COLORS.offWhite, minHeight: "100vh", maxWidth: 480, margin: "0 auto" }}>
      <div style={{ background: COLORS.navy, borderRadius: 16, padding: "22px", marginBottom: 18, color: COLORS.white }}>
        <div style={{ fontSize: 12, color: COLORS.orange, fontWeight: 700, marginBottom: 3 }}>WELCOME BACK</div>
        <div style={{ fontSize: 22, fontWeight: 800 }}>{crew.name}</div>
        <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, marginTop: 2 }}>{crew.role} · {crew.project}</div>
      </div>
      <div style={{ background: COLORS.white, borderRadius: 12, padding: "18px", border: `1px solid ${COLORS.grayBorder}`, marginBottom: 14 }}>
        <div style={{ fontWeight: 800, color: COLORS.navy, marginBottom: 12, fontSize: 14 }}>🏠 My Housing</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[["Address", crew.property], ["My Bed", crew.bed], ["Check-In", crew.checkin], ["Check-Out", crew.checkout]].map(([label, val]) => (
            <div key={label} style={{ background: COLORS.offWhite, borderRadius: 8, padding: "10px" }}>
              <div style={{ color: COLORS.gray, fontSize: 10, fontWeight: 700, textTransform: "uppercase", marginBottom: 3 }}>{label}</div>
              <div style={{ color: COLORS.navy, fontWeight: 700, fontSize: 13 }}>{val}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: COLORS.white, borderRadius: 12, padding: "18px", border: `1px solid ${COLORS.grayBorder}`, marginBottom: 14 }}>
        <div style={{ fontWeight: 800, color: COLORS.navy, marginBottom: 12, fontSize: 14 }}>📋 House Rules</div>
        {["Quiet hours 10pm–6am", "No unauthorized guests overnight", "Keep common areas clean", "Parking: designated spaces only", "Report issues immediately via this app"].map((rule, i) => (
          <div key={i} style={{ display: "flex", gap: 8, padding: "7px 0", borderBottom: i < 4 ? `1px solid ${COLORS.grayBorder}` : "none" }}>
            <span style={{ color: COLORS.orange, fontWeight: 800 }}>✓</span>
            <span style={{ fontSize: 13, color: COLORS.navy }}>{rule}</span>
          </div>
        ))}
        <button style={{ marginTop: 12, width: "100%", background: COLORS.navy, color: COLORS.white, border: "none", borderRadius: 8, padding: "10px", fontWeight: 800, cursor: "pointer", fontSize: 13 }}>I Acknowledge These Rules</button>
      </div>
      <div style={{ background: COLORS.white, borderRadius: 12, padding: "18px", border: `1px solid ${COLORS.grayBorder}` }}>
        <div style={{ fontWeight: 800, color: COLORS.navy, marginBottom: 12, fontSize: 14 }}>🔧 Report an Issue</div>
        {submitted ? (
          <div style={{ textAlign: "center", padding: "18px 0" }}>
            <div style={{ fontSize: 40 }}>✅</div>
            <div style={{ fontWeight: 800, color: COLORS.navy, marginTop: 10 }}>Ticket Submitted</div>
            <div style={{ color: COLORS.gray, fontSize: 13, marginTop: 6 }}>Your PM and property manager have been notified.</div>
          </div>
        ) : (
          <>
            <select style={{ width: "100%", border: `1px solid ${COLORS.grayBorder}`, borderRadius: 8, padding: "9px", fontSize: 13, marginBottom: 9 }}>
              <option>Select issue type...</option>
              <option>Plumbing</option><option>HVAC / AC</option><option>Appliance</option><option>Parking / Access</option><option>Safety Concern</option>
            </select>
            <textarea placeholder="Describe the issue..." rows={3} style={{ width: "100%", border: `1px solid ${COLORS.grayBorder}`, borderRadius: 8, padding: "9px", fontSize: 13, resize: "none", boxSizing: "border-box", marginBottom: 9 }} />
            <button onClick={() => setSubmitted(true)} style={{ width: "100%", background: COLORS.orange, color: COLORS.white, border: "none", borderRadius: 8, padding: "10px", fontWeight: 800, cursor: "pointer", fontSize: 13 }}>Submit Issue Report</button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── ADMIN PORTAL ─────────────────────────────────────────

function AdminPortal() {
  const totalBeds = mockData.projects.reduce((a, p) => a + p.bedsAllocated, 0);
  const totalRevenue = totalBeds * 600;
  const totalLease = listings.reduce((a, l) => a + l.lease, 0);
  return (
    <div style={{ padding: "28px 32px", background: COLORS.offWhite, minHeight: "100vh" }}>
      <div style={{ fontSize: 22, fontWeight: 800, color: COLORS.navy, marginBottom: 4 }}>Admin Control Center</div>
      <div style={{ color: COLORS.gray, fontSize: 13, marginBottom: 20 }}>CrewStay Operations — Savannah Region</div>
      <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
        <StatCard label="Total Beds Under OS" value={totalBeds} sub="All active projects" />
        <StatCard label="Platform MRR" value={`$${totalRevenue.toLocaleString()}`} sub={`${totalBeds} beds × $600`} accent={COLORS.green} />
        <StatCard label="Lease Obligations" value={`$${totalLease.toLocaleString()}/mo`} sub="Master lease total" accent={COLORS.red} />
        <StatCard label="Gross Margin" value={`$${(totalRevenue - totalLease).toLocaleString()}/mo`} sub="Before overhead" accent={COLORS.orange} />
      </div>
      <div style={{ background: COLORS.white, borderRadius: 12, border: `1px solid ${COLORS.grayBorder}`, overflow: "hidden", marginBottom: 18 }}>
        <div style={{ background: COLORS.navy, padding: "13px 18px", color: COLORS.white, fontWeight: 800 }}>🏢 EPC / PM Accounts</div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead><tr style={{ background: COLORS.offWhite }}>{["Company", "Project", "Beds", "Monthly Billing", "Status", "Contract End"].map(h => <th key={h} style={{ padding: "9px 14px", textAlign: "left", color: COLORS.gray, fontWeight: 700, fontSize: 11, textTransform: "uppercase" }}>{h}</th>)}</tr></thead>
          <tbody>
            {[{ company: "SunGrid EPC", project: "SVN-SOL-001", beds: 18, billing: 10800, status: "Active", end: "Apr 30" }, { company: "Coastal Electric", project: "BRN-EVI-002", beds: 12, billing: 7200, status: "Active", end: "May 15" }, { company: "Southeastern Grid", project: "HHI-SUB-003", beds: 8, billing: 4800, status: "Pending", end: "Jun 30" }].map((a, i) => (
              <tr key={i} style={{ borderTop: `1px solid ${COLORS.grayBorder}` }}>
                <td style={{ padding: "11px 14px", fontWeight: 800, color: COLORS.navy }}>{a.company}</td>
                <td style={{ padding: "11px 14px", color: COLORS.gray, fontFamily: "monospace" }}>{a.project}</td>
                <td style={{ padding: "11px 14px", fontWeight: 700 }}>{a.beds}</td>
                <td style={{ padding: "11px 14px", fontWeight: 700, color: COLORS.green }}>${a.billing.toLocaleString()}</td>
                <td style={{ padding: "11px 14px" }}><Badge color={a.status === "Active" ? "green" : "yellow"}>{a.status}</Badge></td>
                <td style={{ padding: "11px 14px", color: COLORS.gray }}>{a.end}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 270, background: COLORS.white, borderRadius: 12, border: `1px solid ${COLORS.grayBorder}`, overflow: "hidden" }}>
          <div style={{ padding: "13px 18px", borderBottom: `1px solid ${COLORS.grayBorder}`, fontWeight: 800, color: COLORS.navy }}>🛡 Risk & Compliance</div>
          <div style={{ padding: 18 }}>
            {[{ label: "Insurance verified", status: "green", note: `All ${listings.length} properties` }, { label: "Master leases signed", status: "green", note: `${listings.length}/${listings.length} properties` }, { label: "Crew ID verification", status: "yellow", note: "2/5 pending" }, { label: "HOA compliance", status: "green", note: "No HOA conflicts" }, { label: "Background checks", status: "gray", note: "Optional tier — off" }].map((r, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: i < 4 ? `1px solid ${COLORS.grayBorder}` : "none" }}>
                <span>{r.status === "green" ? "✅" : r.status === "yellow" ? "⚠️" : "⬜"}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: COLORS.navy, fontSize: 13 }}>{r.label}</div>
                  <div style={{ color: COLORS.gray, fontSize: 11 }}>{r.note}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 270, background: COLORS.white, borderRadius: 12, border: `1px solid ${COLORS.grayBorder}`, overflow: "hidden" }}>
          <div style={{ padding: "13px 18px", borderBottom: `1px solid ${COLORS.grayBorder}`, fontWeight: 800, color: COLORS.navy }}>💰 Pricing Engine</div>
          <div style={{ padding: 18 }}>
            {[{ market: "Savannah, GA", rate: "$600/bed", markup: "Standard", status: "green" }, { market: "Brunswick, GA", rate: "$580/bed", markup: "Pilot rate", status: "yellow" }, { market: "Hilton Head, SC", rate: "$650/bed", markup: "Premium", status: "green" }].map((m, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: i < 2 ? `1px solid ${COLORS.grayBorder}` : "none" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: COLORS.navy, fontSize: 13 }}>{m.market}</div>
                  <div style={{ color: COLORS.gray, fontSize: 11 }}>{m.markup}</div>
                </div>
                <div style={{ fontWeight: 800, color: COLORS.orange, fontSize: 14 }}>{m.rate}</div>
                <Badge color={m.status === "green" ? "green" : "yellow"}>{m.status === "green" ? "Active" : "Pilot"}</Badge>
              </div>
            ))}
            <div style={{ marginTop: 14, padding: "10px", background: COLORS.offWhite, borderRadius: 8, fontSize: 11, color: COLORS.gray }}>Volume discounts and enterprise overrides available per account.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────

const PORTALS = [
  { key: "listings", label: "Find Housing", icon: "🗺" },
  { key: "pm", label: "Project Manager", icon: "📋" },
  { key: "property", label: "Property Manager", icon: "🏠" },
  { key: "crew", label: "Crew Member", icon: "👷" },
  { key: "admin", label: "Admin", icon: "⚙️" },
];

export default function CrewStayApp() {
  const [portal, setPortal] = useState("listings");
  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", minHeight: "100vh" }}>
      <div style={{ background: COLORS.navyDark, padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56, boxShadow: "0 2px 12px rgba(0,0,0,0.25)", position: "sticky", top: 0, zIndex: 500 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <svg width="26" height="20" viewBox="0 0 28 22"><polygon points="14,2 26,12 22,12 22,20 6,20 6,12 2,12" fill="none" stroke={COLORS.orange} strokeWidth="2.5" strokeLinejoin="round" /></svg>
          <span style={{ color: COLORS.white, fontWeight: 900, fontSize: 17, letterSpacing: "-0.5px" }}>CREW<span style={{ color: COLORS.orange }}>STAY</span></span>
          <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, marginLeft: 2 }}>HOUSING</span>
        </div>
        <div style={{ display: "flex", gap: 3 }}>
          {PORTALS.map(p => (
            <button key={p.key} onClick={() => setPortal(p.key)} style={{ background: portal === p.key ? COLORS.orange : "transparent", color: portal === p.key ? COLORS.white : "rgba(255,255,255,0.6)", border: "none", borderRadius: 8, padding: "7px 13px", cursor: "pointer", fontWeight: 700, fontSize: 12, transition: "all 0.2s", display: "flex", alignItems: "center", gap: 5 }}>
              <span>{p.icon}</span>{p.label}
            </button>
          ))}
        </div>
        <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>Demo · Savannah, GA</div>
      </div>
      {portal === "listings" && <ListingsPortal />}
      {portal === "pm" && <PMPortal />}
      {portal === "property" && <PropertyPortal />}
      {portal === "crew" && <CrewPortal />}
      {portal === "admin" && <AdminPortal />}
    </div>
  );
}
