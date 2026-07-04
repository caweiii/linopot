import { ForecastRecommendation, HistoryRecord, VendorProfile } from './types';

export const initialRecommendation: ForecastRecommendation = {
  portions: 46,
  confidence: 92,
  expectedDemand: 'Normal',
  comparisonText: '4 fewer portions than yesterday.',
  isAccepted: false,
  originalRecommendation: 46,
};

export const initialHistoryRecords: HistoryRecord[] = [
  {
    id: 'rec_1',
    date: 'Fri, 3 Jul',
    prepared: 48,
    sold: 46,
    leftovers: 2,
    aiRec: 47,
    accuracy: 98,
  },
  {
    id: 'rec_2',
    date: 'Thu, 2 Jul',
    prepared: 52,
    sold: 49,
    leftovers: 3,
    aiRec: 51,
    accuracy: 96,
  },
  {
    id: 'rec_3',
    date: 'Wed, 1 Jul',
    prepared: 45,
    sold: 40,
    leftovers: 5,
    aiRec: 42,
    accuracy: 95,
  },
  {
    id: 'rec_4',
    date: 'Tue, 30 Jun',
    prepared: 40,
    sold: 38,
    leftovers: 2,
    aiRec: 39,
    accuracy: 97,
  },
  {
    id: 'rec_5',
    date: 'Mon, 29 Jun',
    prepared: 45,
    sold: 41,
    leftovers: 4,
    aiRec: 43,
    accuracy: 95,
  },
  {
    id: 'rec_6',
    date: 'Sat, 27 Jun',
    prepared: 55,
    sold: 48,
    leftovers: 7,
    aiRec: 50,
    accuracy: 92,
  },
  {
    id: 'rec_7',
    date: 'Fri, 26 Jun',
    prepared: 50,
    sold: 42,
    leftovers: 8,
    aiRec: 46,
    accuracy: 88,
  },
  {
    id: 'rec_8',
    date: 'Thu, 25 Jun',
    prepared: 45,
    sold: 38,
    leftovers: 7,
    aiRec: 41,
    accuracy: 86,
  },
  {
    id: 'rec_9',
    date: 'Wed, 24 Jun',
    prepared: 48,
    sold: 35,
    leftovers: 13,
    aiRec: 40,
    accuracy: 75,
  },
  {
    id: 'rec_10',
    date: 'Tue, 23 Jun',
    prepared: 50,
    sold: 36,
    leftovers: 14,
    aiRec: 42,
    accuracy: 70,
  },
  {
    id: 'rec_11',
    date: 'Mon, 22 Jun',
    prepared: 45,
    sold: 30,
    leftovers: 15,
    aiRec: 35,
    accuracy: 65,
  }
];

export const initialProfile: VendorProfile = {
  stallName: "Siti's Nasi Lemak",
  category: 'Nasi Lemak',
  avgCustomers: 120,
  operatingDays: 'Isnin - Sabtu', // Sabah Malay operating days
  language: 'Bahasa Malaysia',
  offlineSync: true,
  notificationsEnabled: true,
  weatherUpdatesEnabled: true,
  darkMode: false,
};

export const weeklyTrendData = [
  { day: 'Mon', value: 35, active: false },
  { day: 'Tue', value: 42, active: false },
  { day: 'Wed', value: 38, active: false },
  { day: 'Thu', value: 48, active: false },
  { day: 'Fri', value: 46, active: true }, 
  { day: 'Sat', value: 55, active: false },
  { day: 'Sun', value: 15, active: false },
];
