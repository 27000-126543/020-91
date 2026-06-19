import type { StickerStyle, StickerFormData, StickerComputed } from '@/types';
import { MinimalSticker } from './stickers/MinimalSticker';
import { NurseSticker } from './stickers/NurseSticker';
import { KidsSticker } from './stickers/KidsSticker';

interface StickerRendererProps {
  style: StickerStyle;
  formData: StickerFormData;
  computed: StickerComputed;
  size?: 'preview' | 'print';
}

export function StickerRenderer({ style, formData, computed, size = 'preview' }: StickerRendererProps) {
  const props = { formData, computed, size };

  switch (style) {
    case 'minimal':
      return <MinimalSticker {...props} />;
    case 'nurse':
      return <NurseSticker {...props} />;
    case 'kids':
      return <KidsSticker {...props} />;
    default:
      return <MinimalSticker {...props} />;
  }
}
