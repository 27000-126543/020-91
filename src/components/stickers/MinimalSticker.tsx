import type { StickerProps } from './types';

export function MinimalSticker({ formData, computed, size = 'preview' }: StickerProps) {
  const isPrint = size === 'print';
  const statusText = computed.status === 'expired' ? '已过期' : computed.status === 'warning' ? '临期注意' : '';

  return (
    <div
      className={`bg-white border-2 border-gray-800 overflow-hidden ${
        isPrint ? 'w-[240px] h-[160px] p-2' : 'w-[300px] h-[200px] p-3'
      }`}
    >
      <div className="h-full flex flex-col justify-between">
        <div>
          <div className={`font-bold text-gray-900 flex justify-between items-start ${isPrint ? 'text-sm' : 'text-base'}`}>
            <span className="truncate max-w-[70%]">{formData.materialName || '材料名称'}</span>
            {statusText && (
              <span className={`px-1.5 py-0.5 text-xs font-bold border ${
                computed.status === 'expired' ? 'text-red-600 border-red-600' : 'text-orange-600 border-orange-600'
              }`}>
                {statusText}
              </span>
            )}
          </div>
          <div className={`text-gray-600 mt-1 ${isPrint ? 'text-[10px]' : 'text-xs'}`}>
            批号: {formData.batchNumber || '-'}
          </div>
        </div>

        <div className="border-t border-b border-gray-400 py-1 my-1 text-center">
          <div className={`${isPrint ? 'text-[10px]' : 'text-xs'} text-gray-500`}>最晚使用日</div>
          <div className={`font-bold text-gray-900 tabular-nums ${isPrint ? 'text-base' : 'text-xl'}`}>
            {computed.formattedLatestUseDate}
          </div>
        </div>

        <div className={`grid grid-cols-2 gap-x-2 gap-y-0.5 ${isPrint ? 'text-[10px]' : 'text-xs'}`}>
          <div className="text-gray-500">开封日: <span className="text-gray-800">{formData.openDate || '-'}</span></div>
          <div className="text-gray-500">柜号: <span className="text-gray-800 font-medium">{formData.cabinetNumber || '-'}</span></div>
          <div className="text-gray-500">开封后: <span className="text-gray-800">{formData.daysAfterOpen || 0}天内</span></div>
          <div className="text-gray-500">效期: <span className="text-gray-800">{formData.expiryDate || '-'}</span></div>
        </div>

        <div className={`text-center text-gray-500 border-t border-dashed border-gray-300 pt-1 ${isPrint ? 'text-[9px]' : 'text-[10px]'}`}>
          临期前{formData.warnDaysBefore}天请检查 · 过期禁用
        </div>
      </div>
    </div>
  );
}
