"use client";

import React, { useState, useEffect } from "react";
import { LuPlus } from "react-icons/lu";
import SalesTable from "../../../components/sales/SalesTable";
import SalesTableSkeleton from "../../../components/sales/SalesTableSkeleton";

// Mock data for demonstration - with timestamps for Time column
const mockSalesData = [
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
    date: "2025-09-20T13:25:00",
    opening: 890,
    purchase: 1890,
    onlinePayment: 4890,
    cashPayment: 2890,
    transferred: 2546,
    closing: 50,
    attachment: null,
    totalSales: 6000,
  },
  {
    date: "2025-09-19T08:55:00",
    opening: 768,
    purchase: 1890,
    onlinePayment: 3890,
    cashPayment: 1890,
    transferred: 1890,
    closing: 50,
    attachment: null,
    totalSales: 20343,
  },
  {
    date: "2025-09-18T12:40:00",
    opening: 654,
    purchase: 1890,
    onlinePayment: 2890,
    cashPayment: 3890,
    transferred: 1256,
    closing: 50,
    attachment: null,
    totalSales: 8900,
  },
  {
    date: "2025-09-17T15:15:00",
    opening: 543,
    purchase: 1890,
    onlinePayment: 6890,
    cashPayment: 2890,
    transferred: 3456,
    closing: 50,
    attachment: null,
    totalSales: 15670,
  },
  {
    date: "2025-09-16T10:05:00",
    opening: 432,
    purchase: 1890,
    onlinePayment: 4890,
    cashPayment: 1890,
    transferred: 2890,
    closing: 50,
    attachment: null,
    totalSales: 11250,
  },
  {
    date: "2025-09-15T17:30:00",
    opening: 321,
    purchase: 1890,
    onlinePayment: 7890,
    cashPayment: 4890,
    transferred: 1890,
    closing: 50,
    attachment: null,
    totalSales: 16780,
  },
  {
    date: "2025-09-14T09:20:00",
    opening: 210,
    purchase: 1890,
    onlinePayment: 3890,
    cashPayment: 2890,
    transferred: 2345,
    closing: 50,
    attachment: null,
    totalSales: 9450,
  },
  {
    date: "2025-09-13T14:45:00",
    opening: 123,
    purchase: 1890,
    onlinePayment: 5890,
    cashPayment: 3890,
    transferred: 1678,
    closing: 50,
    attachment: null,
    totalSales: 13560,
  },
  {
    date: "2025-09-12T11:35:00",
    opening: 987,
    purchase: 1890,
    onlinePayment: 8890,
    cashPayment: 1890,
    transferred: 2890,
    closing: 50,
    attachment: null,
    totalSales: 16890,
  },
  {
    date: "2025-09-11T16:10:00",
    opening: 876,
    purchase: 1890,
    onlinePayment: 2890,
    cashPayment: 4890,
    transferred: 3456,
    closing: 50,
    attachment: null,
    totalSales: 12340,
  },
  {
    date: "2025-09-10T08:25:00",
    opening: 765,
    purchase: 1890,
    onlinePayment: 6890,
    cashPayment: 2890,
    transferred: 1234,
    closing: 50,
    attachment: null,
    totalSales: 14890,
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

  const handleAddSale = () => {
    console.log("Add sale clicked");
    // Add sale functionality will be implemented later
  };

  return (
    <div className="w-full max-w-full">
      {/* Page Header */}
      <div className="flex mb-6 flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-bold mb-6 text-text-primary">Sales</h1>
        <button
          onClick={handleAddSale}
          className="flex items-center space-x-2 px-2 md:px-6 py-2.5 md:py-3 bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors font-medium text-sm md:text-base"
        >
          <LuPlus size={18} />
          <span>Add Sale</span>
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-secondary shadow-md rounded-xl p-2 sm:p-4 md:p-5 lg:p-6 space-y-2 overflow-hidden w-full">
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
