"use client";

import { useRouter } from "next/navigation";
import { LuPencil, LuTrash2 } from "react-icons/lu";
import { TbEdit } from "react-icons/tb";

const SalesMobileCard = ({ sale, index, onEdit, onDelete }) => {
  const formatCurrency = (amount) => `₹${(amount || 0).toLocaleString()}`;
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });

  const handleEdit = () => {
    if (onEdit) onEdit(sale, index);
  };

  const handleDelete = () => {
    if (onDelete) onDelete(sale, index);
  };

  return (
    <div className="bg-gradient-to-br from-primary to-secondary rounded-xl p-4 shadow-lg border border-primary/30">
      {/* Header with Date and Actions */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex flex-col">
          <span className="text-white text-sm font-medium">
            {formatDate(sale.date)}
          </span>
          <span className="text-green-400 text-lg font-bold">
            Total Sales: {formatCurrency(sale.totalSales)}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleEdit}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            title="Edit Sale"
          >
            <TbEdit size={18} className="text-white" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            title="Delete Sale"
          >
            <LuTrash2 size={18} className="text-white" />
          </button>
        </div>
      </div>

      {/* Data Grid - 2x3 layout */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Opening */}
        <div className="space-y-1">
          <span className="text-gray-300 text-xs">Opening</span>
          <div className="text-white text-sm font-medium">
            {formatCurrency(sale.opening)}
          </div>
        </div>

        {/* Purchase */}
        <div className="space-y-1">
          <span className="text-gray-300 text-xs">Purchase</span>
          <div className="text-white text-sm font-medium">
            {formatCurrency(sale.purchase)}
          </div>
        </div>

        {/* Online Payment */}
        <div className="space-y-1">
          <span className="text-gray-300 text-xs">Online Payment</span>
          <div className="text-white text-sm font-medium">
            {formatCurrency(sale.onlinePayment)}
          </div>
        </div>

        {/* Cash Payment */}
        <div className="space-y-1">
          <span className="text-gray-300 text-xs">Cash Payment</span>
          <div className="text-white text-sm font-medium">
            {formatCurrency(sale.cashPayment)}
          </div>
        </div>

        {/* Transferred */}
        <div className="space-y-1">
          <span className="text-gray-300 text-xs">Transferred</span>
          <div className="text-white text-sm font-medium">
            {formatCurrency(sale.transferred)}
          </div>
        </div>

        {/* Closing */}
        <div className="space-y-1">
          <span className="text-gray-300 text-xs">Closing</span>
          <div className="text-white text-sm font-medium">
            {formatCurrency(sale.closing)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesMobileCard;
