"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  LuPencil,
  LuTrash2,
  LuDownload,
  LuChevronUp,
  LuChevronDown,
  LuX,
} from "react-icons/lu";
import { GoTriangleUp, GoTriangleDown } from "react-icons/go";
import { TbEdit } from "react-icons/tb";
import { CgExport } from "react-icons/cg";
import { FaFileExcel } from "react-icons/fa";
import { FaFilePdf } from "react-icons/fa6";
import OrderMobileCard from "./OrderMobileCard";

const OrdersTable = ({ ordersData = [] }) => {
  const router = useRouter();
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");
  const [showExportDialog, setShowExportDialog] = useState(false);

  // --- Helper Functions ---
  const formatCurrency = (amount) => `₹${(amount || 0).toLocaleString()}`;
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });

  // --- Sorting Logic ---
  const handleSort = (field) => {
    const isAsc = sortField === field && sortDirection === "asc";
    setSortDirection(isAsc ? "desc" : "asc");
    setSortField(field);
  };

  const sortedData = [...ordersData].sort((a, b) => {
    if (!sortField) return 0;
    const aVal = a[sortField];
    const bVal = b[sortField];
    if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const totalOrders = ordersData.length;

  // --- Export Functions ---
  const handleExportClick = () => {
    setShowExportDialog(true);
  };

  const handleCloseDialog = () => {
    setShowExportDialog(false);
  };

  const handleExportExcel = () => {
    // TODO: Implement Excel export logic
    console.log("Exporting orders to Excel...");
    setShowExportDialog(false);
  };

  const handleExportPdf = () => {
    // TODO: Implement PDF export logic
    console.log("Exporting orders to PDF...");
    setShowExportDialog(false);
  };

  // Handle edit functionality
  const handleEdit = (row, index) => {
    // In real app, you would use the actual order ID
    const orderId = row.orderId || index + 1; // Using orderId or index+1 as mock ID
    router.push(`/orders/edit/${orderId}`);
  };

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
    { key: "orderId", label: "Order ID" },
    { key: "date", label: "Date" },
    { key: "customerName", label: "Customer Name" },
    { key: "deliveryDate", label: "Delivery Date" },
    { key: "paymentMode", label: "Payment Mode" },
    { key: "billAttachment", label: "Bill" },
    { key: "paymentAttachment", label: "Payment" },
    { key: "status", label: "Status" },
    { key: "totalAmount", label: "Total Amount" },
    { key: "actions", label: "Actions" },
  ];

  return (
    <div className="bg-secondary max-sm:p-2 rounded-xl flex flex-col h-full">
      {/* 1. STATIC HEADER SECTION: This part will NOT scroll. */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0 pb-4">
        {/* Small screens: heading and export on same line */}
        <div className="flex items-center justify-between sm:hidden">
          <h2 className="text-lg font-semibold text-text-primary">
            Orders Data
          </h2>
          <button
            onClick={handleExportClick}
            className="flex items-center cursor-pointer space-x-2 px-3 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors text-sm"
          >
            <CgExport size={18} />
            <span>Export</span>
          </button>
        </div>

        {/* Large screens: original layout */}
        <h2 className="hidden sm:block text-lg sm:text-xl font-semibold text-text-primary">
          Orders Data
        </h2>
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="text-text-primary">
            <span className="text-sm sm:text-lg font-medium">
              Total Orders:{" "}
            </span>
            <span className="text-lg sm:text-xl font-bold text-green-400">
              {totalOrders}
            </span>
          </div>
          <button
            onClick={handleExportClick}
            className="hidden sm:flex items-center cursor-pointer space-x-2 px-3 sm:px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors text-sm"
          >
            <CgExport size={18} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* 2. SCROLLABLE CONTENT AREA: This container will scroll. */}
      <div className="flex-1 overflow-y-auto custom-scrollbar max-h-[500px] md:max-h-[500px] lg:max-h-[450px]">
        {/* Table Header (Visible on large screens only, STICKY) */}
        <div className="hidden lg:grid grid-cols-10 gap-4 p-4 border-b border-secondary bg-form-bg rounded-t-lg sticky top-0 z-10">
          {columns.map((column) => (
            <div
              key={column.key}
              className={`text-left text-text-primary/70 text-[14px] font-[400] ${
                column.key !== "actions"
                  ? "cursor-pointer hover:text-accent"
                  : ""
              }`}
              onClick={() => column.key !== "actions" && handleSort(column.key)}
            >
              <div className="flex items-center">
                <span>{column.label}</span>

                <div className="flex flex-col ml-1">
                  <GoTriangleUp
                    size={12}
                    className={
                      sortField === column.key && sortDirection === "asc"
                        ? "text-accent"
                        : "text-gray-600"
                    }
                  />
                  <GoTriangleDown
                    size={12}
                    className={`-mt-1 ${
                      sortField === column.key && sortDirection === "desc"
                        ? "text-accent"
                        : "text-gray-600"
                    }`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Card Layout for small screens */}
        <div className="lg:hidden space-y-4">
          {sortedData.length > 0 ? (
            sortedData.map((row, index) => (
              <OrderMobileCard
                key={index}
                order={row}
                index={index}
                onEdit={handleEdit}
                onDelete={(order) =>
                  console.log("Delete order:", order.orderId)
                }
              />
            ))
          ) : (
            <div className="p-8 text-center text-text-primary/60 bg-secondary rounded-b-lg">
              No orders data available
            </div>
          )}
        </div>

        {/* Table Body for large screens */}
        <div className="hidden lg:block space-y-0">
          {sortedData.length > 0 ? (
            sortedData.map((row, index) => (
              <div
                key={index}
                className="grid grid-cols-10 gap-4 p-4 border-b border-gray-600/60 bg-transparent text-sm text-text-primary"
              >
                <div>{row.orderId}</div>
                <div>{formatDate(row.date)}</div>
                <div>{row.customerName}</div>
                <div>{formatDate(row.deliveryDate)}</div>
                <div>{row.paymentMode}</div>
                <div title={row.billAttachment || "No file"}>
                  {getAttachmentDisplay(row.billAttachment, "bill")}
                </div>
                <div title={row.paymentAttachment || "No file"}>
                  {getAttachmentDisplay(row.paymentAttachment, "payment")}
                </div>
                <div>{getStatusBadge(row.status)}</div>
                <div className="font-medium text-green-400">
                  +{formatCurrency(row.totalAmount)}
                </div>
                <div className="flex items-center justify-start">
                  <button
                    onClick={() => handleEdit(row, index)}
                    className="p-1.5 cursor-pointer hover:text-blue-700 hover:bg-hover rounded transition-colors"
                    title="Edit"
                  >
                    <TbEdit size={17} />
                  </button>
                  <button
                    className="p-1.5 hover:text-red cursor-pointer hover:bg-hover rounded transition-colors"
                    title="Delete"
                  >
                    <LuTrash2 size={17} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-text-primary/60 bg-secondary rounded-b-lg">
              No orders data available
            </div>
          )}
        </div>
      </div>

      {/* Export Confirmation Dialog */}
      {showExportDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-secondary border border-gray-600/60 rounded-lg p-6 w-80 max-w-[90vw] relative">
            {/* Close Button */}
            <button
              onClick={handleCloseDialog}
              className="absolute top-3 right-3 p-1 hover:bg-tertiary rounded-full transition-colors"
              title="Close"
            >
              <LuX size={16} className="text-text-primary cursor-pointer" />
            </button>

            {/* Dialog Content */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-text-primary">
                Export Orders Data
              </h3>
              <p className="text-sm text-text-primary/70">
                Choose your preferred export format:
              </p>

              {/* Export Options */}
              <div className="space-y-3">
                {/* Export Excel */}
                <button
                  onClick={handleExportExcel}
                  className="w-full flex items-center space-x-3 p-3 cursor-pointer bg-primary hover:bg-hover rounded-lg transition-colors text-text-primary"
                >
                  <FaFileExcel size={20} className="text-green-500" />
                  <span className="font-medium">Export to Excel</span>
                </button>

                {/* Export PDF */}
                <button
                  onClick={handleExportPdf}
                  className="w-full flex items-center space-x-3 cursor-pointer p-3 bg-primary hover:bg-hover rounded-lg transition-colors text-text-primary"
                >
                  <FaFilePdf size={20} className="text-red-500" />
                  <span className="font-medium">Export to PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersTable;
