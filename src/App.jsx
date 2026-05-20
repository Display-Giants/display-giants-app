import { useState, useEffect, useRef, useCallback } from "react";

// ─── Theme ────────────────────────────────────────────────────────────────────
const C = {
  bg: "#0b0d0f", surface: "#13161a", surface2: "#1a1e24",
  border: "#222830", borderBright: "#2e3540",
  accent: "#f59e0b", accentDim: "#f59e0b1a", accentGlow: "#f59e0b33",
  green: "#22c55e", greenDim: "#22c55e1a",
  red: "#ef4444", redDim: "#ef44441a",
  blue: "#3b82f6", blueDim: "#3b82f61a",
  purple: "#a855f7", purpleDim: "#a855f71a",
  text: "#e2e8f0", textDim: "#8896a8", muted: "#3d4a5c",
};

// ─── Real Data from Display_Giants_Inventory ──────────────────────────────────
const INITIAL_PRODUCTS = [
  { id:"P001", name:"3x3M Gazebo (Frame Only)",   cat:"Tents",   qty:44,  price:115000, reorder:5,  location:"Warehouse A" },
  { id:"P002", name:"3x3M Gazebo (Black Fabric)",  cat:"Tents",   qty:43,  price:140000, reorder:10, location:"Warehouse B" },
  { id:"P003", name:"3x3M Gazebo (Black Frame)",   cat:"Tents",   qty:15,  price:115000, reorder:5,  location:"Warehouse A" },
  { id:"P004", name:"3x3M Gazebo (Blue Fabric)",   cat:"Tents",   qty:20,  price:140000, reorder:5,  location:"Warehouse B" },
  { id:"P005", name:"3x3M Gazebo (Green Fabric)",  cat:"Tents",   qty:19,  price:140000, reorder:5,  location:"Warehouse B" },
  { id:"P006", name:"3x3M Gazebo (Red Fabric)",    cat:"Tents",   qty:58,  price:140000, reorder:5,  location:"Warehouse B" },
  { id:"P007", name:"3x3M Gazebo (White Fabric)",  cat:"Tents",   qty:24,  price:140000, reorder:5,  location:"Warehouse B" },
  { id:"P008", name:"2x2M Gazebo (With Fabric)",   cat:"Tents",   qty:8,   price:140000, reorder:5,  location:"Warehouse A" },
  { id:"P009", name:"Feather Banner",              cat:"Banner",  qty:0,   price:0,      reorder:5,  location:"Warehouse A" },
  { id:"P010", name:"Giant Flagpole",              cat:"Banner",  qty:188, price:127000, reorder:10, location:"Warehouse A" },
  { id:"P011", name:"X Banner",                   cat:"Banner",  qty:190, price:15000,  reorder:20, location:"Warehouse A" },
  { id:"P012", name:"X Banner Backpack",           cat:"Banner",  qty:30,  price:31000,  reorder:10, location:"Warehouse A" },
  { id:"P013", name:"Block Flag",                  cat:"Banner",  qty:38,  price:40000,  reorder:10, location:"Warehouse B" },
  { id:"P014", name:"Magazine Rack",               cat:"Stand",   qty:12,  price:75000,  reorder:5,  location:"Warehouse A" },
  { id:"P015", name:"Executive Flagpole (Silver)", cat:"Pole",    qty:17,  price:35000,  reorder:5,  location:"Warehouse A" },
  { id:"P016", name:"Executive Flagpole (Gold)",   cat:"Pole",    qty:8,   price:35000,  reorder:5,  location:"Warehouse A" },
  { id:"P017", name:"3x3M Popup Stand",            cat:"Stand",   qty:30,  price:170000, reorder:5,  location:"Warehouse B" },
  { id:"P018", name:"Promotional Table",           cat:"Table",   qty:137, price:63000,  reorder:10, location:"Warehouse A" },
  { id:"P019", name:"A2 Snap Frame",               cat:"Frame",   qty:200, price:18000,  reorder:20, location:"Warehouse A" },
  { id:"P020", name:"A3 Snap Frame",               cat:"Frame",   qty:100, price:12500,  reorder:20, location:"Warehouse A" },
  { id:"P021", name:"A4 Snap Frame",               cat:"Frame",   qty:30,  price:9000,   reorder:10, location:"Warehouse A" },
  { id:"P022", name:"A4 Acrylic Table Top",        cat:"Display", qty:167, price:7500,   reorder:20, location:"Warehouse B" },
  { id:"P023", name:"A5 Acrylic Table Top",        cat:"Display", qty:117, price:5500,   reorder:20, location:"Warehouse B" },
  { id:"P024", name:"A6 Acrylic Table Top",        cat:"Display", qty:110, price:4500,   reorder:20, location:"Warehouse B" },
  { id:"P025", name:"Spin N Win",                  cat:"Fabric",  qty:17,  price:55000,  reorder:5,  location:"Warehouse A" },
  { id:"P026", name:"2×2 Red Fabric",              cat:"Fabric",  qty:0,   price:0,      reorder:5,  location:"Warehouse B" },
  { id:"P027", name:"2×2 White Fabric",            cat:"Fabric",  qty:0,   price:0,      reorder:5,  location:"Warehouse B" },
  { id:"P028", name:"2×2 Green Fabric",            cat:"Fabric",  qty:0,   price:0,      reorder:5,  location:"Warehouse B" },
  { id:"P029", name:"3×3 Blue Fabric",             cat:"Fabric",  qty:0,   price:0,      reorder:5,  location:"Warehouse B" },
  { id:"P030", name:"3×3 Red Fabric",              cat:"Fabric",  qty:0,   price:0,      reorder:5,  location:"Warehouse B" },
  { id:"P031", name:"3×3 Green Fabric",            cat:"Fabric",  qty:0,   price:0,      reorder:5,  location:"Warehouse B" },
  { id:"P032", name:"3×3 White Fabric",            cat:"Fabric",  qty:0,   price:0,      reorder:5,  location:"Warehouse B" },
  { id:"P033", name:"3×3 Black Fabric",            cat:"Fabric",  qty:0,   price:0,      reorder:5,  location:"Warehouse B" },
];

const SUPPLIERS = [
  { name:"ABC Supplies",  phone:"08000000000", email:"abc@example.com",       address:"Lagos"  },
  { name:"PrintCo",       phone:"08111111111", email:"printco@example.com",   address:"Ikeja"  },
  { name:"BrandMart",     phone:"08222222222", email:"brandmart@example.com", address:"Lekki"  },
];

