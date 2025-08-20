import { useMemo, useState } from "react";
import defaultPlan from "../defaultPlan";
import { Plan } from "../types";
import { Link } from "react-router-dom";

export default function CalendarView(){
  const [plan] = useState<Plan>(()=> {
    const raw = localStorage.getItem("plan");
    return raw ? JSON.parse(raw) : defaultPlan;
  });

  const start = new Date();
  const day = (start.getDay()+6)%7; // Mon=0
  start.setDate(start.getDate() - day);

  const weeks = 12;
  const days = useMemo(()=>{
    return Array.from({length: weeks*7}).map((_,i)=>{
      const d = new Date(start.getTime()); d.setDate(start.getDate()+i);
      const patt = plan.weeklyPattern[i%7] || "REST";
      return { date: d, patt };
    });
  },[weeks, plan]);

  return (
    <div className="min-h-screen p-4">
      <header className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-sky-400">📅 Haftalık Takvim (12 hafta)</h1>
        <nav className="flex gap-2">
          <Link className="btn-secondary" to="/">Bugün</Link>
          <Link className="btn-secondary" to="/charts">Grafikler</Link>
          <Link className="btn-secondary" to="/editor">Gün/Gün Editör</Link>
        </nav>
      </header>

      <div className="grid grid-cols-7 gap-2">
        {["Pzt","Sal","Çar","Per","Cum","Cmt","Paz"].map((d,i)=>
          <div key={i} className="text-center text-sky-300 font-semibold">{d}</div>
        )}
        {days.map((x,i)=>{
          const isToday = new Date().toDateString() === x.date.toDateString();
          return (
            <div key={i} className={`card ${isToday?"ring-2 ring-emerald-400":""}`}>
              <div className="text-xs text-slate-400">
                {x.date.toLocaleDateString()}
              </div>
              <div className="mt-1 font-bold">{x.patt}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
