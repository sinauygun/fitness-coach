import { Plan, PlanItem } from "./types";
import YAML from "yaml";

export function todayPattern(plan:Plan, d=new Date()) {
  const idx = (d.getDay()+6)%7; // Mon=0..Sun=6
  return plan.weeklyPattern[idx] || "REST";
}

export function toYAML(plan:Plan){ return YAML.stringify(plan); }
export function fromYAML(text:string){ return YAML.parse(text); }

export function scheduleTodayNotifications(items:PlanItem[]) {
  if (!("Notification" in window)) return;
  const perm = Notification.permission;
  if (perm !== "granted") return;

  const now = new Date();
  items.forEach(it=>{
    const [HH,mm] = it.time.split(":").map(Number);
    const t = new Date();
    t.setHours(HH,mm,0,0);
    if (t < now) t.setDate(t.getDate()+1);
    const delay = t.getTime()-now.getTime();
    setTimeout(()=> new Notification("Hatırlatıcı", { body: it.text }), delay);
  });
}

export function makeICS(title:string, lines:{time:string,text:string}[], date=new Date()) {
  // single-day, floating time ICS
  const y = date.getFullYear();
  const m = String(date.getMonth()+1).padStart(2,"0");
  const d = String(date.getDate()).padStart(2,"0");
  const dt = (t:string)=> `${y}${m}${d}T${t.replace(":","")}00`;
  const body = [
    "BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//fitness-coach//EN",
    ...lines.map((l,i)=>[
      "BEGIN:VEVENT",
      `UID:${y}${m}${d}-${i}@fitness`,
      `DTSTART:${dt(l.time)}`,
      `DTEND:${dt(l.time)}`,
      `SUMMARY:${title}`,
      `DESCRIPTION:${l.text}`,
      "END:VEVENT"
    ].join("\n")),
    "END:VCALENDAR"
  ].join("\n");
  return new Blob([body], { type:"text/calendar;charset=utf-8" });
}