const CATS = ["All","Tents","Banner","Stand","Pole","Table","Frame","Display","Fabric"];
const WAREHOUSES = ["All Locations","Warehouse A","Warehouse B"];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const naira = (v) => "₦" + Number(v).toLocaleString("en-NG");
const fmtDate = (d) => new Date(d).toLocaleDateString("en-NG", { day:"2-digit", month:"short", year:"numeric" });
const fmtTime = (d) => new Date(d).toLocaleTimeString("en-NG", { hour:"2-digit", minute:"2-digit" });

const status = (qty, reorder) => {
  if (qty === 0)         return "out";
  if (qty <= reorder)    return "low";
  if (qty > reorder * 8) return "high";
  return "ok";
};
const statusMeta = {
  out:  { label:"Out of Stock", color: C.red,    bg: C.redDim    },
  low:  { label:"Low Stock",    color: C.accent,  bg: C.accentDim },
  ok:   { label:"In Stock",     color: C.green,   bg: C.greenDim  },
  high: { label:"Well Stocked", color: C.blue,    bg: C.blueDim   },
};

// ─── Tiny components ──────────────────────────────────────────────────────────
function Badge({ st }) {
  const m = statusMeta[st];
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"3px 9px", borderRadius:4,
      fontSize:10, fontWeight:700, letterSpacing:"0.07em", textTransform:"uppercase",
      color:m.color, background:m.bg, border:`1px solid ${m.color}30` }}>
      <span style={{ width:5, height:5, borderRadius:"50%", background:m.color,
        animation: st==="out"||st==="low" ? "blink 1.2s infinite" : "none" }} />
      {m.label}
    </span>
  );
}

function Card({ label, value, sub, color, icon }) {
  return (
    <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10,
      padding:"18px 20px", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", top:0, left:0, right:0, height:3,
        background:color, boxShadow:`0 0 10px ${color}` }} />
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between" }}>
        <div>
          <div style={{ fontSize:11, color:C.textDim, textTransform:"uppercase",
            letterSpacing:"0.1em", marginBottom:8 }}>{label}</div>
          <div style={{ fontSize:26, fontWeight:800, color, fontFamily:"'Space Mono',monospace", lineHeight:1 }}>{value}</div>
          {sub && <div style={{ fontSize:11, color:C.muted, marginTop:6 }}>{sub}</div>}
        </div>
        <div style={{ fontSize:22, opacity:0.15 }}>{icon}</div>
      </div>
    </div>
  );
}

function StockBar({ qty, reorder }) {
  const max = Math.max(qty, reorder * 10, 10);
  const pct = Math.min(100, (qty / max) * 100);
  const st  = status(qty, reorder);
  const col = statusMeta[st].color;
  return (
    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
      <div style={{ flex:1, height:4, borderRadius:2, background:C.border, overflow:"hidden", position:"relative" }}>
        <div style={{ position:"absolute", left:0, top:0, bottom:0, width:`${pct}%`,
          background:col, boxShadow:`0 0 6px ${col}88`,
          transition:"width 0.5s cubic-bezier(0.4,0,0.2,1)", borderRadius:2 }} />
        <div style={{ position:"absolute",
          left:`${Math.min(100,(reorder/max)*100)}%`,
          top:-2, bottom:-2, width:1, background:C.accent+"aa" }} />
      </div>
      <span style={{ fontSize:10, color:C.textDim, minWidth:24, textAlign:"right" }}>{qty}</span>
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
function Modal({ title, onClose, children, width=420 }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"#000000cc", backdropFilter:"blur(4px)",
      display:"flex", alignItems:"center", justifyContent:"center", zIndex:200, padding:16 }}
      onClick={onClose}>
      <div style={{ background:C.surface, border:`1px solid ${C.borderBright}`, borderRadius:12,
        padding:28, width, maxWidth:"100%", maxHeight:"80vh", overflowY:"auto",
        boxShadow:`0 0 60px ${C.accentGlow}` }}
        onClick={e => e.stopPropagation()}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:22 }}>
          <h2 style={{ margin:0, fontSize:16, fontWeight:700, color:C.text }}>{title}</h2>
          <button onClick={onClose} style={{ background:"none", border:"none", color:C.muted,
            cursor:"pointer", fontSize:20, lineHeight:1, padding:"0 4px" }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom:14 }}>
      <label style={{ fontSize:11, color:C.textDim, display:"block", marginBottom:5,
        textTransform:"uppercase", letterSpacing:"0.08em" }}>{label}</label>
      {children}
    </div>
  );
}

const inputStyle = {
  width:"100%", background:C.bg, border:`1px solid ${C.border}`, borderRadius:6,
  padding:"10px 12px", color:C.text, fontSize:13, outline:"none", boxSizing:"border-box",
  fontFamily:"inherit",
};

const selectStyle = { ...inputStyle };
const btnPrimary = {
  padding:"11px 0", background:C.accent, border:"none", borderRadius:6,
  color:"#000", cursor:"pointer", fontSize:13, fontWeight:700, width:"100%",
};
const btnGhost = {
  padding:"11px 0", background:"transparent", border:`1px solid ${C.border}`,
  borderRadius:6, color:C.textDim, cursor:"pointer", fontSize:13, width:"100%",
};

