import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Filter, Trash2, Printer, AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import { useStickerStore } from '@/store';
import { ChecklistItem } from '@/components/ChecklistItem';
import type { StickerRecord, StickerFormData } from '@/types';
import { PrintLayoutFromRecord } from '@/components/PrintLayout';
import { StickerForm } from '@/components/StickerForm';
import { getDaysDiff, getTodayStr } from '@/utils/dateUtils';

type FilterType = 'all' | 'expired' | 'warning' | 'normal';

const filterTabs: { value: FilterType; label: string; icon: typeof AlertTriangle }[] = [
  { value: 'all', label: '全部', icon: Filter },
  { value: 'expired', label: '已过期', icon: AlertTriangle },
  { value: 'warning', label: '临期', icon: Clock },
  { value: 'normal', label: '正常', icon: CheckCircle },
];

export function ChecklistPage() {
  const records = useStickerStore((s) => s.getSortedRecords());
  const deleteRecord = useStickerStore((s) => s.deleteRecord);
  const deleteExpiredRecords = useStickerStore((s) => s.deleteExpiredRecords);
  const updateRecord = useStickerStore((s) => s.updateRecord);

  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [editingRecord, setEditingRecord] = useState<StickerRecord | null>(null);
  const [printingRecord, setPrintingRecord] = useState<StickerRecord | null>(null);

  const filteredRecords = useMemo(() => {
    const today = getTodayStr();
    return records.filter((r) => {
      const daysRemaining = getDaysDiff(today, r.latestUseDate);
      let status: FilterType = 'normal';
      if (daysRemaining < 0) status = 'expired';
      else if (daysRemaining <= r.warnDaysBefore) status = 'warning';

      if (activeFilter === 'all') return true;
      return status === activeFilter;
    });
  }, [records, activeFilter]);

  const stats = useMemo(() => {
    const today = getTodayStr();
    let expired = 0, warning = 0, normal = 0;
    records.forEach((r) => {
      const daysRemaining = getDaysDiff(today, r.latestUseDate);
      if (daysRemaining < 0) expired++;
      else if (daysRemaining <= r.warnDaysBefore) warning++;
      else normal++;
    });
    return { expired, warning, normal, total: records.length };
  }, [records]);

  const handleEditSave = (formData: StickerFormData) => {
    if (!editingRecord) return;
    updateRecord(editingRecord.id, formData);
    setEditingRecord(null);
  };

  if (editingRecord) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="mb-4">
          <button
            onClick={() => setEditingRecord(null)}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            ← 返回清单
          </button>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <span className="text-3xl">✏️</span>编辑记录
        </h2>
        <StickerForm
          initialData={editingRecord}
          onSave={handleEditSave}
          onPrint={() => setPrintingRecord(editingRecord)}
        />
        {printingRecord && (
          <PrintLayoutFromRecord
            record={printingRecord}
            onClose={() => setPrintingRecord(null)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span className="text-3xl">📋</span>今日检查清单
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            按到期时间排序，每天开诊前快速核对材料状态
          </p>
        </div>
        <div className="flex items-center gap-2">
          {stats.expired > 0 && (
            <button
              onClick={() => {
                if (confirm(`确定清理所有 ${stats.expired} 条已过期记录吗？`)) {
                  deleteExpiredRecords();
                }
              }}
              className="px-3 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition flex items-center gap-1.5 text-sm font-medium"
            >
              <Trash2 size={16} />
              清理过期
            </button>
          )}
          <Link
            to="/"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition flex items-center gap-1.5 text-sm font-medium shadow-sm"
          >
            <Plus size={16} />
            新增贴纸
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="text-xs text-gray-500">总记录数</div>
          <div className="text-2xl font-bold text-gray-800 mt-1 tabular-nums">{stats.total}</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="text-xs text-gray-500">正常</div>
          <div className="text-2xl font-bold text-green-600 mt-1 tabular-nums">{stats.normal}</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="text-xs text-gray-500">临期</div>
          <div className="text-2xl font-bold text-orange-600 mt-1 tabular-nums">{stats.warning}</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="text-xs text-gray-500">已过期</div>
          <div className="text-2xl font-bold text-red-600 mt-1 tabular-nums">{stats.expired}</div>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4 overflow-x-auto">
        {filterTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeFilter === tab.value;
          const count = tab.value === 'all' ? stats.total :
            tab.value === 'expired' ? stats.expired :
            tab.value === 'warning' ? stats.warning : stats.normal;
          return (
            <button
              key={tab.value}
              onClick={() => setActiveFilter(tab.value)}
              className={`px-4 py-2 rounded-lg flex items-center gap-1.5 text-sm font-medium whitespace-nowrap transition ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <Icon size={14} />
              {tab.label}
              <span className={`text-xs px-1.5 py-0.5 rounded ${
                isActive ? 'bg-white/20' : 'bg-gray-100'
              } tabular-nums`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {filteredRecords.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-16 text-center">
          <div className="text-6xl mb-4">
            {activeFilter === 'all' ? '📦' : activeFilter === 'expired' ? '✅' : '🧪'}
          </div>
          <h3 className="text-lg font-bold text-gray-700 mb-2">
            {activeFilter === 'all' ? '还没有任何记录' :
             activeFilter === 'expired' ? '没有已过期的材料，做得好！' :
             activeFilter === 'warning' ? '暂无临期材料' : '暂无正常状态的材料'}
          </h3>
          <p className="text-gray-500 text-sm mb-6">
            {activeFilter === 'all'
              ? '点击右上角「新增贴纸」开始记录牙科材料'
              : '当前筛选条件下暂无数据'}
          </p>
          {activeFilter === 'all' && (
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition shadow-sm"
            >
              <Plus size={18} />
              立即添加
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredRecords.map((record) => (
            <div key={record.id} className="flex items-start gap-3">
              <div className="flex-1">
                <ChecklistItem
                  record={record}
                  onEdit={setEditingRecord}
                  onDelete={deleteRecord}
                />
              </div>
              <button
                onClick={() => setPrintingRecord(record)}
                className="p-3 bg-white rounded-xl shadow-sm border border-gray-200 text-gray-600 hover:text-blue-600 hover:border-blue-300 transition"
                title="打印贴纸"
              >
                <Printer size={18} />
              </button>
            </div>
          ))}
        </div>
      )}

      {printingRecord && (
        <PrintLayoutFromRecord
          record={printingRecord}
          onClose={() => setPrintingRecord(null)}
        />
      )}
    </div>
  );
}
