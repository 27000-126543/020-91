import { useState, useMemo } from 'react';
import { Palette, Stethoscope, Baby } from 'lucide-react';
import type { StickerStyle, StickerFormData } from '@/types';
import { useDateCalculator } from '@/hooks/useDateCalculator';
import { StickerRenderer } from './StickerRenderer';

const defaultFormData: StickerFormData = {
  materialName: '',
  batchNumber: '',
  openDate: new Date().toISOString().split('T')[0],
  expiryDate: '',
  daysAfterOpen: 30,
  cabinetNumber: '',
  warnDaysBefore: 7,
  style: 'minimal',
};

const styleOptions: { value: StickerStyle; label: string; icon: typeof Palette; desc: string }[] = [
  { value: 'minimal', label: '极简版', icon: Palette, desc: '专业简洁' },
  { value: 'nurse', label: '护士提醒版', icon: Stethoscope, desc: '醒目提醒' },
  { value: 'kids', label: '儿童彩色版', icon: Baby, desc: '卡通可爱' },
];

interface StickerFormProps {
  onSave?: (formData: StickerFormData) => void;
  initialData?: StickerFormData | null;
  onPrint?: (formData: StickerFormData) => void;
}

export function StickerForm({ onSave, initialData, onPrint }: StickerFormProps) {
  const [formData, setFormData] = useState<StickerFormData>(initialData || defaultFormData);
  const computed = useDateCalculator(formData);

  const updateField = <K extends keyof StickerFormData>(key: K, value: StickerFormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const isFormValid = useMemo(() => {
    return formData.materialName.trim() !== '' &&
           formData.openDate !== '' &&
           formData.expiryDate !== '' &&
           formData.daysAfterOpen > 0 &&
           computed !== null;
  }, [formData, computed]);

  const handleSave = () => {
    if (!isFormValid || !onSave) return;
    onSave(formData);
    if (!initialData) {
      setFormData({
        ...defaultFormData,
        openDate: new Date().toISOString().split('T')[0],
        style: formData.style,
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-5">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-2xl">📝</span>材料信息
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">材料名称 *</label>
              <input
                type="text"
                value={formData.materialName}
                onChange={(e) => updateField('materialName', e.target.value)}
                placeholder="例如：流动树脂、氟保护漆、藻酸盐..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">批号</label>
                <input
                  type="text"
                  value={formData.batchNumber}
                  onChange={(e) => updateField('batchNumber', e.target.value)}
                  placeholder="产品批号"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">存放柜号</label>
                <input
                  type="text"
                  value={formData.cabinetNumber}
                  onChange={(e) => updateField('cabinetNumber', e.target.value)}
                  placeholder="如：A-1、3号柜"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">开封日期 *</label>
                <input
                  type="date"
                  value={formData.openDate}
                  onChange={(e) => updateField('openDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">有效期 *</label>
                <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => updateField('expiryDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">开封后可用天数 *</label>
                <input
                  type="number"
                  min="1"
                  value={formData.daysAfterOpen}
                  onChange={(e) => updateField('daysAfterOpen', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">临期前提醒天数</label>
                <input
                  type="number"
                  min="1"
                  value={formData.warnDaysBefore}
                  onChange={(e) => updateField('warnDaysBefore', parseInt(e.target.value) || 7)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-2xl">🎨</span>贴纸样式
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {styleOptions.map((opt) => {
              const Icon = opt.icon;
              const isActive = formData.style === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => updateField('style', opt.value)}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    isActive
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <Icon
                      size={24}
                      className={isActive ? 'text-blue-600' : 'text-gray-500'}
                    />
                    <span className={`text-sm font-medium ${isActive ? 'text-blue-700' : 'text-gray-700'}`}>
                      {opt.label}
                    </span>
                    <span className="text-[10px] text-gray-500">{opt.desc}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-2xl">👁️</span>实时预览
          </h2>

          {computed ? (
            <div className="flex flex-col items-center gap-4">
              <div className="bg-gray-100 rounded-xl p-6 flex items-center justify-center min-h-[240px]">
                <StickerRenderer
                  style={formData.style}
                  formData={formData}
                  computed={computed}
                  size="preview"
                />
              </div>

              <div className="w-full space-y-2 text-sm">
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <span className="text-gray-600">最晚使用日:</span>
                  <span className={`font-bold tabular-nums ${
                    computed.status === 'expired' ? 'text-red-600' :
                    computed.status === 'warning' ? 'text-orange-600' :
                    'text-green-600'
                  }`}>
                    {computed.formattedLatestUseDate}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <span className="text-gray-600">剩余天数:</span>
                  <span className={`font-bold tabular-nums ${
                    computed.status === 'expired' ? 'text-red-600' :
                    computed.status === 'warning' ? 'text-orange-600' :
                    'text-green-600'
                  }`}>
                    {computed.daysRemaining < 0 ? `已过期 ${-computed.daysRemaining} 天` : `${computed.daysRemaining} 天`}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl p-10 text-center text-gray-500">
              <div className="text-4xl mb-2">📋</div>
              <p className="text-sm">请填写完整的材料信息<br />预览将自动显示</p>
            </div>
          )}
        </div>

        {isFormValid && (
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition shadow-sm hover:shadow-md flex items-center justify-center gap-2"
            >
              <span>💾</span>
              保存记录
            </button>
            {onPrint && (
              <button
                onClick={() => onPrint(formData)}
                className="flex-1 px-4 py-3 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-xl transition shadow-sm hover:shadow-md flex items-center justify-center gap-2"
              >
                <span>🖨️</span>
                打印贴纸
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export type { StickerFormData };
