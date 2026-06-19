import { useState } from 'react';
import { StickerForm, type StickerFormData } from '@/components/StickerForm';
import { useStickerStore } from '@/store';
import { PrintLayout } from '@/components/PrintLayout';
import { useDateCalculator } from '@/hooks/useDateCalculator';

export function GeneratorPage() {
  const addRecord = useStickerStore((s) => s.addRecord);
  const [showPrint, setShowPrint] = useState(false);
  const [lastFormData, setLastFormData] = useState<StickerFormData | null>(null);
  const computed = lastFormData ? useDateCalculator(lastFormData) : null;

  const handleSave = (formData: StickerFormData) => {
    addRecord(formData);
  };

  const handlePrint = (formData: StickerFormData) => {
    setLastFormData(formData);
    setShowPrint(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <span className="text-3xl">✨</span>效期贴纸生成
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          填写材料信息，系统自动计算最晚使用日期，一键打印贴纸贴在瓶身上
        </p>
      </div>

      <StickerForm onSave={handleSave} onPrint={handlePrint} />

      {showPrint && lastFormData && computed && (
        <PrintLayout
          formData={lastFormData}
          computed={computed}
          onClose={() => setShowPrint(false)}
        />
      )}
    </div>
  );
}
