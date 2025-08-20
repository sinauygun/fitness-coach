import { Plan } from "./types";
const plan: Plan = {
  timezone: "Europe/Istanbul",
  weeklyPattern: ["A","B","C","B","A","C","REST"],
  dayTypes: {
    A: {
      meals: [
        { time:"08:30", text:"Kahvaltı: 3 beyaz + 2 tam + 30g yulaf" },
        { time:"11:00", text:"Ara: 15 badem" },
        { time:"13:30", text:"Öğle: 180g tavuk + 70g kinoa + salata" },
        { time:"16:30", text:"Ara: 1 ölçek whey" },
        { time:"19:30", text:"Akşam: 200g balık + sebze" },
        { time:"22:30", text:"Gece: 100g lor" }
      ],
      workouts: [
        { time:"07:00", text:"HIIT 20–25 dk (30sn sprint/90sn yürüyüş x10–12)" },
        { time:"18:30", text:"Ağırlık: Göğüs+Triceps" }
      ]
    },
    B: {
      meals: [
        { time:"08:30", text:"Kahvaltı: 40g yulaf + 200ml light süt + 1 yumurta" },
        { time:"11:00", text:"Ara: 1 muz" },
        { time:"13:30", text:"Öğle: 150g yağsız kırmızı et + 50g bulgur + sebze" },
        { time:"16:30", text:"Ara: 150g light yoğurt" },
        { time:"19:30", text:"Akşam: 180g tavuk/hindi + brokoli" }
      ],
      workouts: [
        { time:"07:30", text:"Tempo yürüyüş 45–60 dk (HR 130–140)" },
        { time:"18:30", text:"Ağırlık: Sırt+Biceps" }
      ]
    },
    C: {
      meals: [
        { time:"08:30", text:"Kahvaltı: 3 beyaz + 2 tam + yeşillik" },
        { time:"11:00", text:"Ara: 20 fındık" },
        { time:"13:30", text:"Öğle: 180g tavuk + 80g kinoa" },
        { time:"16:30", text:"Ara: 1 ölçek whey" },
        { time:"19:30", text:"Akşam: 200g balık + sebze" }
      ],
      workouts: [
        { time:"07:00", text:"HIIT 25–30 dk (14 set)" },
        { time:"18:30", text:"Ağırlık: Bacak+Omuz" }
      ]
    },
    REST: {
      meals: [
        { time:"09:30", text:"Kahvaltı: 2 tam + 2 beyaz + 1 dilim tam buğday" },
        { time:"12:30", text:"Öğle: 150g hindi + salata" },
        { time:"16:30", text:"Ara: 10 badem" },
        { time:"19:30", text:"Akşam: 180g balık + sebze" }
      ],
      workouts: [
        { time:"11:00", text:"Aktif dinlenme: 30 dk yürüyüş + esneme" }
      ]
    }
  }
};
export default plan;
