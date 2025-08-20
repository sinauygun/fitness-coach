import { useEffect, useMemo, useState } from "react";
import defaultPlan from "./defaultPlan";
import type { Plan, DayDef } from "./types";
import { todayPattern, scheduleTodayNotifications, toYAML, fromYAML, makeICS } from "./utils";
import { parseAppleExportXML, parseCSV } from "./health";
import { Calendar, Bell, FileDown, FileUp, Apple, Edit3, Check } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function App(){
  const [plan, setPlan] = useState<Plan>(()=> {
    const raw = localStorage.getItem("plan");
    return raw ? JSON.parse(raw) : defaultPlan;
  });
  const patt = todayPattern(plan);
  const def:DayDef = plan.dayTypes[patt];

  useEffect(()=>{ localStorage.setItem("plan", JSON.stringify(plan)); },[plan]);

  async function askPerm(){
    if (!("Notification" in window)) return alert("Tarayıcı bildirimi desteklemiyor");
    const p = await Notification.requestPermission();
    if (p!=="granted") alert("Bildirim izni verilmedi");
    else scheduleTodayNotifications([...(def.meals||[]),...(def.workouts||[])]);
  }

  function exportYAML(){
    const blob = new Blob([toYAML(plan)], {type:"text/yaml"});
    const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(blob), download: "plan.yaml" });
    a.click(); URL.revokeObjectURL(a.href);
  }
  async function importYAML(e:any){
    const f = e.target.files?.[0]; if(!f) return;
    const text = await f.text();
    setPlan(fromYAML(text));
  }

  const [yamlEditOpen, setYamlEditOpen] = useState(false);
  const [yamlText, setYamlText] = useState("");
  useEffect(()=>{ if(yamlEditOpen) setYamlText(toYAML(plan)); },[yamlEditOpen]);
  function saveYaml(){
    try { setPlan(fromYAML(yamlText)); setYamlEditOpen(false); }
    catch(e){ alert("YAML hatası: "+(e as Error).message); }
  }

  const [health, setHealth] = useState<any[]>([]);
  async function onImportXML(e:any){
    const f = e.target.files?.[0]; if(!f) return;
    setHealth(await parseAppleExportXML(f));
  }
  async function onImportCSV(e:any){
    const f = e.target.files?.[0]; if(!f) return;
    setHealth(await parseCSV(f));
  }

  const last90 = useMemo(()=> health.slice(-90),[health]);
  const recs = useMemo(()=> last90.map(d=>({
    date:d.date, steps:d.steps||0, km:d.distanceKm||0, kcal:d.activeKcal||0, ex:d.exerciseMin||0
  })),[last90]);

  const weeklyAgg = useMemo(()=>{
    const last7 = health.slice(-7);
    const avg = (k:"steps"|"distanceKm"|"activeKcal"|"exerciseMin") => {
      const vals = last7.map((d:any)=> d[k]||0);
      return vals.length? Math.round(vals.reduce((a:number,b:number)=>a+b,0)/vals.length) : 0;
    };
    return { avgSteps: avg("steps"), avgExMin: avg("exerciseMin") };
  },[health]);

  const suggestion = useMemo(()=>{
    if (weeklyAgg.avgSteps && weeklyAgg.avgSteps < 6000) return "Adım düşük. REST gününe 20 dk yürüyüş ekleyelim.";
    if (weeklyAgg.avgSteps && weeklyAgg.avgSteps > 10000) return "Adım yüksek. A/C HIIT süresini +5 dk yapalım.";
    return "Veri yüklendiğinde öneri görünecek.";
  },[weeklyAgg]);

  function applySuggestion(){
    if (weeklyAgg.avgSteps && weeklyAgg.avgSteps < 6000) {
      const newPlan = structuredClone(plan);
      if (!newPlan.dayTypes.REST.workouts.find(w=>w.text.includes("Ek yürüyüş"))) {
        newPlan.dayTypes.REST.workouts.push({ time:"19:00", text:"Ek yürüyüş +20 dk" });
      }
      setPlan(newPlan);
    } else if (weeklyAgg.avgSteps && weeklyAgg.avgSteps > 10000) {
      const patch = (s:string)=> s.includes("HIIT") && !s.includes("+5") ? s+" (+5 dk)" : s;
      const newPlan = structuredClone(plan);
      newPlan.dayTypes.A.workouts = newPlan.dayTypes.A.workouts.map(w=> ({...w, text: patch(w.text)}));
      newPlan.dayTypes.C.workouts = newPlan.dayTypes.C.workouts.map(w=> ({...w, text: patch(w.text)}));
      setPlan(newPlan);
    } else {
      alert("Öneri uygulanacak yeterli veri yok.");
    }
  }

  function downloadICS(){
    const items = [...(def.meals||[]),...(def.workouts||[])].map(i=>({time:i.time,text:i.text}));
    const blob = makeICS("Fitness Coach", items, new Date());
    const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(blob), download: "today.ics" });
    a.click(); URL.revokeObjectURL(a.href);
  }

  return (
    <Layout>
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold text-sky-400">🏋️ Fitness Coach</h1>
        <p className="text-slate-300">PWA — iPhone’da <b>Paylaş → Ana Ekrana Ekle</b></p>
      <nav className="flex gap-2 mt-2">
          <a className="btn-secondary" href="/calendar">Takvim</a>
          <a className="btn-secondary" href="/charts">Grafikler</a>
          <a className="btn-secondary" href="/editor">Editör</a>
        </nav>
      </header>

      <section className="grid-2">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Bugün: <span className="text-emerald-400">{patt}</span></h2>
              <p className="text-sm text-slate-400">TZ: {plan.timezone}</p>
            </div>
            <div className="flex gap-2">
              <button className="btn" onClick={askPerm}><Bell className="inline size-4 mr-1"/> Bildirimleri Aç</button>
              <button className="btn-secondary" onClick={downloadICS}><Calendar className="inline size-4 mr-1"/> iCal</button>
            </div>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold text-sky-300 mb-2">Öğünler</h3>
            <table className="table">
              <thead><tr className="text-sky-400"><th className="text-left">Saat</th><th className="text-left">İçerik</th></tr></thead>
              <tbody>
                {(def.meals||[]).map((m,i)=>(
                  <tr key={i} className="border-b border-slate-700">
                    <td><span className="pill">{m.time}</span></td>
                    <td className="py-2">{m.text}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h3 className="font-semibold text-sky-300 mt-4 mb-2">Spor</h3>
            <table className="table">
              <thead><tr className="text-sky-400"><th className="text-left">Saat</th><th className="text-left">Program</th></tr></thead>
              <tbody>
                {(def.workouts||[]).map((w,i)=>(
                  <tr key={i} className="border-b border-slate-700">
                    <td><span className="pill">{w.time}</span></td>
                    <td className="py-2">{w.text}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Planı İçe/Dışa Aktar</h2>
            <button className="btn-secondary" onClick={()=>setYamlEditOpen(v=>!v)}>
              <Edit3 className="inline size-4 mr-1"/> YAML düzenle
            </button>
          </div>
          {yamlEditOpen && (
            <div className="mt-3">
              <textarea value={yamlText} onChange={e=>setYamlText(e.target.value)} className="w-full h-48 p-2 rounded bg-slate-800 border border-slate-700 font-mono text-xs"></textarea>
              <div className="mt-2 flex gap-2">
                <button className="btn" onClick={saveYaml}><Check className="inline size-4 mr-1"/> Kaydet</button>
                <button className="btn-secondary" onClick={()=>setYamlEditOpen(false)}>İptal</button>
              </div>
            </div>
          )}

          <div className="flex gap-2 mt-3">
            <button className="btn" onClick={exportYAML}><FileDown className="inline size-4 mr-1"/> YAML indir</button>
            <label className="btn-secondary cursor-pointer"><FileUp className="inline size-4 mr-1"/> YAML yükle
              <input type="file" accept=".yaml,.yml" className="hidden" onChange={importYAML}/>
            </label>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold text-sky-300 mb-2"><Apple className="inline size-4 mr-1"/> Apple Health içe aktar</h3>
            <div className="flex gap-2">
              <label className="btn-secondary cursor-pointer">export.xml yükle
                <input type="file" accept=".xml" className="hidden" onChange={onImportXML}/>
              </label>
              <label className="btn-secondary cursor-pointer">CSV yükle
                <input type="file" accept=".csv" className="hidden" onChange={onImportCSV}/>
              </label>
            </div>
            <p className="text-sm text-slate-400 mt-2">Son 90 gün: adım, km, aktif kcal, exercise süresi</p>
            <div className="h-40 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={recs}>
                  <XAxis dataKey="date" hide />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="steps" dot={false} stroke="#34d399" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 p-3 rounded bg-slate-800 border border-slate-700">
              <div className="text-sm text-slate-300">Haftalık ort. adım: <b className="text-emerald-400">{weeklyAgg.avgSteps||0}</b></div>
              <div className="text-sm text-slate-400 mt-1">Öneri: {suggestion}</div>
              <button className="btn mt-2" onClick={applySuggestion}>Öneriyi Uygula</button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
