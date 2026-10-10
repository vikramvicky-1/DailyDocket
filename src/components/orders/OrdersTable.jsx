"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useData } from "../../contexts/DataContext";
import {
  LuPencil,
  LuTrash2,
  LuDownload,
  LuChevronUp,
  LuChevronDown,
  LuX,
  LuEye,
} from "react-icons/lu";
import { GoTriangleUp, GoTriangleDown } from "react-icons/go";
import { TbEdit } from "react-icons/tb";
import { CgExport } from "react-icons/cg";
import OrderMobileCard from "./OrderMobileCard";
import DeleteConfirmModal from "../shared/DeleteConfirmModal";
import AttachmentModal from "../shared/AttachmentModal";
import ExportModal from "../shared/ExportModal";
import {
  exportToExcel,
  exportToPdf,
  formatReportCurrency,
  formatReportDate,
} from "../../lib/exportUtils";

const OrdersTable = ({ ordersData = [], canManage = true }) => {
  const router = useRouter();
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState(null);

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

  const handleExportExcel = async () => {
    if (ordersData.length === 0) {
      alert("No orders available to export.");
      return;
    }
    await exportToExcel({
      filename: "DailyDocket_Orders_Report",
      sheetName: "Orders",
      columns: [
        { key: "orderId", header: "Order ID", format: (v) => v || "-" },
        { key: "date", header: "Order Date", format: (v) => formatReportDate(v) },
        { key: "customerName", header: "Customer Name", format: (v) => v || "-" },
        { key: "deliveryDate", header: "Delivery Date", format: (v) => formatReportDate(v) },
        { key: "paymentMode", header: "Payment Mode", format: (v) => v || "-" },
        { key: "billAttachment", header: "Bill Attached", format: (v) => (v ? "Yes" : "No") },
        { key: "paymentAttachment", header: "Payment Attached", format: (v) => (v ? "Yes" : "No") },
        { key: "status", header: "Status", format: (v) => v || "-" },
        { key: "totalAmount", header: "Total Amount", format: (v) => Number(v || 0) },
      ],
      data: sortedData,
    });
  };

  const handleExportPdf = async () => {
    if (ordersData.length === 0) {
      alert("No orders available to export.");
      return;
    }

    const sumTotal = ordersData.reduce(
      (sum, item) => sum + (Number(item.totalAmount) || 0),
      0
    );

    await exportToPdf({
      filename: "DailyDocket_Orders_Report",
      title: "Orders Management Report",
      subtitle: `Total Orders: ${ordersData.length}   |   Total Value: ${formatReportCurrency(sumTotal)}`,
      orientation: "landscape",
      columns: [
        { key: "orderId", header: "Order ID", format: (v) => v || "-" },
        { key: "date", header: "Order Date", format: (v) => formatReportDate(v) },
        { key: "customerName", header: "Customer Name", format: (v) => v || "-" },
        { key: "deliveryDate", header: "Delivery Date", format: (v) => formatReportDate(v) },
        { key: "paymentMode", header: "Payment Mode", format: (v) => v || "-" },
        { key: "billAttachment", header: "Bill", format: (v) => (v ? "Yes" : "No") },
        { key: "paymentAttachment", header: "Receipt", format: (v) => (v ? "Yes" : "No") },
        { key: "status", header: "Status", format: (v) => v || "-" },
        { key: "totalAmount", header: "Total Amount", format: (v) => formatReportCurrency(v) },
      ],
      columnStyles: {
        0: { halign: "center", cellWidth: 26 },
        1: { cellWidth: 70, halign: "center" },
        2: { cellWidth: 60, halign: "center" },
        3: { halign: "center" },
        4: { cellWidth: 60, halign: "center" },
        5: { cellWidth: 70, halign: "center" },
        6: { cellWidth: 40, halign: "center" },
        7: { cellWidth: 45, halign: "center" },
        8: { cellWidth: 75, halign: "center" },
        9: { cellWidth: 75, halign: "center", fontStyle: "bold" },
      },
      summaryRow: [
        "TOTAL",
        "",
        "",
        "",
        "",
        "",
        "",
        `${ordersData.length} Orders`,
        formatReportCurrency(sumTotal),
      ],
      data: sortedData,
    });
  };

  const { deleteOrder } = useData();

  // Handle edit functionality
  const handleEdit = (row) => {
    const id = row._id || row.id || row.orderId;
    router.push(`/orders/edit/${id}`);
  };

  // Open custom delete modal
  const handleDelete = (row) => {
    setDeleteTarget(row);
  };

  // Confirm delete action
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      const id = deleteTarget._id || deleteTarget.id || deleteTarget.orderId;
      await deleteOrder(id);
      setDeleteTarget(null);
    } catch (err) {
      alert("Failed to delete order: " + err.message);
    } finally {
      setIsDeleting(false);
    }
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

  const getAttachmentDisplay = (attachment, type = "bill", row) => {
    if (attachment) {
      return (
        <button
          type="button"
          onClick={() =>
            setSelectedAttachment({
              url: attachment,
              title: `Order ${row?.orderId || ""} - ${type === "bill" ? "Bill Attachment" : "Payment Receipt"}`,
              fileName: attachment.split("/").pop(),
            })
          }
          className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-accent/20 text-accent hover:bg-accent/30 text-xs font-medium cursor-pointer transition-colors"
          title={`View ${type === "bill" ? "Bill" : "Payment"}`}
        >
          <LuEye size={13} />
          <span>{type === "bill" ? "Bill" : "Payment"}</span>
        </button>
      );
    }
    return <span className="text-gray-500 text-xs italic">No file</span>;
  };

  const allColumns = [
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

  const columns = canManage ? allColumns : allColumns.filter((c) => c.key !== "actions");
  const gridColsClass = canManage ? "grid-cols-10" : "grid-cols-9";

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
        <div className={`hidden lg:grid ${gridColsClass} gap-4 p-4 border-b border-secondary bg-form-bg rounded-t-lg sticky top-0 z-10`}>
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
                canManage={canManage}
                onEdit={canManage ? handleEdit : null}
                onDelete={canManage ? handleDelete : null}
                onViewAttachment={(url, title) =>
                  setSelectedAttachment({
                    url,
                    title,
                    fileName: url.split("/").pop(),
                  })
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
                className={`grid ${gridColsClass} gap-4 p-4 border-b border-gray-600/60 bg-transparent text-sm text-text-primary items-center`}
              >
                <div>{row.orderId}</div>
                <div>{formatDate(row.date)}</div>
                <div>{row.customerName}</div>
                <div>{formatDate(row.deliveryDate)}</div>
                <div>{row.paymentMode}</div>
                <div title={row.billAttachment || "No file"}>
                  {getAttachmentDisplay(row.billAttachment, "bill", row)}
                </div>
                <div title={row.paymentAttachment || "No file"}>
                  {getAttachmentDisplay(row.paymentAttachment, "payment", row)}
                </div>
                <div>{getStatusBadge(row.status)}</div>
                <div className="font-medium text-green-400">
                  +{formatCurrency(row.totalAmount)}
                </div>
                {canManage && (
                  <div className="flex items-center justify-start">
                    <button
                      onClick={() => handleEdit(row)}
                      className="p-1.5 cursor-pointer hover:text-blue-700 hover:bg-hover rounded transition-colors"
                      title="Edit"
                    >
                      <TbEdit size={17} />
                    </button>
                    <button
                      onClick={() => handleDelete(row)}
                      className="p-1.5 hover:text-red cursor-pointer hover:bg-hover rounded transition-colors"
                      title="Delete"
                    >
                      <LuTrash2 size={17} />
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-text-primary/60 bg-secondary rounded-b-lg">
              No orders data available
            </div>
          )}
        </div>
      </div>

      {/* Export Modal with Loading States */}
      <ExportModal
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        title="Export Orders Data"
        totalCount={ordersData.length}
        onExportExcel={handleExportExcel}
        onExportPdf={handleExportPdf}
      />

      {/* Custom Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete Order"
        message="Are you sure you want to permanently delete this order? This action will remove the order and all linked records."
        itemName={
          deleteTarget
            ? `Order ID: ${deleteTarget.orderId || deleteTarget._id} · Customer: ${deleteTarget.customerName} · Amount: ${formatCurrency(deleteTarget.totalAmount)}`
            : ""
        }
        isLoading={isDeleting}
      />

      {/* Custom Attachment Preview & Download Modal */}
      <AttachmentModal
        isOpen={Boolean(selectedAttachment)}
        onClose={() => setSelectedAttachment(null)}
        url={selectedAttachment?.url}
        title={selectedAttachment?.title || "Order Attachment"}
        fileName={selectedAttachment?.fileName}
      />
    </div>
  );
};

export default OrdersTable;
