import { create } from 'zustand';
import type { StickerRecord, StickerStyle } from '@/types';
import { generateId, getTodayStr, addDays, getEarlierDate } from '@/utils/dateUtils';

interface StickerStore {
  records: StickerRecord[];
  currentStyle: StickerStyle;
  printCount: number;
  setCurrentStyle: (style: StickerStyle) => void;
  setPrintCount: (count: number) => void;
  addRecord: (record: Omit<StickerRecord, 'id' | 'latestUseDate' | 'createdAt'>) => StickerRecord;
  updateRecord: (id: string, record: Partial<StickerRecord>) => void;
  deleteRecord: (id: string) => void;
  deleteExpiredRecords: () => void;
  getRecordById: (id: string) => StickerRecord | undefined;
  getSortedRecords: () => StickerRecord[];
}

export const useStickerStore = create<StickerStore>((set, get) => ({
  records: [],
  currentStyle: 'minimal',
  printCount: 12,

  setCurrentStyle: (style) => set({ currentStyle: style }),
  setPrintCount: (count) => set({ printCount: Math.max(1, Math.min(30, count)) }),

  addRecord: (recordData) => {
    const openPlusDays = addDays(recordData.openDate, recordData.daysAfterOpen);
    const latestUseDate = getEarlierDate(openPlusDays, recordData.expiryDate);
    const newRecord: StickerRecord = {
      ...recordData,
      id: generateId(),
      latestUseDate,
      createdAt: getTodayStr(),
    };
    set((state) => ({
      records: [...state.records, newRecord],
    }));
    return newRecord;
  },

  updateRecord: (id, recordData) => {
    set((state) => ({
      records: state.records.map((r) => {
        if (r.id !== id) return r;
        const updated = { ...r, ...recordData };
        if (recordData.openDate || recordData.expiryDate || recordData.daysAfterOpen) {
          const openPlusDays = addDays(updated.openDate, updated.daysAfterOpen);
          updated.latestUseDate = getEarlierDate(openPlusDays, updated.expiryDate);
        }
        return updated;
      }),
    }));
  },

  deleteRecord: (id) => {
    set((state) => ({
      records: state.records.filter((r) => r.id !== id),
    }));
  },

  deleteExpiredRecords: () => {
    const today = getTodayStr();
    set((state) => ({
      records: state.records.filter((r) => r.latestUseDate >= today),
    }));
  },

  getRecordById: (id) => get().records.find((r) => r.id === id),

  getSortedRecords: () => {
    return [...get().records].sort((a, b) =>
      a.latestUseDate.localeCompare(b.latestUseDate)
    );
  },
}));

const STORAGE_KEY = 'dental-sticker-records';

const storedRecords = (() => {
  try {
    const item = localStorage.getItem(STORAGE_KEY);
    return item ? JSON.parse(item) : [];
  } catch {
    return [];
  }
})();

useStickerStore.setState({ records: storedRecords });

useStickerStore.subscribe((state) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.records));
  } catch {
    // 忽略存储错误
  }
});
