"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LuPlus } from "react-icons/lu";
import OrdersTable from "../../../components/orders/OrdersTable";
import OrdersTableSkeleton from "../../../components/orders/OrdersTableSkeleton";
import StatusFilter from "../../../components/orders/StatusFilter";
import { useData } from "../../../contexts/DataContext";

const OrdersPage = () => {
  const router = useRouter();
  const { orders } = useData();
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("All");

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (selectedStatus === "All") {
      setFilteredData(orders);
    } else {
      setFilteredData(orders.filter((order) => order.status === selectedStatus));
    }
  }, [orders, selectedStatus]);

  const handleAddOrder = () => {
    router.push("/orders/add-orders");
  };

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
  };

  return (
    <div className="w-full max-w-full">
      <div className="mb-6 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-text-primary">Orders</h1>
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
          <button
            onClick={handleAddOrder}
            className="md:hidden flex items-center space-x-2 px-2 py-2.5 bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors font-medium text-sm"
          >
            <LuPlus size={18} />
            <span>Add Order</span>
          </button>
        </div>
        <div className="md:hidden flex items-center justify-start">
          <StatusFilter
            selectedStatus={selectedStatus}
            onStatusChange={handleStatusChange}
          />
        </div>
      </div>
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