// ─── Google Sheets Script ─────────────────────────────────────────────────────
const APPS_SCRIPT = `// ── Display Giants Inventory — Google Apps Script ──────────────────────────
// 1. In your Google Sheet: Extensions → Apps Script
// 2. Replace all code with this, then Save (Ctrl+S)
// 3. Deploy → New deployment → Web app
//    Execute as: Me | Who has access: Anyone
// 4. Copy the Web App URL and paste into the app

function doGet(e) {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Products");
  const action = e.parameter.action || "get";

  if (action === "get") {
    const data    = sheet.getDataRange().getValues();
    const headers = data[0];
    const rows    = data.slice(1)
      .filter(r => r[0]) // skip empty rows
      .map(row => {
        const obj = {};
        headers.forEach((h, i) => { obj[h] = row[i]; });
        return obj;
      });
    return out(rows);
  }

  if (action === "stockin") {
    const productId = e.parameter.id;
    const addQty    = Number(e.parameter.qty);
    const data      = sheet.getDataRange().getValues();
    const headers   = data[0];
    const idCol     = headers.indexOf("Product ID");
    const qtyCol    = headers.indexOf("Current Stock");
    for (let i = 1; i < data.length; i++) {
      if (data[i][idCol] === productId) {
        const newQty = Number(data[i][qtyCol]) + addQty;
        sheet.getRange(i+1, qtyCol+1).setValue(newQty);
        // Log to Stock In sheet
        const log = ss.getSheetByName("Stock In");
        log.appendRow([new Date(), productId, data[i][1], addQty,
                       e.parameter.supplier, e.parameter.ref]);
        break;
      }
    }
    return out({ success: true });
  }

  if (action === "stockout") {
    const productId = e.parameter.id;
    const remQty    = Number(e.parameter.qty);
    const data      = sheet.getDataRange().getValues();
    const headers   = data[0];
    const idCol     = headers.indexOf("Product ID");
    const qtyCol    = headers.indexOf("Current Stock");
    for (let i = 1; i < data.length; i++) {
      if (data[i][idCol] === productId) {
        const newQty = Math.max(0, Number(data[i][qtyCol]) - remQty);
        sheet.getRange(i+1, qtyCol+1).setValue(newQty);
        // Log to Stock Out sheet
        const log = ss.getSheetByName("Stock Out");
        log.appendRow([new Date(), productId, data[i][1], remQty,
                       e.parameter.customer, e.parameter.ref]);
        break;
      }
    }
    return out({ success: true });
  }

  if (action === "update") {
    const id      = e.parameter.id;
    const updates = JSON.parse(e.parameter.updates);
    const data    = sheet.getDataRange().getValues();
    const headers = data[0];
    const idCol   = headers.indexOf("Product ID");
    for (let i = 1; i < data.length; i++) {
      if (data[i][idCol] === id) {
        Object.keys(updates).forEach(key => {
          const col = headers.indexOf(key);
          if (col !== -1) sheet.getRange(i+1, col+1).setValue(updates[key]);
        });
        break;
      }
    }
    return out({ success: true });
  }

  return out({ error: "Unknown action" });
}

function out(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}`;

// ─── Sheets Connect Modal ─────────────────────────────────────────────────────
function SheetsModal({ onConnect, onClose }) {
  const [url, setUrl] = useState("");
  const [tab, setTab] = useState("script");
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(APPS_SCRIPT);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };
  return (
    <Modal title="Connect to Google Sheets" onClose={onClose} width={560}>
      <div style={{ display:"flex", gap:0, marginBottom:20, borderBottom:`1px solid ${C.border}` }}>
        {[["script","1. Copy Script"],["deploy","2. Deploy"],["connect","3. Connect"]].map(([k,l]) => (
          <button key={k} onClick={() => setTab(k)} style={{
            flex:1, padding:"9px 0", background:"none", border:"none",
            borderBottom:`2px solid ${tab===k ? C.accent : "transparent"}`,
            color:tab===k ? C.accent : C.textDim, cursor:"pointer", fontSize:12, fontWeight:600
          }}>{l}</button>
        ))}
      </div>

      {tab === "script" && (
        <div>
          <p style={{ color:C.textDim, fontSize:13, margin:"0 0 12px", lineHeight:1.7 }}>
            Open your Google Sheet → <strong style={{ color:C.text }}>Extensions → Apps Script</strong>. Delete all existing code and paste this script, then save.
          </p>
          <div style={{ position:"relative", background:C.bg, border:`1px solid ${C.border}`, borderRadius:6, overflow:"hidden" }}>
            <div style={{ padding:"8px 12px", borderBottom:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontSize:10, color:C.muted, fontFamily:"'Space Mono',monospace" }}>Code.gs</span>
              <button onClick={copy} style={{ background:C.accentDim, border:`1px solid ${C.accent}44`, borderRadius:4, color:C.accent, fontSize:10, padding:"3px 10px", cursor:"pointer", fontWeight:600 }}>
                {copied ? "✓ Copied!" : "Copy Script"}
              </button>
            </div>
            <pre style={{ margin:0, padding:"12px", fontSize:10, color:C.textDim, fontFamily:"'Space Mono',monospace", whiteSpace:"pre-wrap", maxHeight:200, overflow:"auto", lineHeight:1.5 }}>{APPS_SCRIPT}</pre>
          </div>
          <button onClick={() => setTab("deploy")} style={{ ...btnPrimary, marginTop:16 }}>Next: Deploy →</button>
        </div>
      )}

      {tab === "deploy" && (
        <div>
          <p style={{ color:C.textDim, fontSize:13, margin:"0 0 16px", lineHeight:1.7 }}>
            In Apps Script editor, click <strong style={{ color:C.text }}>Deploy → New deployment</strong> and set:
          </p>
          {[["Select type","Web app"],["Execute as","Me"],["Who has access","Anyone"]].map(([k,v]) => (
            <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"10px 14px",
              background:C.bg, border:`1px solid ${C.border}`, borderRadius:6, marginBottom:8, fontSize:13 }}>
              <span style={{ color:C.textDim }}>{k}</span>
              <span style={{ color:C.green, fontWeight:700 }}>{v}</span>
            </div>
          ))}
          <p style={{ color:C.textDim, fontSize:13, marginTop:12, lineHeight:1.7 }}>
            Click <strong style={{ color:C.text }}>Deploy</strong>, authorize when prompted, then copy the <strong style={{ color:C.accent }}>Web App URL</strong>.
          </p>
          <button onClick={() => setTab("connect")} style={{ ...btnPrimary, marginTop:8 }}>Next: Paste URL →</button>
        </div>
      )}

      {tab === "connect" && (
        <div>
          <p style={{ color:C.textDim, fontSize:13, margin:"0 0 12px", lineHeight:1.7 }}>
            Paste your deployed Web App URL below. It starts with <code style={{ color:C.accent, fontSize:11 }}>https://script.google.com/macros/s/</code>
          </p>
          <Field label="Web App URL">
            <input value={url} onChange={e => setUrl(e.target.value)}
              placeholder="https://script.google.com/macros/s/…/exec"
              style={{ ...inputStyle, fontFamily:"'Space Mono',monospace", fontSize:11, borderColor: url ? C.accent : C.border }} />
          </Field>
          <button onClick={() => url.trim() && onConnect(url.trim())} disabled={!url.trim()}
            style={{ ...btnPrimary, opacity: url.trim() ? 1 : 0.4, cursor: url.trim() ? "pointer" : "default" }}>
            ✓ Connect Display Giants to Google Sheets
          </button>
        </div>
      )}
    </Modal>
  );
}

