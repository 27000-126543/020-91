import { useEffect, useState } from 'react';
import type { StickerRecord, StickerFormData, StickerComputed } from '@/types';
import { StickerRenderer } from './StickerRenderer';
import { useDateCalculator } from '@/hooks/useDateCalculator';
import { X, Minus, Plus } from 'lucide-react';

interface PrintLayoutProps {
  formData: StickerFormData;
  computed: StickerComputed;
  onClose: () => void;
}

export function PrintLayout({ formData, computed, onClose }: PrintLayoutProps) {
  const [count, setCount] = useState(12);

  useEffect(() => {
    const timer = setTimeout(() => {
      window.print();
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const stickers = Array.from({ length: count }, (_, i) => i);

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-auto print:overflow-visible">
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4 print:hidden z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold text-gray-800">🖨️ 打印预览</h2>
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setCount((c) => Math.max(1, c - 1))}
                className="p-1.5 rounded hover:bg-white transition"
              >
                <Minus size={16} />
              </button>
              <span className="w-12 text-center font-medium tabular-nums">{count}</span>
              <button
                onClick={() => setCount((c) => Math.min(30, c + 1))}
                className="p-1.5 rounded hover:bg-white transition"
              >
                <Plus size={16} />
              </button>
              <span className="text-xs text-gray-500 ml-1">张</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition"
            >
              确认打印
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        <p className="max-w-4xl mx-auto text-xs text-gray-500 mt-2">
          💡 提示：建议使用自粘不干胶打印纸，在浏览器打印设置中选择「无边距」或调整缩放以获得最佳效果。
        </p>
      </div>

      <div className="print-area p-8 print:p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 print:gap-3 max-w-4xl mx-auto justify-items-center">
          {stickers.map((i) => (
            <div key={i} className="shrink-0">
              <StickerRenderer
                style={formData.style}
                formData={formData}
                computed={computed}
                size="print"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function PrintLayoutFromRecord({ record, onClose }: { record: StickerRecord; onClose: () => void }) {
  const formData: StickerFormData = {
    materialName: record.materialName,
    batchNumber: record.batchNumber,
    openDate: record.openDate,
    expiryDate: record.expiryDate,
    daysAfterOpen: record.daysAfterOpen,
    cabinetNumber: record.cabinetNumber,
    warnDaysBefore: record.warnDaysBefore,
    style: record.style,
  };
  const computed = useDateCalculator(formData);

  if (!computed) return null;

  return (
    <PrintLayout
      formData={formData}
      computed={computed}
      onClose={onClose}
    />
  );
}
