export type Metric = {
  id: string;
  title_ar: string;
  title_en: string;
  value: number;
  suffix?: string;        // e.g. %, +
  delta?: number;         // change value
  deltaDir?: "up" | "down" | "flat";
  periodKey?: "7d" | "30d" | "90d";
  trend?: number[];       // sparkline data
  caption_ar?: string;
  caption_en?: string;
};

export const HOME_METRICS: Metric[] = [
  { 
    id: "delivered", 
    title_ar: "مشاريع مُسلَّمة", 
    title_en: "Projects Delivered", 
    value: 128, 
    suffix: "+", 
    delta: 12, 
    deltaDir: "up", 
    periodKey: "30d", 
    trend: [5,7,6,8,9,10,12], 
    caption_ar: "آخر 30 يوم", 
    caption_en: "Last 30 days" 
  },
  { 
    id: "reduceCost", 
    title_ar: "خفض التكاليف", 
    title_en: "Cost Reduction", 
    value: 22, 
    suffix: "%", 
    delta: 3, 
    deltaDir: "up", 
    periodKey: "90d", 
    trend: [15,16,16,18,19,20,22], 
    caption_ar: "آخر 90 يوم", 
    caption_en: "Last 90 days" 
  },
  { 
    id: "csat", 
    title_ar: "رضا العملاء", 
    title_en: "Client Satisfaction", 
    value: 4.8, 
    suffix: "/5", 
    delta: 0.2, 
    deltaDir: "up", 
    periodKey: "30d", 
    trend: [4.4,4.5,4.6,4.6,4.7,4.7,4.8],
    caption_ar: "آخر 30 يوم",
    caption_en: "Last 30 days"
  },
  { 
    id: "timeToMarket", 
    title_ar: "تسريع الإطلاق", 
    title_en: "Time-to-Market Gain", 
    value: 38, 
    suffix: "%", 
    delta: 2, 
    deltaDir: "up", 
    periodKey: "30d", 
    trend: [20,22,25,28,30,34,38],
    caption_ar: "آخر 30 يوم",
    caption_en: "Last 30 days"
  }
];