// ─── Stock In Modal ───────────────────────────────────────────────────────────
function StockInModal({ products, onSave, onClose }) {
  const [pid, setPid]   = useState("");
  const [qty, setQty]   = useState(1);
  const [sup, setSup]   = useState("");
  const [ref, setRef]   = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0,10));
  const prod = products.find(p => p.id === pid);
  return (
    <Modal title="📦 Stock In — Receive Goods" onClose={onClose}>
      <Field label="Product">
        <select value={pid} onChange={e => setPid(e.target.value)} style={selectStyle}>
          <option value="">— Select product —</option>
          {products.map(p => <option key={p.id} value={p.id}>{p.id} · {p.name}</option>)}
        </select>
      </Field>
      {prod && (
        <div style={{ background:C.bg, border:`1px solid ${C.border}`, borderRadius:6, padding:"10px 14px", marginBottom:14, fontSize:12 }}>
          <span style={{ color:C.textDim }}>Current stock: </span>
          <span style={{ color:C.green, fontWeight:700 }}>{prod.qty} units</span>
          <span style={{ color:C.muted }}> · {prod.cat} · {prod.location}</span>
        </div>
      )}
      <Field label="Quantity to Add">
        <input type="number" min={1} value={qty} onChange={e => setQty(+e.target.value)} style={inputStyle} />
      </Field>
      <Field label="Supplier">
        <select value={sup} onChange={e => setSup(e.target.value)} style={selectStyle}>
          <option value="">— Select supplier —</option>
          {SUPPLIERS.map(s => <option key={s.name}>{s.name}</option>)}
        </select>
      </Field>
      <Field label="Invoice / Reference">
        <input value={ref} onChange={e => setRef(e.target.value)} placeholder="e.g. INV-2024-001" style={inputStyle} />
      </Field>
      <Field label="Date">
        <input type="date" value={date} onChange={e => setDate(e.target.value)} style={inputStyle} />
      </Field>
      <div style={{ display:"flex", gap:10, marginTop:4 }}>
        <button onClick={onClose} style={btnGhost}>Cancel</button>
        <button onClick={() => pid && qty > 0 && onSave({ pid, qty, supplier:sup, ref, date })} style={btnPrimary}>
          + Add to Stock
        </button>
      </div>
    </Modal>
  );
}

// ─── Stock Out Modal ──────────────────────────────────────────────────────────
function StockOutModal({ products, onSave, onClose }) {
  const [pid, setPid]      = useState("");
  const [qty, setQty]      = useState(1);
  const [customer, setCust]= useState("");
  const [ref, setRef]      = useState("");
  const [date, setDate]    = useState(new Date().toISOString().slice(0,10));
  const prod = products.find(p => p.id === pid);
  return (
    <Modal title="🚚 Stock Out — Dispatch Goods" onClose={onClose}>
      <Field label="Product">
        <select value={pid} onChange={e => setPid(e.target.value)} style={selectStyle}>
          <option value="">— Select product —</option>
          {products.filter(p => p.qty > 0).map(p => <option key={p.id} value={p.id}>{p.id} · {p.name} ({p.qty} left)</option>)}
        </select>
      </Field>
      {prod && (
        <div style={{ background:C.bg, border:`1px solid ${C.border}`, borderRadius:6, padding:"10px 14px", marginBottom:14, fontSize:12 }}>
          <span style={{ color:C.textDim }}>Available: </span>
          <span style={{ color: prod.qty < qty ? C.red : C.green, fontWeight:700 }}>{prod.qty} units</span>
          <span style={{ color:C.muted }}> · {prod.location}</span>
        </div>
      )}
      <Field label="Quantity to Remove">
        <input type="number" min={1} max={prod?.qty || 9999} value={qty} onChange={e => setQty(+e.target.value)} style={inputStyle} />
      </Field>
      <Field label="Customer / Recipient">
        <input value={customer} onChange={e => setCust(e.target.value)} placeholder="Customer name" style={inputStyle} />
      </Field>
      <Field label="Sales Reference">
        <input value={ref} onChange={e => setRef(e.target.value)} placeholder="e.g. SO-2024-001" style={inputStyle} />
      </Field>
      <Field label="Date">
        <input type="date" value={date} onChange={e => setDate(e.target.value)} style={inputStyle} />
      </Field>
      {prod && qty > prod.qty && (
        <div style={{ background:C.redDim, border:`1px solid ${C.red}44`, borderRadius:6, padding:"8px 12px", fontSize:12, color:C.red, marginBottom:12 }}>
          ⚠ Quantity exceeds available stock ({prod.qty} units)
        </div>
      )}
      <div style={{ display:"flex", gap:10, marginTop:4 }}>
        <button onClick={onClose} style={btnGhost}>Cancel</button>
        <button onClick={() => pid && qty > 0 && prod && qty <= prod.qty && onSave({ pid, qty, customer, ref, date })}
          style={{ ...btnPrimary, opacity: prod && qty <= prod.qty ? 1 : 0.4 }}>
          Remove from Stock
        </button>
      </div>
    </Modal>
  );
}

