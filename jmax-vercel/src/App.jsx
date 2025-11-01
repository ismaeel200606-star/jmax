
import React, { useMemo, useState } from "react";

const MINDSETS = ["Bluepilled", "Redpilled", "Blackpilled", "ERpilled", "Sigma"];
const STRATEGIES = ["Genemaxx", "Looksmaxx", "Gymmaxx", "Mewing", "Moneymaxx"];
const JAW_TYPES = ["Mogger", "Strong", "Average", "Soft", "Razor"];

export default function App() {
  const [title, setTitle] = useState("CHAD"); // make title editable
  const [mindset, setMindset] = useState("MINDSETS");
  const [strategy, setStrategy] = useState(STRATEGIES[0]);
  const [jawType, setJawType] = useState(JAW_TYPES[0]);
  const [breathing, setBreathing] = useState("Nose breather");
  const [appeal, setAppeal] = useState("Jordan Barrett");
  const [pslScore, setPslScore] = useState("7");

  const [bars, setBars] = useState({ psl: 65, mindset: 90, strategy: 75, jaw: 92, breathing: 78, appeal: 88 });
  const [imgURL, setImgURL] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [pos, setPos] = useState({ x: 50, y: 50 });

  const circleStyle = useMemo(() => ({
    backgroundImage: imgURL ? `url(${imgURL})` : undefined,
    backgroundSize: `${zoom * 100}% ${zoom * 100}%`,
    backgroundPosition: `${pos.x}% ${pos.y}%`,
    backgroundRepeat: "no-repeat",
    backgroundColor: imgURL ? undefined : "#2b2b2b",
  }), [imgURL, zoom, pos]);

  const onUpload = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => setImgURL(e.target.result);
    reader.readAsDataURL(file);
  };

  return (
    <div style={styles.page}>
      <div style={styles.left}>
        <h2 style={styles.h2}>Controls</h2>
        <div style={{ ...styles.panel, padding: 16 }}>
          <label style={styles.label}>Profile image
            <input type="file" accept="image/*" onChange={(e)=>onUpload(e.target.files?.[0])} />
          </label>
          <div style={styles.grid2}>
            <Range label="Zoom" min={0.5} max={3} step={0.01} value={zoom} onChange={setZoom} />
            <Range label="Offset X" min={0} max={100} step={1} value={pos.x} onChange={(v)=>setPos(p=>({...p, x: v}))} />
            <Range label="Offset Y" min={0} max={100} step={1} value={pos.y} onChange={(v)=>setPos(p=>({...p, y: v}))} />
          </div>

          <TextField label="Title (CHAD)" value={title} onChange={setTitle} />

          <div style={{ marginTop: 16 }}>
           <TextField label="Mindset" value={mindset} onChange={setMindset} />
           <TextField label="Strategy" value={strategy} onChange={setStrategy} />
           <TextField label="Jawline Type" value={jawType} onChange={setJawType} />

           <label style={styles.label}>Breathing
           <select style={styles.input} value={breathing} onChange={(e) => setBreathing(e.target.value)}>
           <option value="Nose breather">Nose breather</option>
               <option value="Mouth breather">Mouth breather</option>
                </select>
                  </label>

            <TextField label="Appeal Level" value={appeal} onChange={setAppeal} />
          </div>

          <div style={{ marginTop: 20 }}>
            {Object.keys(bars).map((key) => (
              <ColorSlider key={key} label={`Bar • ${key}`} value={bars[key]} onChange={(v) => setBars((b) => ({ ...b, [key]: v }))} />
            ))}
          </div>
        </div>
      </div>

      <div style={styles.right}>
        <div style={styles.cardOuter}>
          <div style={styles.avatarWrap}>
            <div style={{ ...styles.avatarCircle, ...circleStyle }} />
          </div>

          <div style={styles.titleRow}> 
            <div style={styles.titleText}>{title}</div>
          </div>
          <div style={styles.subtitle}>PSL SCALE</div>

          <div style={styles.infoCard}>
            <div style={styles.grid2}>
              <InfoBlock label="PSL Score" value={pslScore} bar={bars.psl} />
              <InfoBlock label="Mindset" value={mindset} bar={bars.mindset} />
              <InfoBlock label="Strategy" value={strategy} bar={bars.strategy} />
              <InfoBlock label="Jawline Type" value={jawType} bar={bars.jaw} />
              <InfoBlock label="Breathing" value={breathing} bar={bars.breathing} />
              <InfoBlock label="Appeal Level" value={appeal} bar={bars.appeal} />
            </div>
          </div>

          <div style={styles.bottomBadge}>JAWMAX</div>
        </div>
      </div>
    </div>
  );
}

