"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LuPlus } from "react-icons/lu";
import OrdersTable from "../../../components/orders/OrdersTable";
import OrdersTableSkeleton from "../../../components/orders/OrdersTableSkeleton";
import StatusFilter from "../../../components/orders/StatusFilter";
import { useData } from "../../../contexts/DataContext";
import { useAuth } from "../../../contexts/AuthContext";
import PermissionGuard from "../../../components/shared/PermissionGuard";

const OrdersPage = () => {
  const router = useRouter();
  const { orders, loading } = useData();
  const { canManage } = useAuth();
  const canManageOrders = typeof canManage === "function" ? canManage("orders") : true;

  const [filteredData, setFilteredData] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("All");

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
    <PermissionGuard moduleKey="orders" requiredAction="view">
      <div className="w-full max-w-full">
        <div className="mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-text-primary">Orders</h1>
            <div className="hidden md:flex items-center space-x-4">
              <StatusFilter
                selectedStatus={selectedStatus}
                onStatusChange={handleStatusChange}
              />
              {canManageOrders && (
                <button
                  onClick={handleAddOrder}
                  className="flex items-center space-x-2 px-6 py-2.5 bg-accent cursor-pointer hover:bg-accent/90 text-white rounded-lg transition-colors font-medium"
                >
                  <LuPlus size={18} />
                  <span>Add Order</span>
                </button>
              )}
            </div>
            {canManageOrders && (
              <button
                onClick={handleAddOrder}
                className="md:hidden flex items-center space-x-2 px-2 py-2.5 bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors font-medium text-sm"
              >
                <LuPlus size={18} />
                <span>Add Order</span>
              </button>
            )}
          </div>
          <div className="md:hidden flex items-center justify-start">
            <StatusFilter
              selectedStatus={selectedStatus}
              onStatusChange={handleStatusChange}
            />
          </div>
        </div>
        <div className="flex-1 min-h-0">
          {loading ? (
            <OrdersTableSkeleton />
          ) : (
            <OrdersTable ordersData={filteredData} canManage={canManageOrders} />
          )}
        </div>
      </div>
    </PermissionGuard>
  );
};

export default OrdersPage;
