export interface ForecastRecommendation {
  portions: number;
  confidence: number;
  expectedDemand: string;
  comparisonText: string;
  isAccepted: boolean;
  originalRecommendation: number;
}

export interface HistoryRecord {
  id: string;
  date: string;
  prepared: number;
  sold: number;
  leftovers: number;
  aiRec: number;
  accuracy: number;
}

export interface VendorProfile {
  stallName: string;
  category: string;
  avgCustomers: number;
  operatingDays: string;
  language: string;
  offlineSync: boolean;
  notificationsEnabled: boolean;
  weatherUpdatesEnabled: boolean;
  darkMode: boolean;
}
