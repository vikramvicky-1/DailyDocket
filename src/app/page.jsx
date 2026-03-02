"use client";

import React, { useState, useEffect } from "react";
import DashboardCard from "../components/ui/dashboardCard";
import DashboardCardSkeleton from "../components/ui/DashboardCardSkeleton";
import { useSidebar } from "../contexts/SidebarContext";
import { useData } from "../contexts/DataContext";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import { BsCashStack } from "react-icons/bs";
import { HiMiniShoppingBag } from "react-icons/hi2";
import { LiaChartBarSolid } from "react-icons/lia";

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const { sidebarExpanded, isMobile } = useSidebar();
  const { getDashboardSummary } = useData();

  const summary = getDashboardSummary();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const formatCurrency = (val) => {
    return "₹ " + val.toLocaleString("en-IN");
  };

  return (
    <div className="text-text-primary">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div
        className={`
        grid gap-4 sm:gap-6 
        transition-all duration-300 ease-in-out
        ${isMobile
            ? "grid-cols-1 justify-items-center"
            : sidebarExpanded
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-4 justify-items-center lg:justify-items-start"
              : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 justify-items-center lg:justify-items-start"
          }
      `}
      >
        {loading ? (
          <>
            <DashboardCardSkeleton />
            <DashboardCardSkeleton />
            <DashboardCardSkeleton />
            <DashboardCardSkeleton />
          </>
        ) : (
          <>
            <DashboardCard
              title="Total Revenue"
              value={formatCurrency(summary.totalRevenue)}
              subtitle="From all sales records"
              icon={<RiMoneyRupeeCircleFill color="#9381ff" size={24} />}
              trend="up"
              trendValue="12.5%"
              iconBgColor="bg-icon-bg"
              className="bg-gradient-to-b from-accent to-secondary"
            />
            <DashboardCard
              title="Total Sales"
              value={summary.totalSalesCount + " entries"}
              subtitle="Sales records"
              icon={<BsCashStack color="#9381ff" size={24} />}
              trend="up"
              trendValue="8.2%"
              iconBgColor="bg-icon-bg"
            />
            <DashboardCard
              title="Total Expenses"
              value={formatCurrency(summary.totalExpenses)}
              subtitle={`${summary.paidExpenses} paid · ${summary.pendingExpenses} pending`}
              icon={<HiMiniShoppingBag color="#9381ff" size={24} />}
              trend="down"
              trendValue="3.1%"
              iconBgColor="bg-icon-bg"
            />
            <DashboardCard
              title="Net Profit"
              value={formatCurrency(summary.profit)}
              subtitle={`${summary.totalOrders} orders · ${summary.completedOrders} completed`}
              icon={<LiaChartBarSolid color="#9381ff" size={24} fill="#9381ff" />}
              trend={summary.profit > 0 ? "up" : "down"}
              trendValue={
                summary.totalRevenue > 0
                  ? ((summary.profit / summary.totalRevenue) * 100).toFixed(1) + "%"
                  : "0%"
              }
              iconBgColor="bg-icon-bg"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
