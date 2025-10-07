"use client";

import React, { useState, useEffect } from "react";
import DashboardCard from "../components/ui/dashboardCard";
import DashboardCardSkeleton from "../components/ui/DashboardCardSkeleton";
import { useSidebar } from "../contexts/SidebarContext";
import { LuShoppingCart, LuTrendingUp, LuUsers } from "react-icons/lu";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import { BsCashStack } from "react-icons/bs";
import { HiMiniShoppingBag } from "react-icons/hi2";
import { LiaChartBarSolid } from "react-icons/lia";

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const { sidebarExpanded, isMobile } = useSidebar();

  // Simulate data loading
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock dashboard data
      setDashboardData({
        totalRevenue: "₹ 3,43,000",
        totalSales: "₹ 1,30,000",
        totalExpenses: "₹ 1,30,000",
        totalItemsSold: "1247",
        trends: {
          revenue: { direction: "up", value: "12.5%" },
          sales: { direction: "up", value: "8.2%" },
          expenses: { direction: "down", value: "3.1%" },
          items: { direction: "up", value: "5.8%" },
        },
      });
      setLoading(false);
    };

    loadData();
  }, []);

  return (
    <div className="text-text-primary">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      {/* Dashboard Cards Grid */}
      <div
        className={`
        grid gap-4 sm:gap-6 
        transition-all duration-300 ease-in-out
        ${
          isMobile
            ? "grid-cols-1 justify-items-center"
            : sidebarExpanded
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-4 justify-items-center lg:justify-items-start"
            : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 justify-items-center lg:justify-items-start"
        }
      `}
      >
        {loading ? (
          // Skeleton Loading State
          <>
            <DashboardCardSkeleton />
            <DashboardCardSkeleton />
            <DashboardCardSkeleton />
            <DashboardCardSkeleton />
          </>
        ) : (
          // Actual Dashboard Cards
          <>
            {/* Total Revenue Card */}
            <DashboardCard
              title="Total Revenue"
              value={dashboardData?.totalRevenue}
              subtitle="Compared to last year"
              icon={<RiMoneyRupeeCircleFill color="#9381ff" size={24} />}
              trend={dashboardData?.trends?.revenue?.direction}
              trendValue={dashboardData?.trends?.revenue?.value}
              iconBgColor="bg-icon-bg"
              className="bg-gradient-to-b from-accent to-secondary"
            />

            {/* Total Sales Card */}
            <DashboardCard
              title="Total Sales"
              value={dashboardData?.totalSales}
              subtitle="This month"
              icon={<BsCashStack color="#9381ff" size={24} />}
              trend={dashboardData?.trends?.sales?.direction}
              trendValue={dashboardData?.trends?.sales?.value}
              iconBgColor="bg-icon-bg"
            />

            {/* Total Expenses Card */}
            <DashboardCard
              title="Total Expenses"
              value={dashboardData?.totalExpenses}
              subtitle="Last 30 days"
              icon={<HiMiniShoppingBag color="#9381ff" size={24} />}
              trend={dashboardData?.trends?.expenses?.direction}
              trendValue={dashboardData?.trends?.expenses?.value}
              iconBgColor="bg-icon-bg"
            />

            {/* Total Items Sold Card */}
            <DashboardCard
              title="Total Items Sold"
              value={dashboardData?.totalItemsSold}
              subtitle="Year over year"
              icon={
                <LiaChartBarSolid color="#9381ff" size={24} fill="#9381ff" />
              }
              trend={dashboardData?.trends?.items?.direction}
              trendValue={dashboardData?.trends?.items?.value}
              iconBgColor="bg-icon-bg"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
