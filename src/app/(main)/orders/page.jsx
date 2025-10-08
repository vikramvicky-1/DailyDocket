"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LuPlus } from "react-icons/lu";
import OrdersTable from "../../../components/orders/OrdersTable";
import OrdersTableSkeleton from "../../../components/orders/OrdersTableSkeleton";
import StatusFilter from "../../../components/orders/StatusFilter";

// Mock data for demonstration
const mockOrdersData = [
  {
    orderId: "ID846597",
    date: "2025-09-25T10:30:00",
    customerName: "Agatha Christie",
    deliveryDate: "2025-09-27T10:30:00",
    paymentMode: "Cash",
    billAttachment: null,
    paymentAttachment: null,
    status: "Order Received",
    totalAmount: 5890,
  },
  {
    orderId: "ID897439",
    date: "2025-09-24T14:15:00",
    customerName: "James Dotty",
    deliveryDate: "2025-09-29T14:15:00",
    paymentMode: "Card",
    billAttachment: null,
    paymentAttachment: null,
    status: "Out for Delivery",
    totalAmount: 6890,
  },
  {
    orderId: "ID648397",
    date: "2025-09-23T09:45:00",
    customerName: "Lewis Sabuda",
    deliveryDate: "2025-10-01T09:45:00",
    paymentMode: "UPI",
    billAttachment: null,
    paymentAttachment: null,
    status: "Cancelled",
    totalAmount: 3890,
  },
  {
    orderId: "ID892164",
    date: "2025-09-22T16:20:00",
    customerName: "John Barrow",
    deliveryDate: "2025-10-04T16:20:00",
    paymentMode: "UPI",
    billAttachment: "bill.pdf",
    paymentAttachment: "payment.pdf",
    status: "Completed",
    totalAmount: 7890,
  },
  {
    orderId: "ID756321",
    date: "2025-09-21T11:10:00",
    customerName: "Sarah Johnson",
    deliveryDate: "2025-09-26T11:10:00",
    paymentMode: "Card",
    billAttachment: null,
    paymentAttachment: null,
    status: "Order Received",
    totalAmount: 4520,
  },
  {
    orderId: "ID634789",
    date: "2025-09-20T13:25:00",
    customerName: "Michael Smith",
    deliveryDate: "2025-09-28T13:25:00",
    paymentMode: "Cash",
    billAttachment: "bill.pdf",
    paymentAttachment: null,
    status: "Out for Delivery",
    totalAmount: 8950,
  },
  {
    orderId: "ID512467",
    date: "2025-09-19T08:55:00",
    customerName: "Emma Wilson",
    deliveryDate: "2025-09-30T08:55:00",
    paymentMode: "UPI",
    billAttachment: null,
    paymentAttachment: "payment.pdf",
    status: "Completed",
    totalAmount: 3200,
  },
  {
    orderId: "ID398245",
    date: "2025-09-18T12:40:00",
    customerName: "David Brown",
    deliveryDate: "2025-10-02T12:40:00",
    paymentMode: "Card",
    billAttachment: null,
    paymentAttachment: null,
    status: "Cancelled",
    totalAmount: 5670,
  },
];

const OrdersPage = () => {
  const router = useRouter();
  const [ordersData, setOrdersData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Simulate data loading
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setOrdersData(mockOrdersData);
      setFilteredData(mockOrdersData);
      setLoading(false);
    };

    loadData();
  }, []);

  // Filter data based on selected status
  useEffect(() => {
    if (selectedStatus === "All") {
      setFilteredData(ordersData);
    } else {
      setFilteredData(
        ordersData.filter((order) => order.status === selectedStatus)
      );
    }
  }, [ordersData, selectedStatus]);

  const handleAddOrder = () => {
    router.push("/orders/add-orders");
  };

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
  };

  return (
    <div className="w-full max-w-full">
      {/* Page Header */}
      <div className="mb-6 space-y-4">
        {/* Title and Add Button Row - Always together */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-text-primary">Orders</h1>

          {/* Controls Row for Medium+ screens - Filter + Add Button */}
          <div className="hidden md:flex items-center space-x-4">
            <StatusFilter
              selectedStatus={selectedStatus}
              onStatusChange={handleStatusChange}
            />
            <button
              onClick={handleAddOrder}
              className="flex items-center space-x-2 px-6 py-2.5 bg-accent cursor-pointer hover:bg-accent/90 text-white rounded-lg transition-colors font-medium"
            >
              <LuPlus size={18} />
              <span>Add Order</span>
            </button>
          </div>

          {/* Add Button for Small screens - Always at top right */}
          <button
            onClick={handleAddOrder}
            className="md:hidden flex items-center space-x-2 px-2 py-2.5 bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors font-medium text-sm"
          >
            <LuPlus size={18} />
            <span>Add Order</span>
          </button>
        </div>

        {/* Filters Row for Small screens - Below title */}
        <div className="md:hidden flex items-center justify-start">
          <StatusFilter
            selectedStatus={selectedStatus}
            onStatusChange={handleStatusChange}
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-secondary shadow-md rounded-xl p-2 sm:p-4 md:p-5 lg:p-6 space-y-2 overflow-hidden w-full">
        {loading ? (
          <OrdersTableSkeleton />
        ) : (
          <OrdersTable ordersData={filteredData} />
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
