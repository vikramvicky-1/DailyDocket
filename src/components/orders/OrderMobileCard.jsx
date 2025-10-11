"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LuPencil, LuTrash2, LuX } from "react-icons/lu";
import { TbEdit } from "react-icons/tb";

const OrderMobileCard = ({ order, index, onEdit, onDelete }) => {
  const [showAttachment, setShowAttachment] = useState(false);

  const formatCurrency = (amount) => `₹${(amount || 0).toLocaleString()}`;
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });

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
        className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
      >
        {status}
      </span>
    );
  };

  const handleEdit = () => {
    if (onEdit) onEdit(order, index);
  };

  const handleDelete = () => {
    if (onDelete) onDelete(order, index);
  };

  return (
    <div className="bg-gradient-to-br from-primary to-secondary rounded-xl p-4 shadow-lg border border-primary/30">
      {/* Header with Date and Actions */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex flex-col">
          <span className="text-white text-sm font-medium">
            {formatDate(order.date)}
          </span>
          <span className="text-green-400 text-lg font-bold">
            Total: {formatCurrency(order.totalAmount)}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleEdit}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            title="Edit Order"
          >
            <TbEdit size={18} className="text-white" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            title="Delete Order"
          >
            <LuTrash2 size={18} className="text-white" />
          </button>
        </div>
      </div>

      {/* Data Grid - 2x3 layout */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Order ID */}
        <div className="space-y-1">
          <span className="text-gray-300 text-xs">Order ID</span>
          <div className="text-white text-sm font-medium">{order.orderId}</div>
        </div>

        {/* Customer */}
        <div className="space-y-1">
          <span className="text-gray-300 text-xs">Customer</span>
          <div
            className="text-white text-sm font-medium truncate"
            title={order.customerName}
          >
            {order.customerName}
          </div>
        </div>

        {/* Payment Mode */}
        <div className="space-y-1">
          <span className="text-gray-300 text-xs">Payment Mode</span>
          <div className="text-white text-sm font-medium">
            {order.paymentMode}
          </div>
        </div>

        {/* Delivery Date */}
        <div className="space-y-1">
          <span className="text-gray-300 text-xs">Delivery Date</span>
          <div className="text-white text-sm font-medium">
            {formatDate(order.deliveryDate)}
          </div>
        </div>

        {/* Status */}
        <div className="space-y-1">
          <span className="text-gray-300 text-xs">Status</span>
          <div className="text-white text-sm font-medium">
            {getStatusBadge(order.status)}
          </div>
        </div>

        {/* Bill Attachment */}
        <div className="space-y-1">
          <span className="text-gray-300 text-xs">Bill</span>
          <div className="text-white text-sm font-medium">
            {order.billAttachment ? (
              <span className="text-green-400">Available</span>
            ) : (
              <span className="text-gray-400">No file</span>
            )}
          </div>
        </div>
      </div>

      {/* Attachment Section (if exists) */}
      {(order.billAttachment || order.paymentAttachment) && (
        <div className="border-t border-primary/30 pt-3">
          <div className="flex items-center justify-between bg-secondary/50 rounded-lg p-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">PDF</span>
              </div>
              <span className="text-white text-sm font-medium">
                {order.billAttachment ? "Bill.pdf" : "Payment.pdf"}
              </span>
            </div>
            <button
              onClick={() => setShowAttachment(!showAttachment)}
              className="p-1 hover:bg-white/10 rounded-full transition-colors"
            >
              <LuX size={16} className="text-gray-400" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderMobileCard;
