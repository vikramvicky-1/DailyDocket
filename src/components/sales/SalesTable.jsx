"use client";

import { useState } from "react";
import {
  LuPencil,
  LuTrash2,
  LuDownload,
  LuChevronUp,
  LuChevronDown,
} from "react-icons/lu";
import { GoTriangleUp, GoTriangleDown } from "react-icons/go";
import { TbEdit } from "react-icons/tb";

const SalesTable = ({ salesData = [] }) => {
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedData = [...salesData].sort((a, b) => {
    if (!sortField) return 0;

    let aVal = a[sortField];
    let bVal = b[sortField];

    if (sortDirection === "asc") {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  const totalSales = salesData.reduce(
    (sum, item) => sum + (item.totalSales || 0),
    0
  );

  const columns = [
    { key: "date", label: "Date", sortable: true },
    { key: "time", label: "Time", sortable: true },
    { key: "opening", label: "Opening", sortable: true },
    { key: "purchase", label: "Purchase", sortable: true },
    { key: "onlinePayment", label: "Online", sortable: true },
    { key: "cashPayment", label: "Physical", sortable: true },
    { key: "transferred", label: "Transferred", sortable: true },
    { key: "closing", label: "Closing", sortable: true },
    { key: "attachment", label: "Attachment", sortable: false },
    { key: "totalSales", label: "Total Sales", sortable: true },
    { key: "actions", label: "Actions", sortable: false },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Table Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
        <h2 className="text-lg sm:text-xl font-semibold text-text-primary">
          Sales Data
        </h2>
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="text-text-primary">
            <span className="text-sm sm:text-lg font-medium">
              Total Sales:{" "}
            </span>
            <span className="text-lg sm:text-xl font-bold text-green">
              {formatCurrency(totalSales)}
            </span>
          </div>
          <button className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors text-sm">
            <LuDownload size={16} />
            <span>Export Excel</span>
          </button>
        </div>
      </div>

      {/* Single Responsive Table Container for All Screens */}
      <div className="overflow-x-auto">
        <div className="min-w-auto">
          {/* Table Header */}
          <div className="grid grid-cols-11 gap-4 p-4 border-b border-gray-600 bg-form-bg rounded-tl-xl rounded-tr-xl">
            {columns.map((column) => (
              <div
                key={column.key}
                className={`text-left text-text-primary text-[11px] font-medium sm:text-[13px] ${
                  column.sortable ? "cursor-pointer hover:text-accent" : ""
                } ${column.key === "actions" ? "text-center" : ""}`}
                onClick={
                  column.sortable ? () => handleSort(column.key) : undefined
                }
              >
                <div className="flex items-center justify-between whitespace-nowrap">
                  <span className="min-w-0">{column.label}</span>
                  {column.sortable && (
                    <div className="flex flex-col justify-center ml-2 flex-shrink-0">
                      <GoTriangleUp
                        size={13}
                        className={`${
                          sortField === column.key && sortDirection === "asc"
                            ? "text-accent"
                            : "text-gray-500"
                        }`}
                      />
                      <GoTriangleDown
                        size={13}
                        className={`-mt-0.5 ${
                          sortField === column.key && sortDirection === "desc"
                            ? "text-accent"
                            : "text-gray-500"
                        }`}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Table Body */}
          <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
            {sortedData.length > 0 ? (
              sortedData.map((row, index) => (
                <div
                  key={index}
                  className="grid grid-cols-11 gap-4 p-4 border-b border-gray-700 hover:bg-secondary/50 transition-colors"
                >
                  <div className="text-text-primary text-xs sm:text-sm whitespace-nowrap">
                    {formatDate(row.date)}
                  </div>
                  <div className="text-text-primary text-xs sm:text-sm whitespace-nowrap">
                    {formatTime(row.date)}
                  </div>
                  <div className="text-text-primary text-xs sm:text-sm whitespace-nowrap">
                    {formatCurrency(row.opening)}
                  </div>
                  <div className="text-text-primary text-xs sm:text-sm whitespace-nowrap">
                    {formatCurrency(row.purchase)}
                  </div>
                  <div className="text-text-primary text-xs sm:text-sm whitespace-nowrap">
                    {formatCurrency(row.onlinePayment)}
                  </div>
                  <div className="text-text-primary text-xs sm:text-sm whitespace-nowrap">
                    {formatCurrency(row.cashPayment)}
                  </div>
                  <div className="text-text-primary text-xs sm:text-sm whitespace-nowrap">
                    {formatCurrency(row.transferred)}
                  </div>
                  <div className="text-text-primary text-xs sm:text-sm whitespace-nowrap">
                    {formatCurrency(row.closing)}
                  </div>
                  <div className="text-text-primary text-xs sm:text-sm whitespace-nowrap">
                    {row.attachment || "No file"}
                  </div>
                  <div className="font-medium text-green text-xs sm:text-sm whitespace-nowrap">
                    + {formatCurrency(row.totalSales)}
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <button className="p-1.5 hover:bg-hover rounded transition-colors text-text-primary hover:text-white">
                        <TbEdit size={14} />
                      </button>
                      <button className="p-1.5 hover:bg-red/20 rounded transition-colors text-text-primary hover:text-red">
                        <LuTrash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 sm:p-8 text-center text-text-primary">
                No sales data available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesTable;
