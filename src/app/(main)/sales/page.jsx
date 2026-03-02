"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { LuPlus } from "react-icons/lu";
import SalesTable from "../../../components/sales/SalesTable";
import SalesTableSkeleton from "../../../components/sales/SalesTableSkeleton";
import { useData } from "../../../contexts/DataContext";

const SalesPage = () => {
  const { sales } = useData();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full flex flex-col">
      <div className="mb-6">
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
      <div className="flex-1 min-h-0">
        {loading ? (
          <SalesTableSkeleton />
        ) : (
          <SalesTable salesData={sales} />
        )}
      </div>
    </div>
  );
};

export default SalesPage;
