import Skeleton from './Skeleton.jsx';
import EmptyState from './EmptyState.jsx';
import Button from './Button.jsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Table = ({
  headers = [],
  rows = [],
  columns = [],
  data = [],
  loading = false,
  emptyMessage,
  emptyTitle,
  renderRow,
  pagination = null,
}) => {
  const showPagination = pagination && pagination.totalPages > 1;

  // Support both APIs: columns/data (new) and headers/rows/renderRow (old)
  const useColumnsApi = columns.length > 0;
  const tableHeaders = useColumnsApi ? columns.map(c => c.header) : headers;
  const tableData = useColumnsApi ? data : rows;

  const renderColumnsRow = (row, index) => (
    <tr key={row._id || index} className="border-b border-primary-100 dark:border-slate-800 last:border-0">
      {columns.map((col, cIdx) => {
        const val = col.key.split('.').reduce((obj, k) => obj?.[k], row);
        return (
          <td key={cIdx} className={`px-6 py-4 text-[14px] ${cIdx === columns.length - 1 ? 'text-right pr-10' : ''}`}>
            {col.render ? col.render(val, row) : (val ?? '—')}
          </td>
        );
      })}
    </tr>
  );

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="w-full overflow-x-auto rounded-2xl border border-primary-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <table className="w-full border-collapse text-left text-sm text-primary-600 dark:text-slate-300">
          <thead className="bg-primary-50 dark:bg-slate-800/50 text-xs font-semibold text-primary-500 dark:text-slate-400 uppercase tracking-wider border-b border-primary-200 dark:border-slate-800">
            <tr>
              {tableHeaders.map((h, i) => (
                <th key={i} className={`px-6 py-4 text-[13px] font-bold ${i === tableHeaders.length - 1 ? 'text-right pr-10' : ''}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-primary-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
            {loading ? (
              Array.from({ length: pagination?.limit || 5 }).map((_, rIdx) => (
                <tr key={rIdx}>
                  {tableHeaders.map((_, cIdx) => (
                    <td key={cIdx} className={`px-6 py-4 text-[14px] ${cIdx === tableHeaders.length - 1 ? 'text-right pr-10' : ''}`}>
                      <Skeleton variant="text" className="h-4" />
                    </td>
                  ))}
                </tr>
              ))
            ) : tableData.length === 0 ? (
              <tr>
                <td colSpan={tableHeaders.length} className="px-6 py-12">
                  <EmptyState 
                    title={emptyTitle || 'No data available'} 
                    description={emptyMessage || 'No matching items were found in the database.'}
                  />
                </td>
              </tr>
            ) : useColumnsApi ? (
              tableData.map((row, index) => renderColumnsRow(row, index))
            ) : (
              tableData.map((row, index) => renderRow(row, index))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      {showPagination && !loading && (
        <div className="flex items-center justify-between px-4 py-2.5 border border-primary-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900">
          <div className="text-xs text-primary-500 dark:text-slate-400">
            Showing <span className="font-semibold text-primary-800 dark:text-slate-200">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
            <span className="font-semibold text-primary-800 dark:text-slate-200">
              {Math.min(pagination.page * pagination.limit, pagination.totalCount)}
            </span>{' '}
            of <span className="font-semibold text-primary-800 dark:text-slate-200">{pagination.totalCount}</span> entries
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page <= 1}
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              icon={<ChevronLeft size={14} />}
              className="p-2 min-w-0"
            />
            <span className="text-xs text-primary-600 font-semibold px-2">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              icon={<ChevronRight size={14} />}
              className="p-2 min-w-0"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
