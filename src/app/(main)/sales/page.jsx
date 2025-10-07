"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { LuPlus } from "react-icons/lu";
import SalesTable from "../../../components/sales/SalesTable";
import SalesTableSkeleton from "../../../components/sales/SalesTableSkeleton";

// Mock data for demonstration
const mockSalesData = [
  // ... (pasting a few for brevity, use your full list)
  {
    date: "2025-09-25T10:30:00",
    opening: 890,
    purchase: 1890,
    onlinePayment: 5890,
    cashPayment: 1890,
    transferred: 1890,
    closing: 50,
    attachment: null,
    totalSales: 11000,
  },
  {
    date: "2025-09-24T14:15:00",
    opening: 678,
    purchase: 1890,
    onlinePayment: 6890,
    cashPayment: 2890,
    transferred: 890,
    closing: 50,
    attachment: null,
    totalSales: 6000,
  },
  {
    date: "2025-09-23T09:45:00",
    opening: 976,
    purchase: 1890,
    onlinePayment: 3890,
    cashPayment: 4890,
    transferred: 2546,
    closing: 50,
    attachment: null,
    totalSales: 12947,
  },
  {
    date: "2025-09-22T16:20:00",
    opening: 268,
    purchase: 1890,
    onlinePayment: 7890,
    cashPayment: 3890,
    transferred: 2890,
    closing: 50,
    attachment: null,
    totalSales: 20343,
  },
  {
    date: "2025-09-21T11:10:00",
    opening: 875,
    purchase: 1890,
    onlinePayment: 8890,
    cashPayment: 1890,
    transferred: 1890,
    closing: 50,
    attachment: null,
    totalSales: 11000,
  },
  {
    date: "2025-09-25T10:30:00",
    opening: 890,
    purchase: 1890,
    onlinePayment: 5890,
    cashPayment: 1890,
    transferred: 1890,
    closing: 50,
    attachment: null,
    totalSales: 11000,
  },
  {
    date: "2025-09-24T14:15:00",
    opening: 678,
    purchase: 1890,
    onlinePayment: 6890,
    cashPayment: 2890,
    transferred: 890,
    closing: 50,
    attachment: null,
    totalSales: 6000,
  },
  {
    date: "2025-09-23T09:45:00",
    opening: 976,
    purchase: 1890,
    onlinePayment: 3890,
    cashPayment: 4890,
    transferred: 2546,
    closing: 50,
    attachment: null,
    totalSales: 12947,
  },
  {
    date: "2025-09-22T16:20:00",
    opening: 268,
    purchase: 1890,
    onlinePayment: 7890,
    cashPayment: 3890,
    transferred: 2890,
    closing: 50,
    attachment: null,
    totalSales: 20343,
  },
  {
    date: "2025-09-21T11:10:00",
    opening: 875,
    purchase: 1890,
    onlinePayment: 8890,
    cashPayment: 1890,
    transferred: 1890,
    closing: 50,
    attachment: null,
    totalSales: 11000,
  },
];

const SalesPage = () => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulate data loading
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setSalesData(mockSalesData);
      setLoading(false);
    };

    loadData();
  }, []);

  return (
    <div className="w-full flex flex-col">
      {/* Page Header */}
      <div className="mb-6">
        {/* Title and Add Button Row (always together) */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-text-primary">Sales</h1>
          <Link
            href="/sales/add-sales"
            className="flex items-center space-x-2 px-2 md:px-6 py-2.5 md:py-3 bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors font-medium text-sm md:text-base cursor-pointer"
          >
            <LuPlus size={18} />
            <span>Add Sale</span>
          </Link>
        </div>
      </div>

      {/* Table Container - flex-1 makes it take up all remaining vertical space */}
      <div className="flex-1 min-h-0">
        {loading ? (
          <SalesTableSkeleton />
        ) : (
          <SalesTable salesData={salesData} />
        )}
      </div>
    </div>
  );
};

export default SalesPage;
