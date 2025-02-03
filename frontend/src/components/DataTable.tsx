import React, { useEffect, useState } from "react";
import {
  useReactTable,
  ColumnDef,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { formatNumber } from "../lib/utils";

export type DailyStat = {
  date: string | null;
  totalproduction: number | string | null;
  totalconsumption: number | string | null;
  avgprice: number | string | null;
  longestnegativestreak: number | string | null;
};

interface DataTableProps {
  data: DailyStat[];
  loading: boolean;
  limit: number;
  onOpenModal: (date: string) => void;
  onSort: (columnId: string) => void;
  orderBy: string;
  order: string;
}

const DataTable: React.FC<DataTableProps> = ({
  data,
  loading,
  limit,
  onOpenModal,
  onSort,
  orderBy,
  order,
}) => {
  const [showSkeleton, setShowSkeleton] = useState(false);

  useEffect(() => {
    let timeout: number;
    if (loading) {
      timeout = window.setTimeout(() => setShowSkeleton(true), 200);
    } else {
      setShowSkeleton(false);
    }
    return () => window.clearTimeout(timeout);
  }, [loading]);

  const columns: ColumnDef<DailyStat>[] = [
    { accessorKey: "date", header: "Date" },
    { accessorKey: "totalconsumption", header: "Total Consumption (MWh)" },
    { accessorKey: "totalproduction", header: "Total Production (MWh)" },
    { accessorKey: "avgprice", header: "Avg Price (€/MWh)" },
    {
      accessorKey: "longestnegativestreak",
      header: "Longest Negative Streak (h)",
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="bg-gray-900 text-white shadow-md rounded-lg">
      <table className="min-w-[670px] w-full text-left border-collapse table-fixed">
        <thead className="bg-gray-800">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="border-b border-gray-700">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-3 cursor-pointer w-1/5 h-[3.0625rem]"
                  onClick={() => onSort(header.column.id)}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                  {orderBy === header.column.id &&
                    (order === "asc" ? " ▲" : " ▼")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {showSkeleton ? (
            Array.from({ length: limit }).map((_, rowIndex) => (
              <tr
                key={`skeleton-${rowIndex}`}
                className="h-[3.0625rem] bg-gray-700 border-b border-gray-700"
              >
                {columns.map((_, colIndex) => (
                  <td
                    key={`skeleton-${rowIndex}-${colIndex}`}
                    className="px-4 py-3 w-1/5 h-[3.0625rem]"
                  >
                    <div className="h-4 w-full bg-gray-500 rounded"></div>
                  </td>
                ))}
              </tr>
            ))
          ) : table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-gray-700 hover:bg-gray-800 h-[3.0625rem]"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 w-1/5 h-[3.0625rem]">
                    {cell.column.id === "date" ? (
                      <button
                        onClick={() => onOpenModal(cell.getValue<string>())}
                        className="text-blue-400 hover:underline"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </button>
                    ) : (
                      flexRender(
                        formatNumber(cell.getValue<number | string | null>()),
                        cell.getContext()
                      )
                    )}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-4 text-gray-400"
              >
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