// ─── Edit Product Modal ───────────────────────────────────────────────────────
function EditModal({ product, onSave, onClose }) {
  const [name, setName]       = useState(product.name);
  const [cat, setCat]         = useState(product.cat);
  const [qty, setQty]         = useState(product.qty);
  const [price, setPrice]     = useState(product.price);
  const [reorder, setReorder] = useState(product.reorder);
  const [loc, setLoc]         = useState(product.location);
  return (
    <Modal title={`Edit — ${product.id}`} onClose={onClose}>
      <Field label="Product Name"><input value={name} onChange={e=>setName(e.target.value)} style={inputStyle}/></Field>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
        <Field label="Category">
          <select value={cat} onChange={e=>setCat(e.target.value)} style={selectStyle}>
            {CATS.slice(1).map(c=><option key={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Location">
          <select value={loc} onChange={e=>setLoc(e.target.value)} style={selectStyle}>
            <option>Warehouse A</option><option>Warehouse B</option>
          </select>
        </Field>
        <Field label="Current Stock"><input type="number" min={0} value={qty} onChange={e=>setQty(+e.target.value)} style={inputStyle}/></Field>
        <Field label="Reorder Level"><input type="number" min={0} value={reorder} onChange={e=>setReorder(+e.target.value)} style={inputStyle}/></Field>
      </div>
      <Field label="Unit Price (₦)"><input type="number" min={0} value={price} onChange={e=>setPrice(+e.target.value)} style={inputStyle}/></Field>
      <div style={{ display:"flex", gap:10, marginTop:4 }}>
        <button onClick={onClose} style={btnGhost}>Cancel</button>
        <button onClick={() => onSave({ ...product, name, cat, qty, price, reorder, location:loc })} style={btnPrimary}>Save Changes</button>
      </div>
    </Modal>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab]         = useState("dashboard");
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [logs, setLogs]       = useState([]);
  const [sheetsUrl, setUrl]   = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(null);

  const [modal, setModal]     = useState(null); // "stockin"|"stockout"|"edit"|"sheets"
  const [editing, setEditing] = useState(null);

  const [catFilter, setCatFilter]   = useState("All");
  const [locFilter, setLocFilter]   = useState("All Locations");
  const [stFilter, setStFilter]     = useState("All");
  const [search, setSearch]         = useState("");
  const [sort, setSort]             = useState("id");

  const logRef = useRef(0);
  const addLog = useCallback((type, msg, pid) => {
    setLogs(p => [{ id:++logRef.current, ts:Date.now(), type, msg, pid }, ...p.slice(0,99)]);
  }, []);

  // Load sheets URL from storage
  useEffect(() => {
    (async () => {
      try { const r = await window.storage.get("dg_sheetsUrl"); if (r?.value) setUrl(r.value); } catch(_) {}
    })();
  }, []);

  // Sync to/from Sheets
  const syncSheets = useCallback(async (url) => {
    if (!url) return;
    setSyncing(true);
    try {
      const res  = await fetch(`${url}?action=get`, { redirect:"follow" });
      const data = await res.json();
      setProducts(data.map(r => ({
        id: r["Product ID"], name: r["Product Name"], cat: r["Category"],
        qty: Number(r["Current Stock"]) || 0, price: Number(r["price"]) || 0,
        reorder: Number(r["Reorder Level"]) || 5, location: r["Location"] || "Warehouse A",
      })));
      setLastSync(Date.now());
      addLog("sync", "Synced from Google Sheets", null);
    } catch(_) {
      addLog("error", "Sheets sync failed", null);
    } finally { setSyncing(false); }
  }, [addLog]);

  useEffect(() => {
    if (!sheetsUrl) return;
    syncSheets(sheetsUrl);
    const id = setInterval(() => syncSheets(sheetsUrl), 30000);
    return () => clearInterval(id);
  }, [sheetsUrl, syncSheets]);

  // Stock In handler
  const handleStockIn = ({ pid, qty, supplier, ref }) => {
    setProducts(p => p.map(x => x.id === pid ? { ...x, qty: x.qty + qty } : x));
    const p = products.find(x => x.id === pid);
    addLog("in", `+${qty} units · Supplier: ${supplier || "N/A"} · Ref: ${ref || "—"}`, p?.name);
    if (sheetsUrl) {
      const params = new URLSearchParams({ action:"stockin", id:pid, qty, supplier, ref });
      fetch(`${sheetsUrl}?${params}`, { redirect:"follow" }).catch(() => {});
    }
    setModal(null);
  };

  // Stock Out handler
  const handleStockOut = ({ pid, qty, customer, ref }) => {
    setProducts(p => p.map(x => x.id === pid ? { ...x, qty: Math.max(0, x.qty - qty) } : x));
    const p = products.find(x => x.id === pid);
    addLog("out", `−${qty} units · Customer: ${customer || "N/A"} · Ref: ${ref || "—"}`, p?.name);
    if (sheetsUrl) {
      const params = new URLSearchParams({ action:"stockout", id:pid, qty, customer, ref });
      fetch(`${sheetsUrl}?${params}`, { redirect:"follow" }).catch(() => {});
    }
    setModal(null);
  };

  // Edit handler
  const handleEdit = (updated) => {
    setProducts(p => p.map(x => x.id === updated.id ? updated : x));
    addLog("edit", `Product updated`, updated.name);
    if (sheetsUrl) {
      const params = new URLSearchParams({ action:"update", id:updated.id,
        updates: JSON.stringify({ "Product Name":updated.name, "Category":updated.cat,
          "Current Stock":updated.qty, "price":updated.price,
          "Reorder Level":updated.reorder, "Location":updated.location }) });
      fetch(`${sheetsUrl}?${params}`, { redirect:"follow" }).catch(() => {});
    }
    setModal(null); setEditing(null);
  };

  // Connect Sheets
  const handleConnect = async (url) => {
    try { await window.storage.set("dg_sheetsUrl", url); } catch(_) {}
    setUrl(url);
    setModal(null);
  };

  // ── Derived stats ────────────────────────────────────────────────────────────
  const totalValue = products.reduce((s, p) => s + p.qty * p.price, 0);
  const outCount   = products.filter(p => p.qty === 0).length;
  const lowCount   = products.filter(p => p.qty > 0 && p.qty <= p.reorder).length;
  const totalUnits = products.reduce((s, p) => s + p.qty, 0);

  // ── Filtered / sorted products ───────────────────────────────────────────────
  const visible = products
    .filter(p => catFilter === "All" || p.cat === catFilter)
    .filter(p => locFilter === "All Locations" || p.location === locFilter)
    .filter(p => stFilter === "All" || status(p.qty, p.reorder) === stFilter)
    .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === "id")    return a.id.localeCompare(b.id);
      if (sort === "name")  return a.name.localeCompare(b.name);
      if (sort === "qty")   return b.qty - a.qty;
      if (sort === "value") return (b.qty*b.price) - (a.qty*a.price);
      if (sort === "cat")   return a.cat.localeCompare(b.cat);
      return 0;
    });

  // ── Category breakdown for dashboard ────────────────────────────────────────
  const catStats = CATS.slice(1).map(c => {
    const items = products.filter(p => p.cat === c);
    return { cat:c, count:items.length, units:items.reduce((s,p)=>s+p.qty,0),
      value:items.reduce((s,p)=>s+p.qty*p.price,0) };
  });

  // ── NAV ──────────────────────────────────────────────────────────────────────
  const navItems = [
    { key:"dashboard", label:"Dashboard", icon:"⊞" },
    { key:"products",  label:"Products",  icon:"≡" },
    { key:"movements", label:"Movements", icon:"↕" },
    { key:"alerts",    label:"Alerts",    icon:"⚠", badge: outCount + lowCount },
    { key:"suppliers", label:"Suppliers", icon:"🏭" },
  ];

  return (
    <div style={{ minHeight:"100vh", background:C.bg, color:C.text,
      fontFamily:"'DM Sans','Segoe UI',sans-serif", display:"flex", flexDirection:"column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,600;0,9..40,700;0,9..40,800&display=swap');
        *{box-sizing:border-box;}
        ::-webkit-scrollbar{width:4px;height:4px;}
        ::-webkit-scrollbar-thumb{background:#1e2530;border-radius:4px;}
        input:focus,select:focus{border-color:${C.accent}!important;outline:none!important;}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.25}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
        tr:hover td{background:#ffffff05!important;}
        button:hover{opacity:0.85;}
      `}</style>

      {/* ── Top Bar ─────────────────────────────────────────────────────────── */}
      <div style={{ background:C.surface, borderBottom:`1px solid ${C.border}`,
        padding:"0 24px", display:"flex", alignItems:"center", justifyContent:"space-between",
        height:56, flexShrink:0, position:"sticky", top:0, zIndex:50 }}>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <div style={{ width:32, height:32, borderRadius:8,
            background:`linear-gradient(135deg,${C.accent},#ef8c00)`,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:16, fontWeight:900, color:"#000" }}>D</div>
          <div>
            <div style={{ fontSize:15, fontWeight:800, color:C.text, lineHeight:1 }}>Display Giants</div>
            <div style={{ fontSize:10, color:C.muted, letterSpacing:"0.08em", textTransform:"uppercase" }}>Inventory Management</div>
          </div>
        </div>

        <nav style={{ display:"flex", gap:2 }}>
          {navItems.map(n => (
            <button key={n.key} onClick={() => setTab(n.key)} style={{
              padding:"6px 14px", borderRadius:6, border:"none", cursor:"pointer",
              background: tab===n.key ? C.accentDim : "transparent",
              color: tab===n.key ? C.accent : C.textDim,
              fontSize:12, fontWeight:600, position:"relative",
              borderBottom: tab===n.key ? `2px solid ${C.accent}` : "2px solid transparent",
            }}>
              <span style={{ marginRight:5 }}>{n.icon}</span>{n.label}
              {n.badge > 0 && (
                <span style={{ position:"absolute", top:2, right:2, background:C.red, color:"#fff",
                  borderRadius:8, fontSize:9, padding:"1px 4px", fontWeight:700, minWidth:14, textAlign:"center" }}>
                  {n.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          {sheetsUrl ? (
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ fontSize:10, color:C.green, background:C.greenDim, border:`1px solid ${C.green}33`,
                padding:"3px 9px", borderRadius:4, fontWeight:700 }}>
                <span style={{ animation:syncing?"spin 1s linear infinite":"none", display:"inline-block", marginRight:4 }}>
                  {syncing ? "↻" : "●"}
                </span>
                {syncing ? "Syncing…" : lastSync ? `Synced ${fmtTime(lastSync)}` : "Sheets Connected"}
              </span>
              <button onClick={() => syncSheets(sheetsUrl)} style={{ ...btnGhost, width:"auto", padding:"5px 10px", fontSize:11 }}>↻</button>
            </div>
          ) : (
            <button onClick={() => setModal("sheets")} style={{
              padding:"7px 14px", background:C.accentDim, border:`1px solid ${C.accent}44`,
              borderRadius:6, color:C.accent, cursor:"pointer", fontSize:11, fontWeight:700 }}>
              ⚡ Connect Google Sheets
            </button>
          )}
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────────────────────────── */}
      <div style={{ flex:1, padding:24, overflowY:"auto" }}>

        {/* ═══════════════════════════ DASHBOARD ═══════════════════════════════ */}
        {tab === "dashboard" && (
          <div style={{ animation:"fadeIn 0.3s ease" }}>
            <div style={{ marginBottom:20 }}>
              <h1 style={{ margin:"0 0 4px", fontSize:20, fontWeight:800 }}>Inventory Dashboard</h1>
              <p style={{ margin:0, fontSize:13, color:C.textDim }}>
                {new Date().toLocaleDateString("en-NG", { weekday:"long", year:"numeric", month:"long", day:"numeric" })}
              </p>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:24 }}>
              <Card label="Total Products" value={products.length} icon="📦" color={C.accent} sub={`${totalUnits.toLocaleString()} total units`} />
              <Card label="Stock Value"    value={`₦${(totalValue/1000000).toFixed(2)}M`} icon="💰" color={C.purple} sub={naira(totalValue)} />
              <Card label="Out of Stock"   value={outCount} icon="⚠" color={C.red} sub="require restocking" />
              <Card label="Low Stock"      value={lowCount} icon="📉" color={C.accent} sub="below reorder level" />
            </div>

            {/* Category Breakdown */}
            <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:20, marginBottom:16 }}>
              <h3 style={{ margin:"0 0 16px", fontSize:13, fontWeight:700, color:C.text, textTransform:"uppercase", letterSpacing:"0.08em" }}>
                Stock by Category
              </h3>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:10 }}>
                {catStats.filter(c => c.count > 0).map(c => {
                  const maxUnits = Math.max(...catStats.map(x=>x.units), 1);
                  const pct = Math.round((c.units / maxUnits) * 100);
                  return (
                    <div key={c.cat} style={{ background:C.bg, border:`1px solid ${C.border}`, borderRadius:8, padding:"12px 14px", cursor:"pointer" }}
                      onClick={() => { setCatFilter(c.cat); setTab("products"); }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                        <span style={{ fontSize:12, fontWeight:600, color:C.text }}>{c.cat}</span>
                        <span style={{ fontSize:10, color:C.muted }}>{c.count} SKUs</span>
                      </div>
                      <div style={{ height:4, borderRadius:2, background:C.border, overflow:"hidden", marginBottom:8 }}>
                        <div style={{ width:`${pct}%`, height:"100%", background:C.accent, borderRadius:2, transition:"width 0.6s" }} />
                      </div>
                      <div style={{ display:"flex", justifyContent:"space-between" }}>
                        <span style={{ fontSize:11, color:C.accent, fontWeight:700, fontFamily:"'Space Mono',monospace" }}>{c.units.toLocaleString()} units</span>
                        <span style={{ fontSize:10, color:C.textDim }}>{naira(c.value)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              <button onClick={() => setModal("stockin")} style={{
                background:C.greenDim, border:`1px solid ${C.green}44`, borderRadius:10,
                padding:"20px 24px", cursor:"pointer", textAlign:"left", color:C.text }}>
                <div style={{ fontSize:24, marginBottom:8 }}>📦</div>
                <div style={{ fontSize:15, fontWeight:700, color:C.green }}>Receive Stock</div>
                <div style={{ fontSize:12, color:C.textDim, marginTop:4 }}>Log incoming goods from suppliers</div>
              </button>
              <button onClick={() => setModal("stockout")} style={{
                background:C.redDim, border:`1px solid ${C.red}44`, borderRadius:10,
                padding:"20px 24px", cursor:"pointer", textAlign:"left", color:C.text }}>
                <div style={{ fontSize:24, marginBottom:8 }}>🚚</div>
                <div style={{ fontSize:15, fontWeight:700, color:C.red }}>Dispatch Stock</div>
                <div style={{ fontSize:12, color:C.textDim, marginTop:4 }}>Record stock going out to customers</div>
              </button>
            </div>
          </div>
        )}

        {/* ═══════════════════════════ PRODUCTS ═══════════════════════════════ */}
        {tab === "products" && (
          <div style={{ animation:"fadeIn 0.3s ease" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16, flexWrap:"wrap", gap:10 }}>
              <h1 style={{ margin:0, fontSize:20, fontWeight:800 }}>Products</h1>
              <div style={{ display:"flex", gap:8 }}>
                <button onClick={() => setModal("stockin")} style={{
                  padding:"8px 16px", background:C.greenDim, border:`1px solid ${C.green}44`,
                  borderRadius:6, color:C.green, cursor:"pointer", fontSize:12, fontWeight:700 }}>
                  + Stock In
                </button>
                <button onClick={() => setModal("stockout")} style={{
                  padding:"8px 16px", background:C.redDim, border:`1px solid ${C.red}44`,
                  borderRadius:6, color:C.red, cursor:"pointer", fontSize:12, fontWeight:700 }}>
                  − Stock Out
                </button>
              </div>
            </div>

            {/* Filters */}
            <div style={{ display:"flex", gap:8, marginBottom:12, flexWrap:"wrap",
              background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:"10px 12px" }}>
              <input placeholder="Search product or ID…" value={search} onChange={e=>setSearch(e.target.value)}
                style={{ ...inputStyle, flex:1, minWidth:180, padding:"7px 10px", fontSize:12 }} />
              <select value={catFilter} onChange={e=>setCatFilter(e.target.value)} style={{ ...selectStyle, width:"auto", padding:"7px 10px", fontSize:12 }}>
                {CATS.map(c=><option key={c}>{c}</option>)}
              </select>
              <select value={locFilter} onChange={e=>setLocFilter(e.target.value)} style={{ ...selectStyle, width:"auto", padding:"7px 10px", fontSize:12 }}>
                {WAREHOUSES.map(w=><option key={w}>{w}</option>)}
              </select>
              <select value={stFilter} onChange={e=>setStFilter(e.target.value)} style={{ ...selectStyle, width:"auto", padding:"7px 10px", fontSize:12 }}>
                <option value="All">All Status</option>
                <option value="out">Out of Stock</option>
                <option value="low">Low Stock</option>
                <option value="ok">In Stock</option>
                <option value="high">Well Stocked</option>
              </select>
              <select value={sort} onChange={e=>setSort(e.target.value)} style={{ ...selectStyle, width:"auto", padding:"7px 10px", fontSize:12 }}>
                <option value="id">Sort: ID</option>
                <option value="name">Sort: Name</option>
                <option value="qty">Sort: Qty</option>
                <option value="value">Sort: Value</option>
                <option value="cat">Sort: Category</option>
              </select>
            </div>

            <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, overflow:"hidden" }}>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead>
                  <tr style={{ borderBottom:`1px solid ${C.border}`, background:"#0d1015" }}>
                    {["ID","Product Name","Category","Location","Stock Level","Unit Price","Stock Value","Status",""].map(h=>(
                      <th key={h} style={{ padding:"10px 14px", textAlign:"left", fontSize:10, fontWeight:700,
                        color:C.muted, textTransform:"uppercase", letterSpacing:"0.1em", whiteSpace:"nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visible.map(p => {
                    const st  = status(p.qty, p.reorder);
                    const val = p.qty * p.price;
                    return (
                      <tr key={p.id} style={{ borderBottom:`1px solid ${C.border}55`, transition:"background 0.1s" }}>
                        <td style={{ padding:"11px 14px" }}>
                          <span style={{ fontFamily:"'Space Mono',monospace", fontSize:11, color:C.accent }}>{p.id}</span>
                        </td>
                        <td style={{ padding:"11px 14px", maxWidth:220 }}>
                          <div style={{ fontSize:13, fontWeight:600, color:C.text, lineHeight:1.3 }}>{p.name}</div>
                        </td>
                        <td style={{ padding:"11px 14px" }}>
                          <span style={{ fontSize:11, color:C.textDim, background:C.border, padding:"2px 8px", borderRadius:4 }}>{p.cat}</span>
                        </td>
                        <td style={{ padding:"11px 14px" }}>
                          <span style={{ fontSize:11, color:C.textDim }}>{p.location}</span>
                        </td>
                        <td style={{ padding:"11px 14px", minWidth:130 }}>
                          <div style={{ fontFamily:"'Space Mono',monospace", fontSize:15, fontWeight:700,
                            color:statusMeta[st].color, marginBottom:4 }}>{p.qty.toLocaleString()}</div>
                          <StockBar qty={p.qty} reorder={p.reorder} />
                          <div style={{ fontSize:9, color:C.muted, marginTop:3 }}>Reorder at {p.reorder}</div>
                        </td>
                        <td style={{ padding:"11px 14px" }}>
                          <span style={{ fontFamily:"'Space Mono',monospace", fontSize:12, color:C.textDim }}>
                            {p.price > 0 ? naira(p.price) : "—"}
                          </span>
                        </td>
                        <td style={{ padding:"11px 14px" }}>
                          <span style={{ fontFamily:"'Space Mono',monospace", fontSize:12, color:val>0?C.text:C.muted }}>
                            {val > 0 ? naira(val) : "—"}
                          </span>
                        </td>
                        <td style={{ padding:"11px 14px" }}><Badge st={st} /></td>
                        <td style={{ padding:"11px 14px" }}>
                          <button onClick={() => { setEditing(p); setModal("edit"); }} style={{
                            padding:"4px 10px", borderRadius:5, border:`1px solid ${C.border}`,
                            background:"transparent", color:C.textDim, cursor:"pointer", fontSize:11 }}>
                            Edit
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {visible.length === 0 && (
                    <tr><td colSpan={9} style={{ padding:40, textAlign:"center", color:C.muted, fontSize:13 }}>
                      No products match your filters.
                    </td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <div style={{ fontSize:11, color:C.muted, marginTop:8, paddingLeft:2 }}>
              Showing {visible.length} of {products.length} products
            </div>
          </div>
        )}

        {/* ═══════════════════════════ MOVEMENTS ═══════════════════════════════ */}
        {tab === "movements" && (
          <div style={{ animation:"fadeIn 0.3s ease" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
              <h1 style={{ margin:0, fontSize:20, fontWeight:800 }}>Stock Movements</h1>
              <div style={{ display:"flex", gap:8 }}>
                <button onClick={() => setModal("stockin")} style={{ padding:"8px 16px", background:C.greenDim, border:`1px solid ${C.green}44`, borderRadius:6, color:C.green, cursor:"pointer", fontSize:12, fontWeight:700 }}>+ Stock In</button>
                <button onClick={() => setModal("stockout")} style={{ padding:"8px 16px", background:C.redDim, border:`1px solid ${C.red}44`, borderRadius:6, color:C.red, cursor:"pointer", fontSize:12, fontWeight:700 }}>− Stock Out</button>
              </div>
            </div>

            {logs.length === 0 ? (
              <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:60, textAlign:"center" }}>
                <div style={{ fontSize:40, marginBottom:12 }}>📋</div>
                <div style={{ fontSize:15, color:C.textDim }}>No movements recorded yet.</div>
                <div style={{ fontSize:13, color:C.muted, marginTop:6 }}>Use Stock In or Stock Out to log activity.</div>
              </div>
            ) : (
              <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, overflow:"hidden" }}>
                {logs.map(l => (
                  <div key={l.id} style={{ display:"flex", alignItems:"center", gap:14, padding:"13px 18px",
                    borderBottom:`1px solid ${C.border}55`, borderLeft:`3px solid ${l.type==="in"?C.green:l.type==="out"?C.red:l.type==="sync"?C.blue:C.accent}`,
                    animation:"fadeIn 0.3s ease" }}>
                    <div style={{ fontSize:18 }}>{l.type==="in"?"📦":l.type==="out"?"🚚":l.type==="sync"?"🔄":l.type==="error"?"⚠":"✏️"}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13, fontWeight:600, color:C.text }}>{l.pid || "System"}</div>
                      <div style={{ fontSize:12, color:C.textDim, marginTop:2 }}>{l.msg}</div>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ fontSize:11, color:C.muted, fontFamily:"'Space Mono',monospace" }}>{fmtTime(l.ts)}</div>
                      <div style={{ fontSize:10, color:C.muted }}>{fmtDate(l.ts)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════ ALERTS ════════════════════════════════ */}
        {tab === "alerts" && (
          <div style={{ animation:"fadeIn 0.3s ease" }}>
            <h1 style={{ margin:"0 0 20px", fontSize:20, fontWeight:800 }}>Stock Alerts</h1>
            {["out","low"].map(st => {
              const items = products.filter(p => status(p.qty, p.reorder) === st);
              if (!items.length) return null;
              const m = statusMeta[st];
              return (
                <div key={st} style={{ background:C.surface, border:`1px solid ${m.color}33`,
                  borderRadius:10, overflow:"hidden", marginBottom:16 }}>
                  <div style={{ padding:"12px 18px", borderBottom:`1px solid ${m.color}22`,
                    background:m.bg, display:"flex", alignItems:"center", gap:10 }}>
                    <span style={{ fontSize:14 }}>{st==="out"?"🚨":"⚠️"}</span>
                    <span style={{ fontSize:13, fontWeight:700, color:m.color }}>
                      {st==="out" ? "Out of Stock" : "Low Stock"} — {items.length} item{items.length>1?"s":""}
                    </span>
                  </div>
                  {items.map(p => (
                    <div key={p.id} style={{ display:"flex", alignItems:"center", gap:14,
                      padding:"12px 18px", borderBottom:`1px solid ${C.border}44` }}>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:13, fontWeight:600, color:C.text }}>{p.name}</div>
                        <div style={{ fontSize:11, color:C.textDim, marginTop:2 }}>
                          {p.id} · {p.cat} · {p.location}
                        </div>
                      </div>
                      <div style={{ textAlign:"center" }}>
                        <div style={{ fontSize:20, fontWeight:800, color:m.color, fontFamily:"'Space Mono',monospace" }}>{p.qty}</div>
                        <div style={{ fontSize:10, color:C.muted }}>in stock</div>
                      </div>
                      <div style={{ textAlign:"center" }}>
                        <div style={{ fontSize:16, fontWeight:700, color:C.textDim, fontFamily:"'Space Mono',monospace" }}>{p.reorder}</div>
                        <div style={{ fontSize:10, color:C.muted }}>reorder at</div>
                      </div>
                      <button onClick={() => setModal("stockin")} style={{
                        padding:"7px 14px", background:C.greenDim, border:`1px solid ${C.green}44`,
                        borderRadius:6, color:C.green, cursor:"pointer", fontSize:11, fontWeight:700 }}>
                        + Restock
                      </button>
                    </div>
                  ))}
                </div>
              );
            })}
            {outCount + lowCount === 0 && (
              <div style={{ background:C.surface, border:`1px solid ${C.green}33`, borderRadius:10, padding:60, textAlign:"center" }}>
                <div style={{ fontSize:40, marginBottom:12 }}>✅</div>
                <div style={{ fontSize:15, color:C.green, fontWeight:600 }}>All stock levels are healthy!</div>
                <div style={{ fontSize:13, color:C.textDim, marginTop:6 }}>No alerts at this time.</div>
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════ SUPPLIERS ═══════════════════════════════ */}
        {tab === "suppliers" && (
          <div style={{ animation:"fadeIn 0.3s ease" }}>
            <h1 style={{ margin:"0 0 20px", fontSize:20, fontWeight:800 }}>Suppliers</h1>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:12 }}>
              {SUPPLIERS.map(s => (
                <div key={s.name} style={{ background:C.surface, border:`1px solid ${C.border}`,
                  borderRadius:10, padding:20, position:"relative", overflow:"hidden" }}>
                  <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:C.accent }} />
                  <div style={{ fontSize:16, fontWeight:700, color:C.text, marginBottom:14 }}>🏭 {s.name}</div>
                  {[["📞",s.phone],["✉️",s.email],["📍",s.address]].map(([icon,val]) => (
                    <div key={icon} style={{ display:"flex", gap:10, marginBottom:8, fontSize:13 }}>
                      <span>{icon}</span>
                      <span style={{ color:C.textDim }}>{val}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Modals ──────────────────────────────────────────────────────────── */}
      {modal === "stockin"  && <StockInModal  products={products} onSave={handleStockIn}  onClose={() => setModal(null)} />}
      {modal === "stockout" && <StockOutModal products={products} onSave={handleStockOut} onClose={() => setModal(null)} />}
      {modal === "edit"     && editing && <EditModal product={editing} onSave={handleEdit} onClose={() => { setModal(null); setEditing(null); }} />}
      {modal === "sheets"   && <SheetsModal onConnect={handleConnect} onClose={() => setModal(null)} />}
    </div>
  );
}
