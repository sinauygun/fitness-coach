import type { HealthDaily } from "./types";

export async function parseAppleExportXML(file:File): Promise<HealthDaily[]> {
  const xml = await file.text();
  const doc = new DOMParser().parseFromString(xml,"text/xml");
  const recs = Array.from(doc.getElementsByTagName("Record"));
  const rows = new Map<string, HealthDaily>();
  const getRow = (d:string)=> rows.get(d) || (rows.set(d,{date:d}), rows.get(d)!);

  recs.forEach(r=>{
    const type = r.getAttribute("type")||"";
    const start = r.getAttribute("startDate")||"";
    const val = parseFloat(r.getAttribute("value")||"0");
    const day = (start||"").slice(0,10);
    const row = getRow(day);
    if (type.endsWith("StepCount")) row.steps = (row.steps||0)+val;
    if (type.endsWith("DistanceWalkingRunning")) row.distanceKm = (row.distanceKm||0)+val;
    if (type.endsWith("ActiveEnergyBurned")) row.activeKcal = (row.activeKcal||0)+val;
    if (type.endsWith("AppleExerciseTime")) row.exerciseMin = (row.exerciseMin||0)+val;
  });

  return Array.from(rows.values()).sort((a,b)=>a.date.localeCompare(b.date));
}

export async function parseCSV(file:File): Promise<HealthDaily[]> {
  const text = await file.text();
  const lines = text.trim().split(/\r?\n/);
  const head = lines.shift()!.split(",");
  const idx = (k:string)=> head.findIndex(h=>h.trim().toLowerCase().includes(k));
  const dI = idx("date");
  const sI = idx("step");
  const distI = idx("distance");
  const kcalI = idx("active");
  const exI = idx("exercise");
  return lines.map(l=>{
    const c = l.split(",");
    return {
      date: c[dI],
      steps: sI>-1? +c[sI] : undefined,
      distanceKm: distI>-1? +c[distI] : undefined,
      activeKcal: kcalI>-1? +c[kcalI] : undefined,
      exerciseMin: exI>-1? +c[exI] : undefined
    };
  }).sort((a,b)=>a.date.localeCompare(b.date));
}
