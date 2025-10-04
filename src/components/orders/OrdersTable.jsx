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

const OrdersTable = ({ ordersData = [] }) => {
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

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedData = [...ordersData].sort((a, b) => {
    if (!sortField) return 0;

    let aVal = a[sortField];
    let bVal = b[sortField];

    if (sortDirection === "asc") {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  const totalOrders = ordersData.length;

  const getStatusBadge = (status) => {
    const statusConfig = {
      "Order Received": { bg: "bg-blue-600", text: "text-white" },
      "Out for Delivery": { bg: "bg-orange-600", text: "text-white" },
      Cancelled: { bg: "bg-red-600", text: "text-white" },
      Completed: { bg: "bg-green-600", text: "text-white" },
    };

    const config = statusConfig[status] || {
      bg: "bg-gray-600",
      text: "text-white",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
      >
        {status}
      </span>
    );
  };

  const getAttachmentDisplay = (attachment, type = "bill") => {
    if (attachment) {
      return (
        <span className="text-accent text-xs cursor-pointer hover:underline">
          {type === "bill" ? "Total Bill" : "Payment"}
        </span>
      );
    }
    return <span className="text-gray-400 text-xs">No file</span>;
  };

  const columns = [
    { key: "orderId", label: "Order ID", sortable: true },
    { key: "date", label: "Date", sortable: true },
    { key: "customerName", label: "Customer Name", sortable: false },
    { key: "deliveryDate", label: "Delivery Date", sortable: true },
    { key: "paymentMode", label: "Payment Mode", sortable: false },
    { key: "billAttachment", label: "Bill", sortable: false },
    { key: "paymentAttachment", label: "Payment", sortable: false },
    { key: "status", label: "Status", sortable: true },
    { key: "totalAmount", label: "Total Amount", sortable: true },
    { key: "actions", label: "Actions", sortable: false },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Table Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
        <h2 className="text-lg sm:text-xl font-semibold text-text-primary">
          Orders Data
        </h2>
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="text-text-primary">
            <span className="text-sm sm:text-lg font-medium">
              Total Orders:{" "}
            </span>
            <span className="text-lg sm:text-xl font-bold text-accent">
              {totalOrders}
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
          <div className="grid grid-cols-10 gap-4 p-4 border-b border-gray-600 bg-form-bg rounded-tl-xl rounded-tr-xl">
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
                  className="grid grid-cols-10 gap-4 p-4 border-b border-gray-700 hover:bg-secondary/50 transition-colors"
                >
                  <div className="text-text-primary text-xs sm:text-sm whitespace-nowrap">
                    {row.orderId}
                  </div>
                  <div className="text-text-primary text-sm sm:text-sm">
                    {formatDate(row.date)}
                  </div>
                  <div className="text-text-primary text-sm sm:text-sm">
                    {row.customerName}
                  </div>
                  <div className="text-text-primary text-sm sm:text-sm w-auto">
                    {formatDate(row.deliveryDate)}
                  </div>
                  <div className="text-text-primary text-sm sm:text-sm">
                    {row.paymentMode}
                  </div>
                  <div className="text-text-primary text-xs sm:text-sm">
                    {getAttachmentDisplay(row.billAttachment, "bill")}
                  </div>
                  <div className="text-text-primary text-xs sm:text-sm whitespace-nowrap">
                    {getAttachmentDisplay(row.paymentAttachment, "payment")}
                  </div>
                  <div className="text-text-primary text-xs sm:text-sm whitespace-nowrap">
                    {getStatusBadge(row.status)}
                  </div>
                  <div className="font-medium text-green text-xs sm:text-sm whitespace-nowrap">
                    {formatCurrency(row.totalAmount)}
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
                No orders data available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersTable;
