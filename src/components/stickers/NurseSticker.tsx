import { AlertTriangle } from 'lucide-react';
import type { StickerProps } from './types';

export function NurseSticker({ formData, computed, size = 'preview' }: StickerProps) {
  const isPrint = size === 'print';
  const headerColor = computed.status === 'expired' ? 'bg-red-600' : computed.status === 'warning' ? 'bg-orange-500' : 'bg-blue-600';

  return (
    <div
      className={`bg-white overflow-hidden border ${isPrint ? 'w-[240px] h-[160px]' : 'w-[300px] h-[200px]'} shadow-sm`}
    >
      <div className={`${headerColor} ${isPrint ? 'px-2 py-1' : 'px-3 py-2'}`}>
        <div className="flex items-center justify-between text-white">
          <span className={`font-bold ${isPrint ? 'text-xs' : 'text-sm'}`}>🦷 牙科材料提醒</span>
          <span className={`font-bold ${isPrint ? 'text-[10px]' : 'text-xs'} bg-white/20 px-2 py-0.5 rounded`}>
            柜号 {formData.cabinetNumber || '-'}
          </span>
        </div>
      </div>

      <div className={`${isPrint ? 'px-2 py-1' : 'px-3 py-2'} flex-1`}>
        <div className={`font-bold text-gray-900 ${isPrint ? 'text-sm' : 'text-base'}`}>
          {formData.materialName || '材料名称'}
        </div>
        <div className={`text-gray-600 ${isPrint ? 'text-[10px]' : 'text-xs'}`}>
          批号 {formData.batchNumber || '-'}
        </div>

        <div className={`my-1 ${isPrint ? 'py-1 px-2' : 'py-2 px-3'} rounded bg-blue-50 border-l-4 ${
          computed.status === 'expired' ? 'border-red-500 bg-red-50' :
          computed.status === 'warning' ? 'border-orange-500 bg-orange-50' :
          'border-blue-500'
        }`}>
          <div className={`text-center ${isPrint ? 'text-[9px]' : 'text-[10px]'} text-gray-500 font-medium`}>
            ⚠️ 请在此日期前使用
          </div>
          <div className={`text-center font-bold tabular-nums ${
            computed.status === 'expired' ? 'text-red-700' :
            computed.status === 'warning' ? 'text-orange-700' :
            'text-blue-800'
          } ${isPrint ? 'text-sm' : 'text-lg'}`}>
            {computed.formattedLatestUseDate}
          </div>
          {computed.daysRemaining >= 0 && (
            <div className={`text-center ${isPrint ? 'text-[9px]' : 'text-[10px]'} ${
              computed.status === 'expired' ? 'text-red-600' :
              computed.status === 'warning' ? 'text-orange-600' :
              'text-blue-600'
            } font-medium`}>
              剩余 {computed.daysRemaining} 天
            </div>
          )}
          {computed.daysRemaining < 0 && (
            <div className={`text-center ${isPrint ? 'text-[9px]' : 'text-[10px]'} text-red-600 font-bold flex items-center justify-center gap-0.5`}>
              <AlertTriangle size={isPrint ? 10 : 12} />
              已过期 {-computed.daysRemaining} 天 禁止使用
            </div>
          )}
        </div>
      </div>

      <div className={`border-t border-gray-200 ${isPrint ? 'px-2 py-1' : 'px-3 py-2'} bg-gray-50`}>
        <div className={`flex justify-between items-end ${isPrint ? 'text-[9px]' : 'text-[10px]'} text-gray-500`}>
          <div>
            <span>开封日 {formData.openDate || '-'}</span>
            <span className="mx-1">·</span>
            <span>{formData.daysAfterOpen || 0}天内用完</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="whitespace-nowrap">护士签字:</span>
            <span className="border-b border-gray-400 w-10 inline-block"></span>
          </div>
        </div>
      </div>
    </div>
  );
}
