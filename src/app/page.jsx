"use client";

import React, { useState, useMemo } from "react";
import DashboardCard from "../components/ui/dashboardCard";
import DashboardSkeleton from "../components/dashboard/DashboardSkeleton";
import { useData } from "../contexts/DataContext";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import { BsCashStack } from "react-icons/bs";
import { HiMiniShoppingBag } from "react-icons/hi2";
import { LiaChartBarSolid } from "react-icons/lia";
import DashboardFilters from "../components/dashboard/DashboardFilters";
import ExecutiveStatsStrip from "../components/dashboard/ExecutiveStatsStrip";
import DashboardBarChart from "../components/dashboard/DashboardBarChart";
import ExpenseCategoryDonut from "../components/dashboard/ExpenseCategoryDonut";
import CashFlowWidget from "../components/dashboard/CashFlowWidget";

const DashboardPage = () => {
  const { sales, orders, expenses, loading } = useData();

  const currentMonth = new Date().getMonth().toString();
  const currentYear = new Date().getFullYear().toString();

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  // Derive available years from all dates in sales, orders, and expenses
  const availableYears = useMemo(() => {
    const yearSet = new Set();
    const currentYr = new Date().getFullYear();
    yearSet.add(currentYr);

    [...sales, ...orders, ...expenses].forEach((item) => {
      if (item && item.date) {
        const d = new Date(item.date);
        if (!isNaN(d.getTime())) {
          yearSet.add(d.getFullYear());
        }
      }
    });

    return Array.from(yearSet)
      .sort((a, b) => b - a)
      .map(String);
  }, [sales, orders, expenses]);

  // Filter records based on selectedMonth and selectedYear
  const filterByDate = (item) => {
    if (!item || !item.date) return false;
    const d = new Date(item.date);
    if (isNaN(d.getTime())) return false;

    if (selectedYear !== "All") {
      if (d.getFullYear().toString() !== selectedYear) return false;
    }

    if (selectedMonth !== "All") {
      if (d.getMonth().toString() !== selectedMonth) return false;
    }

    return true;
  };

  const filteredSales = useMemo(
    () => sales.filter(filterByDate),
    [sales, selectedMonth, selectedYear]
  );
  const filteredOrders = useMemo(
    () => orders.filter(filterByDate),
    [orders, selectedMonth, selectedYear]
  );
  const filteredExpenses = useMemo(
    () => expenses.filter(filterByDate),
    [expenses, selectedMonth, selectedYear]
  );

  // Compute live KPI metrics for filtered data
  const summary = useMemo(() => {
    const salesMoney = filteredSales.reduce(
      (a, s) => a + (Number(s.totalSales) || Number(s.totalSale) || 0),
      0
    );

    const ordersMoney = filteredOrders.reduce(
      (a, o) => a + (Number(o.totalAmount) || Number(o.amount) || 0),
      0
    );

    // Total sales money includes both Sales revenue and Orders revenue as requested
    const totalRevenue = salesMoney + ordersMoney;

    const totalExpenses = filteredExpenses.reduce(
      (a, e) => a + (Number(e.totalAmount) || 0),
      0
    );

    const profit = totalRevenue - totalExpenses;

    const completedOrders = filteredOrders.filter(
      (o) => o.status === "Completed"
    ).length;
    const pendingOrders = filteredOrders.length - completedOrders;

    const paidExpenses = filteredExpenses.filter(
      (e) => e.status === "Paid"
    ).length;
    const pendingExpenses = filteredExpenses.length - paidExpenses;

    const profitMargin =
      totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;
    const orderCompletionRate =
      filteredOrders.length > 0
        ? (completedOrders / filteredOrders.length) * 100
        : 100;

    // Active days for average calculations
    const activeDaysCount =
      selectedMonth !== "All"
        ? new Date(
            selectedYear !== "All"
              ? parseInt(selectedYear)
              : new Date().getFullYear(),
            parseInt(selectedMonth) + 1,
            0
          ).getDate()
        : 30;

    const dailyAvgRevenue = totalRevenue / activeDaysCount;
    const dailyAvgExpense = totalExpenses / activeDaysCount;

    return {
      salesMoney,
      ordersMoney,
      totalRevenue,
      totalExpenses,
      profit,
      profitMargin,
      orderCompletionRate,
      dailyAvgRevenue,
      dailyAvgExpense,
      totalOrders: filteredOrders.length,
      completedOrders,
      pendingOrders,
      paidExpenses,
      pendingExpenses,
    };
  }, [filteredSales, filteredOrders, filteredExpenses, selectedMonth, selectedYear]);

  const formatCurrency = (val) => {
    return "₹ " + (val || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 });
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="text-text-primary space-y-6 pb-8">
      {/* ── Top Header with Title and Month/Year Filters ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-xs sm:text-sm text-text-primary/60 mt-0.5">
            Real-time financial performance, orders, and expenses analytics
          </p>
        </div>

        {/* Top-Right Month and Year Filters */}
        <DashboardFilters
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
          selectedYear={selectedYear}
          onYearChange={setSelectedYear}
          availableYears={availableYears}
        />
      </div>

      {/* ── 4 Summary KPI Cards (Dynamic Fluid Grid) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 transition-all duration-300 ease-in-out">
        {/* Card 1: Total Sales & Revenue (Includes Sales + Orders Money) */}
        <DashboardCard
          title="Total Sales & Revenue"
          value={formatCurrency(summary.totalRevenue)}
          subtitle={`Sales: ${formatCurrency(summary.salesMoney)} · Orders: ${formatCurrency(summary.ordersMoney)}`}
          icon={<RiMoneyRupeeCircleFill color="#9381ff" size={24} />}
          trend="up"
          trendValue={
            summary.totalRevenue > 0
              ? `${((summary.salesMoney / summary.totalRevenue) * 100).toFixed(0)}% sales`
              : undefined
          }
          iconBgColor="bg-icon-bg"
          className="bg-gradient-to-b from-accent/90 to-secondary border border-accent/40"
        />

        {/* Card 2: Orders (Updated from old entries card) */}
        <DashboardCard
          title="Orders"
          value={`${summary.totalOrders} Orders`}
          subtitle={`${summary.completedOrders} completed · ${summary.pendingOrders} active`}
          icon={<BsCashStack color="#9381ff" size={24} />}
          trend="up"
          trendValue={formatCurrency(summary.ordersMoney)}
          iconBgColor="bg-icon-bg"
        />

        {/* Card 3: Total Expenses */}
        <DashboardCard
          title="Total Expenses"
          value={formatCurrency(summary.totalExpenses)}
          subtitle={`${summary.paidExpenses} paid · ${summary.pendingExpenses} pending`}
          icon={<HiMiniShoppingBag color="#9381ff" size={24} />}
          trend="down"
          trendValue={
            summary.totalRevenue > 0
              ? `${((summary.totalExpenses / summary.totalRevenue) * 100).toFixed(1)}% burn`
              : undefined
          }
          iconBgColor="bg-icon-bg"
        />

        {/* Card 4: Net Profit */}
        <DashboardCard
          title="Net Profit"
          value={formatCurrency(summary.profit)}
          subtitle={`Net margin: ${summary.profitMargin.toFixed(1)}%`}
          icon={<LiaChartBarSolid color="#9381ff" size={24} fill="#9381ff" />}
          trend={summary.profit >= 0 ? "up" : "down"}
          trendValue={
            summary.totalRevenue > 0
              ? `${summary.profitMargin.toFixed(1)}%`
              : "0%"
          }
          iconBgColor="bg-icon-bg"
        />
      </div>

      {/* ── Executive Mini-KPI Metrics Bar ── */}
      <ExecutiveStatsStrip
        dailyAvgRevenue={summary.dailyAvgRevenue}
        dailyAvgExpense={summary.dailyAvgExpense}
        profitMargin={summary.profitMargin}
        orderCompletionRate={summary.orderCompletionRate}
      />

      {/* ── Visual Analytics Grid (Donut & Cash Flow Breakdown) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
        <ExpenseCategoryDonut expenses={filteredExpenses} />
        <CashFlowWidget sales={filteredSales} orders={filteredOrders} />
      </div>

      {/* ── 30-Day Multi-Metric Interactive Bar Graph ── */}
      <DashboardBarChart
        sales={sales}
        orders={orders}
        expenses={expenses}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
      />
    </div>
  );
};

export default DashboardPage;
