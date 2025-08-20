export type PlanItem = { time:string; text:string };
export type DayDef = { meals:PlanItem[]; workouts:PlanItem[] };
export type Plan = {
  timezone:string;
  weeklyPattern: ("A"|"B"|"C"|"REST")[];
  dayTypes: Record<"A"|"B"|"C"|"REST", DayDef>;
};
export type HealthDaily = {
  date:string; steps?:number; distanceKm?:number; activeKcal?:number; exerciseMin?:number;
};
