import { useEffect, useState } from "react";
import defaultPlan from "../defaultPlan";
import type { Plan } from "../types";
import { Link } from "react-router-dom";
import { toYAML, fromYAML } from "../utils";

export default function EditorView(){
  const [plan, setPlan] = useState<Plan>(()=> {
    const raw = localStorage.getItem("plan");
    return raw ? JSON.parse(raw) : defaultPlan;
  });
  const [text, setText] = useState(toYAML(plan));
  useEffect(()=>{ setText(toYAML(plan)); },[]);

  function save(){
    try {
      const p = fromYAML(text);
      setPlan(p);
      localStorage.setItem("plan", JSON.stringify(p));
      alert("Kaydedildi");
    } catch (e:any) {
      alert("YAML hatası: "+e.message);
    }
  }

  return (
    <div className="min-h-screen p-4">
      <header className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-sky-400">🛠️ Gün/Gün Editör (YAML)</h1>
        <nav className="flex gap-2">
          <Link className="btn-secondary" to="/">Bugün</Link>
          <Link className="btn-secondary" to="/calendar">Takvim</Link>
          <Link className="btn-secondary" to="/charts">Grafikler</Link>
        </nav>
      </header>

      <div className="card">
        <textarea value={text} onChange={e=>setText(e.target.value)}
          className="w-full h-96 bg-slate-900 border border-slate-700 rounded-xl p-3 font-mono text-sm"></textarea>
        <div className="mt-3 flex gap-2">
          <button className="btn" onClick={save}>Kaydet</button>
          <button className="btn-secondary" onClick={()=>setText(toYAML(defaultPlan))}>Varsayılan</button>
        </div>
      </div>
    </div>
  );
}
