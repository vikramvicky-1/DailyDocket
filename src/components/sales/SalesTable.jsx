"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useData } from "../../contexts/DataContext";
import { LuDownload, LuTrash2, LuEye } from "react-icons/lu";
import { GoTriangleUp, GoTriangleDown } from "react-icons/go";
import { TbEdit } from "react-icons/tb";
import { CgExport } from "react-icons/cg";
import SalesMobileCard from "./SalesMobileCard";
import DeleteConfirmModal from "../shared/DeleteConfirmModal";
import AttachmentModal from "../shared/AttachmentModal";
import ExportModal from "../shared/ExportModal";
import {
  exportToExcel,
  exportToPdf,
  formatReportCurrency,
} from "../../lib/exportUtils";
const SalesTable = ({ salesData = [], canManage = true }) => {
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
  const formatTime = (dateString) =>
    new Date(dateString).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

  // --- Sorting Logic ---
  const handleSort = (field) => {
    const isAsc = sortField === field && sortDirection === "asc";
    setSortDirection(isAsc ? "desc" : "asc");
    setSortField(field);
  };

  const sortedData = [...salesData].sort((a, b) => {
    if (!sortField) return 0;
    const aVal = a[sortField];
    const bVal = b[sortField];
    if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const totalSales = salesData.reduce(
    (sum, item) => sum + (item.totalSales || 0),
    0
  );

  // --- Export Functions ---
  const handleExportClick = () => {
    setShowExportDialog(true);
  };

  const handleExportExcel = async () => {
    if (salesData.length === 0) {
      alert("No sales records available to export.");
      return;
    }
    await exportToExcel({
      filename: "DailyDocket_Sales_Report",
      sheetName: "Sales",
      columns: [
        { key: "date", header: "Date", format: (v) => formatDate(v) },
        { key: "date", header: "Time", format: (v) => formatTime(v) },
        { key: "opening", header: "Opening Cash", format: (v, r) => Number(v ?? r.openingCash ?? 0) },
        { key: "purchase", header: "Purchase Cash", format: (v, r) => Number(v ?? r.purchaseCash ?? 0) },
        { key: "onlinePayment", header: "Online Cash", format: (v, r) => Number(v ?? r.onlineCash ?? 0) },
        { key: "cashPayment", header: "Physical Cash", format: (v, r) => Number(v ?? r.physicalCash ?? 0) },
        { key: "transferred", header: "Transferred Cash", format: (v, r) => Number(v ?? r.cashTransferred ?? 0) },
        { key: "closing", header: "Closing Cash", format: (v, r) => Number(v ?? r.closingCash ?? 0) },
        { key: "totalSales", header: "Total Sales", format: (v, r) => Number(v ?? r.totalSale ?? 0) },
        { key: "attachment", header: "Has Receipt", format: (v) => (v ? "Yes" : "No") },
      ],
      data: sortedData,
    });
  };

  const handleExportPdf = async () => {
    if (salesData.length === 0) {
      alert("No sales records available to export.");
      return;
    }

    const sumOpening = salesData.reduce((s, r) => s + (Number(r.opening ?? r.openingCash) || 0), 0);
    const sumPurchase = salesData.reduce((s, r) => s + (Number(r.purchase ?? r.purchaseCash) || 0), 0);
    const sumOnline = salesData.reduce((s, r) => s + (Number(r.onlinePayment ?? r.onlineCash) || 0), 0);
    const sumPhysical = salesData.reduce((s, r) => s + (Number(r.cashPayment ?? r.physicalCash) || 0), 0);
    const sumTransferred = salesData.reduce((s, r) => s + (Number(r.transferred ?? r.cashTransferred) || 0), 0);
    const sumClosing = salesData.reduce((s, r) => s + (Number(r.closing ?? r.closingCash) || 0), 0);
    const sumTotal = salesData.reduce((s, r) => s + (Number(r.totalSales ?? r.totalSale) || 0), 0);

    await exportToPdf({
      filename: "DailyDocket_Sales_Report",
      title: "Daily Sales Report",
      subtitle: `Total Entries: ${salesData.length}   |   Total Revenue: ${formatReportCurrency(sumTotal)}`,
      orientation: "landscape",
      columns: [
        { key: "date", header: "Date", format: (v) => formatDate(v) },
        { key: "date", header: "Time", format: (v) => formatTime(v) },
        { key: "opening", header: "Opening", format: (v, r) => formatReportCurrency(v ?? r.openingCash) },
        { key: "purchase", header: "Purchase", format: (v, r) => formatReportCurrency(v ?? r.purchaseCash) },
        { key: "onlinePayment", header: "Online", format: (v, r) => formatReportCurrency(v ?? r.onlineCash) },
        { key: "cashPayment", header: "Physical", format: (v, r) => formatReportCurrency(v ?? r.physicalCash) },
        { key: "transferred", header: "Transferred", format: (v, r) => formatReportCurrency(v ?? r.cashTransferred) },
        { key: "closing", header: "Closing", format: (v, r) => formatReportCurrency(v ?? r.closingCash) },
        { key: "totalSales", header: "Total Sales", format: (v, r) => formatReportCurrency(v ?? r.totalSale) },
        { key: "attachment", header: "Receipt", format: (v) => (v ? "Yes" : "No") },
      ],
      columnStyles: {
        0: { halign: "center", cellWidth: 26 },
        1: { halign: "center", cellWidth: 55 },
        2: { halign: "center", cellWidth: 45 },
        3: { halign: "center" },
        4: { halign: "center" },
        5: { halign: "center" },
        6: { halign: "center" },
        7: { halign: "center" },
        8: { halign: "center" },
        9: { halign: "center", fontStyle: "bold" },
        10: { halign: "center", cellWidth: 50 },
      },
      summaryRow: [
        "TOTAL",
        "",
        formatReportCurrency(sumOpening),
        formatReportCurrency(sumPurchase),
        formatReportCurrency(sumOnline),
        formatReportCurrency(sumPhysical),
        formatReportCurrency(sumTransferred),
        formatReportCurrency(sumClosing),
        formatReportCurrency(sumTotal),
        "",
      ],
      data: sortedData,
    });
  };

  const { deleteSale } = useData();

  // Handle edit functionality
  const handleEdit = (row) => {
    const saleId = row._id || row.id;
    router.push(`/sales/edit/${saleId}`);
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
      const saleId = deleteTarget._id || deleteTarget.id;
      await deleteSale(saleId);
      setDeleteTarget(null);
    } catch (err) {
      alert("Failed to delete sale: " + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const allColumns = [
    { key: "date", label: "Date" },
    { key: "time", label: "Time" },
    { key: "opening", label: "Opening" },
    { key: "purchase", label: "Purchase" },
    { key: "onlinePayment", label: "Online" },
    { key: "cashPayment", label: "Physical" },
    { key: "transferred", label: "Transferred" },
    { key: "closing", label: "Closing" },
    { key: "attachment", label: "Attachment" },
    { key: "totalSales", label: "Total Sales" },
    { key: "actions", label: "Actions" },
  ];

  const columns = canManage ? allColumns : allColumns.filter((c) => c.key !== "actions");
  const gridColsClass = canManage ? "grid-cols-11" : "grid-cols-10";

  return (
    <div className="bg-secondary p-4 sm:p-6 rounded-xl flex flex-col h-full">
      {/* 1. STATIC HEADER SECTION: This part will NOT scroll. */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0 pb-4">
        {/* Small screens: heading and export on same line */}
        <div className="flex items-center justify-between sm:hidden">
          <h2 className="text-lg font-semibold text-text-primary">
            Sales Data
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
          Sales Data
        </h2>
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="text-text-primary">
            <span className="text-sm sm:text-lg font-medium">
              Total Sales:{" "}
            </span>
            <span className="text-lg sm:text-xl font-bold text-green-400">
              +{formatCurrency(totalSales)}
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
      <div className="flex-1 overflow-y-auto custom-scrollbar max-h-[550px] md:max-h-[500px] lg:max-h-[450px]">
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
              <SalesMobileCard
                key={index}
                sale={row}
                index={index}
                canManage={canManage}
                onEdit={canManage ? handleEdit : null}
                onDelete={canManage ? handleDelete : null}
                onViewAttachment={(url) =>
                  setSelectedAttachment({
                    url,
                    title: `Sale Receipt - ${formatDate(row.date)}`,
                    fileName: url.split("/").pop(),
                  })
                }
              />
            ))
          ) : (
            <div className="p-8 text-center text-text-primary/60 bg-secondary rounded-b-lg">
              No sales data available
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
                <div>{formatDate(row.date)}</div>
                <div>{formatTime(row.date)}</div>
                <div>{formatCurrency(row.opening)}</div>
                <div>{formatCurrency(row.purchase)}</div>
                <div>{formatCurrency(row.onlinePayment)}</div>
                <div>{formatCurrency(row.cashPayment)}</div>
                <div>{formatCurrency(row.transferred)}</div>
                <div>{formatCurrency(row.closing)}</div>
                <div className="truncate">
                  {row.attachment ? (
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedAttachment({
                          url: row.attachment,
                          title: `Sale Receipt - ${formatDate(row.date)}`,
                          fileName: row.attachment.split("/").pop(),
                        })
                      }
                      className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-accent/20 text-accent hover:bg-accent/30 transition-colors text-xs font-medium cursor-pointer"
                      title="View Attachment"
                    >
                      <LuEye size={14} />
                      <span>View</span>
                    </button>
                  ) : (
                    <span className="text-gray-500 text-xs italic">No file</span>
                  )}
                </div>
                <div className="font-medium text-green-400">
                  +{formatCurrency(row.totalSales)}
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
              No sales data available
            </div>
          )}
        </div>
      </div>

      {/* Export Modal with Loading States */}
      <ExportModal
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        title="Export Sales Data"
        totalCount={salesData.length}
        onExportExcel={handleExportExcel}
        onExportPdf={handleExportPdf}
      />

      {/* Custom Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete Sale Record"
        message="Are you sure you want to permanently delete this sale entry? This will adjust your dashboard revenue metrics."
        itemName={
          deleteTarget
            ? `Sale Date: ${formatDate(deleteTarget.date)} · Total: ${formatCurrency(deleteTarget.totalSales)}`
            : ""
        }
        isLoading={isDeleting}
      />

      {/* Custom Attachment Preview & Download Modal */}
      <AttachmentModal
        isOpen={Boolean(selectedAttachment)}
        onClose={() => setSelectedAttachment(null)}
        url={selectedAttachment?.url}
        title={selectedAttachment?.title || "Sale Attachment"}
        fileName={selectedAttachment?.fileName}
      />
    </div>
  );
};

export default SalesTable;
