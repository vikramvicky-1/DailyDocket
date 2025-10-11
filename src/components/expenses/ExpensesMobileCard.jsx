"use client";

import { useRouter } from "next/navigation";
import { LuPencil, LuTrash2 } from "react-icons/lu";
import { TbEdit } from "react-icons/tb";

const ExpensesMobileCard = ({ expense, index, onEdit, onDelete }) => {
  const formatCurrency = (amount) => `₹${(amount || 0).toLocaleString()}`;
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });

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
        className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
      >
        {status}
      </span>
    );
  };

  const handleEdit = () => {
    if (onEdit) onEdit(expense, index);
  };

  const handleDelete = () => {
    if (onDelete) onDelete(expense, index);
  };

  return (
    <div className="bg-gradient-to-br from-primary to-secondary rounded-xl p-4 shadow-lg border border-primary/30">
      {/* Header with Date and Actions */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex flex-col">
          <span className="text-white text-sm font-medium">
            {formatDate(expense.date)}
          </span>
          <span className="text-red-400 text-lg font-bold">
            Total Expense: {formatCurrency(expense.totalAmount)}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleEdit}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            title="Edit Expense"
          >
            <TbEdit size={18} className="text-white" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            title="Delete Expense"
          >
            <LuTrash2 size={18} className="text-white" />
          </button>
        </div>
      </div>

      {/* Data Grid - 2x3 layout */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Category */}
        <div className="space-y-1">
          <span className="text-gray-300 text-xs">Category</span>
          <div
            className="text-white text-sm font-medium truncate"
            title={expense.category}
          >
            {expense.category}
          </div>
        </div>

        {/* Subcategory */}
        <div className="space-y-1">
          <span className="text-gray-300 text-xs">Subcategory</span>
          <div
            className="text-white text-sm font-medium truncate"
            title={expense.subcategory}
          >
            {expense.subcategory}
          </div>
        </div>

        {/* Payment Mode */}
        <div className="space-y-1">
          <span className="text-gray-300 text-xs">Payment Mode</span>
          <div className="text-white text-sm font-medium">
            {expense.paymentMode}
          </div>
        </div>

        {/* Status */}
        <div className="space-y-1">
          <span className="text-gray-300 text-xs">Status</span>
          <div className="text-white text-sm font-medium">
            {getStatusBadge(expense.status)}
          </div>
        </div>

        {/* Remarks */}
        <div className="space-y-1">
          <span className="text-gray-300 text-xs">Remarks</span>
          <div
            className="text-white text-sm font-medium truncate"
            title={expense.remarks || "-"}
          >
            {expense.remarks || "-"}
          </div>
        </div>

        {/* Bill Attachment */}
        <div className="space-y-1">
          <span className="text-gray-300 text-xs">Bill</span>
          <div className="text-white text-sm font-medium">
            {expense.billAttachment ? (
              <span className="text-green-400">Available</span>
            ) : (
              <span className="text-gray-400">No file</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpensesMobileCard;
