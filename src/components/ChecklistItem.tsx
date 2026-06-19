import { Pencil, Trash2, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import type { StickerRecord } from '@/types';
import { getStatusInfo } from '@/hooks/useDateCalculator';
import { getDaysDiff, getTodayStr, formatDateDisplay } from '@/utils/dateUtils';

interface ChecklistItemProps {
  record: StickerRecord;
  onEdit: (record: StickerRecord) => void;
  onDelete: (id: string) => void;
}

export function ChecklistItem({ record, onEdit, onDelete }: ChecklistItemProps) {
  const today = getTodayStr();
  const daysRemaining = getDaysDiff(today, record.latestUseDate);
  let status = 'normal';
  if (daysRemaining < 0) status = 'expired';
  else if (daysRemaining <= record.warnDaysBefore) status = 'warning';

  const statusInfo = getStatusInfo(status as any);

  const StatusIcon = status === 'expired' ? AlertTriangle : status === 'warning' ? Clock : CheckCircle;

  return (
    <div className={`bg-white rounded-xl border-l-4 ${statusInfo.borderColor} shadow-sm hover:shadow-md transition p-4`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-gray-900 truncate">{record.materialName}</h3>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.color}`}>
              <StatusIcon size={12} />
              {statusInfo.label}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-gray-600 mt-2">
            <div>
              <span className="text-gray-400">批号: </span>
              <span className="font-medium text-gray-700">{record.batchNumber || '-'}</span>
            </div>
            <div>
              <span className="text-gray-400">柜号: </span>
              <span className="font-medium text-gray-700">{record.cabinetNumber || '-'}</span>
            </div>
            <div>
              <span className="text-gray-400">开封日: </span>
              <span className="font-medium text-gray-700">{record.openDate || '-'}</span>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-3">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${statusInfo.bgColor}`}>
              <span className="text-xs text-gray-500">最晚使用日</span>
              <span className={`font-bold tabular-nums ${statusInfo.color}`}>
                {formatDateDisplay(record.latestUseDate)}
              </span>
            </div>
            <div className={`text-sm font-bold tabular-nums ${statusInfo.color}`}>
              {daysRemaining < 0
                ? `已过期 ${-daysRemaining} 天`
                : daysRemaining === 0
                  ? '今天到期'
                  : `剩余 ${daysRemaining} 天`
              }
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1.5 shrink-0">
          <button
            onClick={() => onEdit(record)}
            className="p-2 rounded-lg text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition"
            title="编辑"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => {
              if (confirm(`确定删除「${record.materialName}」的记录吗？`)) {
                onDelete(record.id);
              }
            }}
            className="p-2 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 transition"
            title="删除"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
