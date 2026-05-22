import React from 'react';

export interface AdminTableColumn<T> {
  key: string;
  label: string;
  render: (row: T) => React.ReactNode;
  className?: string;
}

export interface AdminTableProps<T> {
  rows: T[];
  columns: AdminTableColumn<T>[];
  emptyLabel?: string;
}

export default function AdminTable<T>({
  rows,
  columns,
  emptyLabel = 'NO ROWS',
}: AdminTableProps<T>) {
  if (rows.length === 0) {
    return (
      <div className="border border-white/10 rounded-sm bg-[#0B0B0B] px-4 py-8 text-center">
        <span className="text-[11px] uppercase tracking-[0.12em] text-white/45">
          {emptyLabel}
        </span>
      </div>
    );
  }
  return (
    <div className="border border-white/10 rounded-sm bg-[#0B0B0B] overflow-x-auto">
      <table className="w-full text-[12px]">
        <thead>
          <tr className="border-b border-white/10">
            {columns.map((c) => (
              <th
                key={c.key}
                className={`text-left px-3 py-2 text-[9.5px] uppercase tracking-[0.14em] text-white/55 font-medium ${c.className ?? ''}`}
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr
              key={i}
              className="border-b border-white/[0.05] last:border-b-0 hover:bg-white/[0.02]"
            >
              {columns.map((c) => (
                <td
                  key={c.key}
                  className={`px-3 py-2 text-white/85 tabular-nums ${c.className ?? ''}`}
                >
                  {c.render(r)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
