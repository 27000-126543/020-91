import type { StickerProps } from './types';

export function KidsSticker({ formData, computed, size = 'preview' }: StickerProps) {
  const isPrint = size === 'print';
  const statusEmoji = computed.status === 'expired' ? '😵' : computed.status === 'warning' ? '⚠️' : '😊';
  const gradientClass = computed.status === 'expired'
    ? 'bg-gradient-to-br from-red-100 to-pink-200'
    : computed.status === 'warning'
      ? 'bg-gradient-to-br from-yellow-100 to-orange-200'
      : 'bg-gradient-to-br from-sky-100 to-teal-100';
  const borderClass = computed.status === 'expired'
    ? 'border-red-400'
    : computed.status === 'warning'
      ? 'border-orange-400'
      : 'border-teal-400';

  return (
    <div
      className={`${gradientClass} border-4 ${borderClass} rounded-2xl overflow-hidden ${
        isPrint ? 'w-[240px] h-[160px]' : 'w-[300px] h-[200px]'
      } relative`}
    >
      <div className="absolute top-1 right-2 text-2xl opacity-60 select-none pointer-events-none">🦷</div>
      <div className="absolute bottom-1 left-2 text-xl opacity-40 select-none pointer-events-none">✨</div>
      <div className="absolute top-8 left-3 text-sm opacity-30 select-none pointer-events-none">⭐</div>
      <div className="absolute bottom-6 right-3 text-sm opacity-30 select-none pointer-events-none">🌟</div>

      <div className={`h-full flex flex-col justify-between ${isPrint ? 'p-2' : 'p-3'} relative z-10`}>
        <div className="flex items-start justify-between">
          <div>
            <div className={`font-extrabold text-gray-800 ${isPrint ? 'text-sm' : 'text-base'} drop-shadow-sm`}>
              {formData.materialName || '材料名称'}
            </div>
            <div className={`text-gray-600 font-medium ${isPrint ? 'text-[10px]' : 'text-xs'}`}>
              📦 批号: {formData.batchNumber || '-'}
            </div>
          </div>
          <span className={`${isPrint ? 'text-2xl' : 'text-3xl'}`}>{statusEmoji}</span>
        </div>

        <div className={`text-center rounded-xl py-1 px-2 ${
          computed.status === 'expired' ? 'bg-red-500/90' :
          computed.status === 'warning' ? 'bg-orange-500/90' :
          'bg-teal-500/90'
        } text-white`}>
          <div className={`${isPrint ? 'text-[9px]' : 'text-[10px]'} font-bold opacity-90`}>
            📅 最晚使用日
          </div>
          <div className={`font-black tabular-nums ${isPrint ? 'text-sm' : 'text-lg'}`}>
            {computed.formattedLatestUseDate}
          </div>
          <div className={`${isPrint ? 'text-[9px]' : 'text-[10px]'} font-medium opacity-95`}>
            {computed.daysRemaining < 0
              ? `已过期 ${-computed.daysRemaining} 天 不能用啦！`
              : computed.daysRemaining === 0
                ? '今天一定要用完哦！'
                : `还有 ${computed.daysRemaining} 天`
            }
          </div>
        </div>

        <div className={`flex justify-between items-end ${isPrint ? 'text-[9px]' : 'text-[10px]'} text-gray-700 font-medium`}>
          <div>
            <div>🗓️ 开封: {formData.openDate || '-'}</div>
            <div>⏱️ {formData.daysAfterOpen || 0}天内用完</div>
          </div>
          <div className="text-center">
            <div className="bg-white/70 rounded-lg px-2 py-0.5">
              <div className="text-[9px] text-gray-500">存放柜</div>
              <div className="font-black text-teal-700">{formData.cabinetNumber || '-'}</div>
            </div>
          </div>
        </div>

        <div className={`text-center ${isPrint ? 'text-[8px]' : 'text-[9px]'} font-bold text-gray-600 bg-white/50 rounded-full py-0.5`}>
          🔔 临期前{formData.warnDaysBefore}天请检查，过期不要用哦～
        </div>
      </div>
    </div>
  );
}
