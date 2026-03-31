import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { EmptyState } from './EmptyState';

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (row: T) => void;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function DataTable<T extends { id?: string }>({
  data,
  columns,
  onRowClick,
  emptyTitle = 'No data found',
  emptyDescription,
}: DataTableProps<T>) {
  if (data.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="surface-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            {columns.map((col, i) => (
              <TableHead key={i} className={`text-xs font-semibold uppercase tracking-wider text-muted-foreground ${col.className || ''}`}>
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, rowIndex) => (
            <motion.tr
              key={(row as any).id || rowIndex}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: rowIndex * 0.03, duration: 0.2 }}
              onClick={() => onRowClick?.(row)}
              className={`border-border ${onRowClick ? 'cursor-pointer hover:bg-muted/50' : ''} transition-colors`}
            >
              {columns.map((col, colIndex) => (
                <TableCell key={colIndex} className={`text-sm ${col.className || ''}`}>
                  {col.cell ? col.cell(row) : String((row as any)[col.accessorKey] ?? '')}
                </TableCell>
              ))}
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
