import { useMemo } from 'react';
import type { StickerFormData, StickerComputed, ExpiryStatus } from '@/types';
import {
  addDays,
  getEarlierDate,
  getDaysDiff,
  getTodayStr,
  formatDateDisplay,
} from '@/utils/dateUtils';

export function useDateCalculator(formData: StickerFormData): StickerComputed | null {
  return useMemo(() => {
    if (!formData.openDate || !formData.expiryDate || !formData.daysAfterOpen) {
      return null;
    }

    const openPlusDays = addDays(formData.openDate, formData.daysAfterOpen);
    const latestUseDate = getEarlierDate(openPlusDays, formData.expiryDate);
    const today = getTodayStr();
    const daysRemaining = getDaysDiff(today, latestUseDate);

    let status: ExpiryStatus;
    if (daysRemaining < 0) {
      status = 'expired';
    } else if (daysRemaining <= formData.warnDaysBefore) {
      status = 'warning';
    } else {
      status = 'normal';
    }

    return {
      latestUseDate,
      daysRemaining,
      status,
      formattedLatestUseDate: formatDateDisplay(latestUseDate),
      formattedOpenDate: formatDateDisplay(formData.openDate),
      formattedExpiryDate: formatDateDisplay(formData.expiryDate),
    };
  }, [formData.openDate, formData.expiryDate, formData.daysAfterOpen, formData.warnDaysBefore]);
}

export function getStatusInfo(status: ExpiryStatus) {
  switch (status) {
    case 'expired':
      return { label: '已过期', color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-500', dotColor: 'bg-red-500' };
    case 'warning':
      return { label: '临期', color: 'text-orange-600', bgColor: 'bg-orange-50', borderColor: 'border-orange-500', dotColor: 'bg-orange-500' };
    case 'normal':
      return { label: '正常', color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-500', dotColor: 'bg-green-500' };
  }
}
