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
import ExpensesMobileCard from "./ExpensesMobileCard";
import DeleteConfirmModal from "../shared/DeleteConfirmModal";
import AttachmentModal from "../shared/AttachmentModal";
import ExportModal from "../shared/ExportModal";
import {
  exportToExcel,
  exportToPdf,
  formatReportCurrency,
  formatReportDate,
} from "../../lib/exportUtils";

const ExpensesTable = ({ expensesData = [], canManage = true }) => {
  const router = useRouter();
  const { deleteExpense } = useData();
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState(null);

  const handleEdit = (expense) => {
    const id = expense._id || expense.id;
    router.push(`/expenses/edit/${id}`);
  };

  // Open custom delete modal
  const handleDelete = (expense) => {
    setDeleteTarget(expense);
  };

  // Confirm delete action
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      const id = deleteTarget._id || deleteTarget.id;
      await deleteExpense(id);
      setDeleteTarget(null);
    } catch (err) {
      alert("Failed to delete expense: " + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

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

  const sortedData = [...expensesData].sort((a, b) => {
    if (!sortField) return 0;
    const aVal = a[sortField];
    const bVal = b[sortField];
    if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const totalExpenses = expensesData.reduce(
    (sum, item) => sum + (item.totalAmount || 0),
    0
  );

  // --- Export Functions ---
  const handleExportClick = () => {
    setShowExportDialog(true);
  };

  const handleExportExcel = async () => {
    if (expensesData.length === 0) {
      alert("No expenses available to export.");
      return;
    }
    await exportToExcel({
      filename: "DailyDocket_Expenses_Report",
      sheetName: "Expenses",
      columns: [
        { key: "date", header: "Date", format: (v) => formatDate(v) },
        { key: "date", header: "Time", format: (v) => formatTime(v) },
        { key: "category", header: "Category", format: (v) => v || "-" },
        { key: "subcategory", header: "Subcategory", format: (v) => v || "-" },
        { key: "totalAmount", header: "Total Amount", format: (v) => Number(v || 0) },
        { key: "status", header: "Status", format: (v) => v || "-" },
        { key: "paymentMode", header: "Payment Mode", format: (v) => v || "-" },
        { key: "billAttachment", header: "Bill Attached", format: (v) => (v ? "Yes" : "No") },
        { key: "remarks", header: "Remarks", format: (v) => v || "-" },
      ],
      data: sortedData,
    });
  };

  const handleExportPdf = async () => {
    if (expensesData.length === 0) {
      alert("No expenses available to export.");
      return;
    }

    await exportToPdf({
      filename: "DailyDocket_Expenses_Report",
      title: "Expenses Management Report",
      subtitle: `Total Records: ${expensesData.length}   |   Total Expenses: ${formatReportCurrency(totalExpenses)}`,
      orientation: "landscape",
      columns: [
        { key: "date", header: "Date", format: (v) => formatDate(v) },
        { key: "date", header: "Time", format: (v) => formatTime(v) },
        { key: "category", header: "Category", format: (v) => v || "-" },
        { key: "subcategory", header: "Subcategory", format: (v) => v || "-" },
        { key: "totalAmount", header: "Total Amount", format: (v) => formatReportCurrency(v) },
        { key: "status", header: "Status", format: (v) => v || "-" },
        { key: "paymentMode", header: "Payment Mode", format: (v) => v || "-" },
        { key: "billAttachment", header: "Bill Attached", format: (v) => (v ? "Yes" : "No") },
        { key: "remarks", header: "Remarks", format: (v) => v || "-" },
      ],
      columnStyles: {
        0: { halign: "center", cellWidth: 26 },
        1: { cellWidth: 55, halign: "center" },
        2: { cellWidth: 45, halign: "center" },
        3: { cellWidth: 90, halign: "center" },
        4: { cellWidth: 90, halign: "center" },
        5: { cellWidth: 80, halign: "center", fontStyle: "bold" },
        6: { cellWidth: 55, halign: "center" },
        7: { cellWidth: 70, halign: "center" },
        8: { cellWidth: 45, halign: "center" },
        9: { halign: "center" },
      },
      summaryRow: [
        "TOTAL",
        "",
        "",
        "",
        formatReportCurrency(totalExpenses),
        `${expensesData.length} Entries`,
        "",
        "",
        "",
      ],
      data: sortedData,
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      Paid: { bg: "bg-green-600", text: "text-white" },
      Pending: { bg: "bg-red-600", text: "text-white" },
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

  const getAttachmentDisplay = (attachment, row) => {
    if (attachment) {
      return (
        <button
          type="button"
          onClick={() =>
            setSelectedAttachment({
              url: attachment,
              title: `Expense Receipt - ${row?.category || ""}`,
              fileName: attachment.split("/").pop(),
            })
          }
          className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-accent/20 text-accent hover:bg-accent/30 text-xs font-medium cursor-pointer transition-colors"
          title="View Bill / Receipt"
        >
          <LuEye size={13} />
          <span>View Bill</span>
        </button>
      );
    }
    return <span className="text-gray-500 text-xs italic">No file</span>;
  };

  const allColumns = [
    { key: "date", label: "Date" },
    { key: "time", label: "Time" },
    { key: "category", label: "Category" },
    { key: "subcategory", label: "Subcategory" },
    { key: "totalAmount", label: "Total Amount" },
    { key: "status", label: "Status" },
    { key: "paymentMode", label: "Payment Mode" },
    { key: "billAttachment", label: "Bill Attachment" },
    { key: "remarks", label: "Remarks" },
    { key: "actions", label: "Actions" },
  ];

  const columns = canManage
    ? allColumns
    : allColumns.filter((col) => col.key !== "actions");

  const gridColsClass = canManage ? "grid-cols-10" : "grid-cols-9";

  return (
    <div className="bg-secondary max-sm:p-2 rounded-xl flex flex-col h-full">
      {/* 1. STATIC HEADER SECTION: This part will NOT scroll. */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0 pb-4">
        {/* Small screens: heading and export on same line */}
        <div className="flex items-center justify-between sm:hidden">
          <h2 className="text-lg font-semibold text-text-primary">
            Expenses Data
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
          Expenses Data
        </h2>
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="text-text-primary">
            <span className="text-sm sm:text-lg font-medium">
              Total Expense:{" "}
            </span>
            <span className="text-lg sm:text-xl font-bold text-red-400">
              -{formatCurrency(totalExpenses)}
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
              <ExpensesMobileCard
                key={index}
                expense={row}
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
              No expenses data available
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
                <div>{row.category}</div>
                <div>{row.subcategory}</div>
                <div className="font-medium text-red-400">
                  -{formatCurrency(row.totalAmount)}
                </div>
                <div>{getStatusBadge(row.status)}</div>
                <div>{row.paymentMode}</div>
                <div title={row.billAttachment || "No file"}>
                  {getAttachmentDisplay(row.billAttachment, row)}
                </div>
                <div>{row.remarks || "-"}</div>
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
              No expenses data available
            </div>
          )}
        </div>
      </div>

      {/* Export Modal with Loading States */}
      <ExportModal
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        title="Export Expenses Data"
        totalCount={expensesData.length}
        onExportExcel={handleExportExcel}
        onExportPdf={handleExportPdf}
      />

      {/* Custom Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete Expense"
        message="Are you sure you want to permanently delete this expense? This will adjust your dashboard expense and profit metrics."
        itemName={
          deleteTarget
            ? `Category: ${deleteTarget.category}${deleteTarget.subcategory ? ` (${deleteTarget.subcategory})` : ""} · Amount: ${formatCurrency(deleteTarget.totalAmount)}`
            : ""
        }
        isLoading={isDeleting}
      />

      {/* Custom Attachment Preview & Download Modal */}
      <AttachmentModal
        isOpen={Boolean(selectedAttachment)}
        onClose={() => setSelectedAttachment(null)}
        url={selectedAttachment?.url}
        title={selectedAttachment?.title || "Expense Bill"}
        fileName={selectedAttachment?.fileName}
      />
    </div>
  );
};

export default ExpensesTable;
