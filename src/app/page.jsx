import React from "react";
import DashboardCard from "../components/ui/dashboardCard";
import { LuShoppingCart, LuTrendingUp, LuUsers } from "react-icons/lu";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import { BsCashStack } from "react-icons/bs";
import { HiMiniShoppingBag } from "react-icons/hi2";
import { LiaChartBarSolid } from "react-icons/lia";

const DashboardPage = () => {
  return (
    <div className="text-text-primary">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      {/* Dashboard Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Total Income Card - Matching your image */}
        <DashboardCard
          title="Total Revenue"
          value="₹ 3,43,000"
          subtitle="Compared to last year"
          icon={<RiMoneyRupeeCircleFill color="#9381ff" size={24} />}
          trend="up"
          trendValue="12.5%"
          iconBgColor="bg-icon-bg"
          className="bg-gradient-to-b from-accent to-secondary"
        />

        {/* Total Orders Card */}
        <DashboardCard
          title="Total Sales"
          value="₹ 1,30,000"
          subtitle="This month"
          icon={<BsCashStack color="#9381ff" size={24} />}
          trend="up"
          trendValue="8.2%"
          iconBgColor="bg-icon-bg"
        />

        {/* Active Users Card */}
        <DashboardCard
          title="Total Expenses"
          value="₹ 1,30,000"
          subtitle="Last 30 days"
          icon={<HiMiniShoppingBag color="#9381ff" size={24} />}
          trend="down"
          trendValue="3.1%"
          iconBgColor="bg-icon-bg"
        />

        {/* Growth Rate Card */}
        <DashboardCard
          title="Total Items Sold"
          value="1247"
          subtitle="Year over year"
          icon={<LiaChartBarSolid color="#9381ff" size={24} fill="#9381ff" />}
          trend="up"
          trendValue="5.8%"
          iconBgColor="bg-icon-bg"
        />
      </div>
    </div>
  );
};

export default DashboardPage;