function colorGradient(value) {
  if (value < 50) {
    const ratio = value / 50;
    return `rgb(255, ${Math.round(165 * ratio)}, 0)`; // red to orange
  } else {
    const ratio = (value - 50) / 50;
    return `rgb(${Math.round(255 - 155 * ratio)}, ${Math.round(165 + 90 * ratio)}, 0)`; // orange to green
  }
}

function ColorSlider({ label, value, onChange }) {
  const color = colorGradient(value);
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={styles.label}>{label}</label>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        style={{ width: "100%", accentColor: color }}
      />
      <div style={{ ...styles.colorBar, background: color, height: 6, borderRadius: 6, marginTop: 4 }} />
    </div>
  );
}

function TextField({ label, value, onChange }) {
  return (
    <label style={styles.label}>{label}
      <input style={styles.input} value={value} onChange={(e)=>onChange(e.target.value)} />
    </label>
  );
}

function Picker({ label, value, setValue, options }) {
  return (
    <label style={styles.label}>{label}
      <select style={styles.input} value={value} onChange={(e)=>setValue(e.target.value)}>
        {options.map(o=> <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}

function Range({ label, min, max, step, value, onChange }) {
  return (
    <label style={styles.label}>{label}
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e)=>onChange(parseFloat(e.target.value))} />
    </label>
  );
}

function InfoBlock({ label, value, bar }) {
  const color = colorGradient(bar);
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ color: "#a1a1aa", fontSize: 14 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, marginTop: 2 }}>{value}</div>
      <div style={styles.progressBg}><div style={{ ...styles.progressFg, width: `${bar}%`, background: color }} /></div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#000", color: "#fff", display: "grid", gridTemplateColumns: "420px 1fr", gap: 16, padding: 16 },
  left: {},
  right: { display: "flex", alignItems: "flex-start", justifyContent: "center" },
  h2: { margin: 0, marginBottom: 8, fontSize: 18, fontWeight: 700 },
  panel: { background: "#0a0a0a", border: "1px solid #27272a", borderRadius: 16 },
  label: { display: "block", fontSize: 12, color: "#a1a1aa", textTransform: "uppercase", marginBottom: 4 },
  input: { width: "100%", background: "#111", color: "#fff", border: "1px solid #27272a", borderRadius: 10, padding: "10px 12px" },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  cardOuter: { position: 'relative', width: 760, border: "1px solid #27272a", background: "#000", borderRadius: 28, padding: 24, boxShadow: "0 10px 40px rgba(0,0,0,.5)", paddingBottom: 110 },
  avatarWrap: { display: "flex", justifyContent: "center", marginBottom: 16 },
  avatarCircle: { width: 224, height: 224, borderRadius: "50%", boxShadow: "0 10px 20px rgba(0,0,0,.45)", border: "2px solid rgba(255,255,255,.08)" },
  titleRow: { display: "flex", alignItems: "center", gap: 12, justifyContent: "center" },
  titleText: { fontSize: 56, fontWeight: 800, letterSpacing: -1 },
  subtitle: { color: "#a1a1aa", fontSize: 20, marginTop: 4, textAlign: "center", letterSpacing: 3 },
  infoCard: { marginTop: 18, border: "1px solid #27272a", background: "#0a0a0a", borderRadius: 20, padding: 18 },
  progressBg: { height: 8, borderRadius: 8, background: "#1f2937", overflow: "hidden", marginTop: 6 },
  progressFg: { height: "100%" },
  bottomBadge: { position:'absolute', bottom:-46, left:'50%', transform:'translateX(-50%)', padding:'16px 36px', borderRadius:30, border:'2px solid rgba(168,85,247,.6)', background:'#0a0a0a', color:'#ddd6fe', fontSize:28, fontWeight:800, letterSpacing:1 },
  colorBar: { transition: 'background 0.2s ease' }
};
