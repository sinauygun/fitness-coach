import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { parseAppleExportXML, parseCSV } from "../health";

export default function ChartsView(){
  const [data, setData] = useState<any[]>([]);

  const last90 = useMemo(()=> data.slice(-90),[data]);

  async function onXML(e:any){ const f=e.target.files?.[0]; if(!f) return; setData(await parseAppleExportXML(f)); }
  async function onCSV(e:any){ const f=e.target.files?.[0]; if(!f) return; setData(await parseCSV(f)); }

  const recs = useMemo(()=> last90.map(d=>({
    date:d.date, steps:d.steps||0, km:d.distanceKm||0, kcal:d.activeKcal||0, ex:d.exerciseMin||0
  })),[last90]);

  return (
    <div className="min-h-screen p-4">
      <header className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-sky-400">📈 90 Günlük Grafikler</h1>
        <nav className="flex gap-2">
          <Link className="btn-secondary" to="/">Bugün</Link>
          <Link className="btn-secondary" to="/calendar">Takvim</Link>
          <Link className="btn-secondary" to="/editor">Gün/Gün Editör</Link>
        </nav>
      </header>

      <div className="card mb-3">
        <div className="flex gap-2">
          <label className="btn-secondary cursor-pointer">export.xml yükle
            <input type="file" accept=".xml" className="hidden" onChange={onXML}/>
          </label>
          <label className="btn-secondary cursor-pointer">CSV yükle
            <input type="file" accept=".csv" className="hidden" onChange={onCSV}/>
          </label>
        </div>
        <p className="text-sm text-slate-400 mt-2">Adım, km, aktif kcal, exercise süresi (son 90 gün)</p>
      </div>

      <div className="card h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={recs}>
            <XAxis dataKey="date" hide />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="steps" dot={false} />
            <Line type="monotone" dataKey="km" dot={false} />
            <Line type="monotone" dataKey="kcal" dot={false} />
            <Line type="monotone" dataKey="ex" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
