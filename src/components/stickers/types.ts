import type { StickerComputed, StickerFormData } from '@/types';

export interface StickerProps {
  formData: StickerFormData;
  computed: StickerComputed;
  size?: 'preview' | 'print';
}
