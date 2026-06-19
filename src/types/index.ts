export type StickerStyle = 'minimal' | 'nurse' | 'kids';

export type ExpiryStatus = 'expired' | 'warning' | 'normal';

export interface StickerFormData {
  materialName: string;
  batchNumber: string;
  openDate: string;
  expiryDate: string;
  daysAfterOpen: number;
  cabinetNumber: string;
  warnDaysBefore: number;
  style: StickerStyle;
}

export interface StickerRecord extends StickerFormData {
  id: string;
  latestUseDate: string;
  createdAt: string;
}

export interface StickerComputed {
  latestUseDate: string;
  daysRemaining: number;
  status: ExpiryStatus;
  formattedLatestUseDate: string;
  formattedOpenDate: string;
  formattedExpiryDate: string;
}
