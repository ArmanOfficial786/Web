// services/Common/ComCalendarService.ts (cached version)
import { apiClient } from "../apiClient";

type TodayBs = {
  year: number;
  month: number;
  day: number;
  convertedDate: string;
};

// ── Module‑level caches ──────────────────────────────────────────────────────
let yearsCache: number[] | null = null;
let todayBsCache: TodayBs | null = null;
const daysCache = new Map<string, number[]>(); // key: `${year}-${month}`

const calendarService = {
  getYears: async (forceRefresh = false): Promise<number[]> => {
    if (!forceRefresh && yearsCache) return yearsCache;
    const response = await apiClient.api.calendarYearsList();
    yearsCache = response.data.years ?? [];
    return yearsCache;
  },

  getDays: async (
    year: number,
    month: number,
    forceRefresh = false,
  ): Promise<number[]> => {
    const key = `${year}-${month}`;
    if (!forceRefresh && daysCache.has(key)) return daysCache.get(key)!;
    const response = await apiClient.api.calendarDaysList({ year, month });
    const days = response.data.days ?? [];
    daysCache.set(key, days);
    return days;
  },

  convertAdToBs: async (adDate: string) => {
    const response = await apiClient.api.calendarConvertCreate({
      direction: "ADtoBS",
      date: adDate,
    });
    return response.data;
  },

  convertBsToAd: async (bsDate: string) => {
    const response = await apiClient.api.calendarConvertCreate({
      direction: "BStoAD",
      date: bsDate,
    });
    return response.data;
  },

  getTodayBs: async (forceRefresh = false): Promise<TodayBs> => {
    if (!forceRefresh && todayBsCache) return todayBsCache;
    const today = new Date().toISOString().split("T")[0];
    const response = await apiClient.api.calendarConvertCreate({
      direction: "ADtoBS",
      date: today,
    });
    const { year, month, day, convertedDate } = response.data;
    if (!year || !month || !day || !convertedDate) {
      throw new Error("Today's BS date could not be resolved.");
    }
    todayBsCache = { year, month, day, convertedDate };
    return todayBsCache;
  },

  // Optional: clear caches (e.g., after user logout or manual refresh)
  clearCache: () => {
    yearsCache = null;
    todayBsCache = null;
    daysCache.clear();
  },
};

export default calendarService;
