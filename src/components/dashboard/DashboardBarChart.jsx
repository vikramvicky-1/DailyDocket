"use client";

import React, { useState, useMemo } from "react";
import {
  LuChartBar,
  LuCalendar,
  LuArrowUpRight,
  LuLayers,
} from "react-icons/lu";

const METRICS = [
  {
    id: "all",
    label: "Compare All",
    color: "#6C5CE7",
    bgClass: "bg-[#6C5CE7]/20 border-[#6C5CE7] text-white",
  },
  {
    id: "revenue",
    label: "Revenue",
    color: "#8B5CF6",
    gradientFrom: "#A78BFA",
    gradientTo: "#7C3AED",
    bgClass: "bg-violet-500/20 border-violet-500 text-violet-300",
  },
  {
    id: "expense",
    label: "Expenses",
    color: "#EF4444",
    gradientFrom: "#F87171",
    gradientTo: "#DC2626",
    bgClass: "bg-rose-500/20 border-rose-500 text-rose-300",
  },
  {
    id: "orders",
    label: "Orders",
    color: "#F59E0B",
    gradientFrom: "#FBBF24",
    gradientTo: "#D97706",
    bgClass: "bg-amber-500/20 border-amber-500 text-amber-300",
  },
  {
    id: "profit",
    label: "Net Profit",
    color: "#10B981",
    gradientFrom: "#34D399",
    gradientTo: "#059669",
    bgClass: "bg-emerald-500/20 border-emerald-500 text-emerald-300",
  },
];

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DashboardBarChart = ({
  sales = [],
  orders = [],
  expenses = [],
  selectedMonth = new Date().getMonth().toString(),
  selectedYear = new Date().getFullYear().toString(),
}) => {
  const [activeMetric, setActiveMetric] = useState("all");
  const [hoveredDay, setHoveredDay] = useState(null);

  // Determine active month and year for daily 30-day rendering
  const activeYear = useMemo(() => {
    if (selectedYear !== "All") return parseInt(selectedYear, 10);
    // Find latest year with data or default to current year
    const allDates = [...sales, ...orders, ...expenses]
      .map((item) => new Date(item.date))
      .filter((d) => !isNaN(d.getTime()));
    if (allDates.length > 0) {
      return Math.max(...allDates.map((d) => d.getFullYear()));
    }
    return new Date().getFullYear();
  }, [sales, orders, expenses, selectedYear]);

  const activeMonthIndex = useMemo(() => {
    if (selectedMonth !== "All") return parseInt(selectedMonth, 10);
    // If "All Months", default to current month or latest month with data
    const allDates = [...sales, ...orders, ...expenses]
      .map((item) => new Date(item.date))
      .filter((d) => !isNaN(d.getTime()) && d.getFullYear() === activeYear);
    if (allDates.length > 0) {
      return Math.max(...allDates.map((d) => d.getMonth()));
    }
    return new Date().getMonth();
  }, [sales, orders, expenses, selectedMonth, activeYear]);

  // Number of days in the active month (e.g. 28, 30, 31)
  const daysInMonth = useMemo(() => {
    return new Date(activeYear, activeMonthIndex + 1, 0).getDate();
  }, [activeYear, activeMonthIndex]);

  // Aggregate daily data
  const dailyData = useMemo(() => {
    const days = [];
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        day,
        revenue: 0,
        salesMoney: 0,
        ordersMoney: 0,
        ordersCount: 0,
        expense: 0,
        profit: 0,
      });
    }

    // Accumulate sales
    sales.forEach((s) => {
      const d = new Date(s.date);
      if (
        !isNaN(d.getTime()) &&
        d.getFullYear() === activeYear &&
        d.getMonth() === activeMonthIndex
      ) {
        const dayNum = d.getDate();
        if (dayNum >= 1 && dayNum <= daysInMonth) {
          const sVal = Number(s.totalSales) || Number(s.totalSale) || 0;
          days[dayNum - 1].salesMoney += sVal;
          days[dayNum - 1].revenue += sVal;
        }
      }
    });

    // Accumulate orders
    orders.forEach((o) => {
      const d = new Date(o.date);
      if (
        !isNaN(d.getTime()) &&
        d.getFullYear() === activeYear &&
        d.getMonth() === activeMonthIndex
      ) {
        const dayNum = d.getDate();
        if (dayNum >= 1 && dayNum <= daysInMonth) {
          const oVal = Number(o.totalAmount) || Number(o.amount) || 0;
          days[dayNum - 1].ordersMoney += oVal;
          days[dayNum - 1].ordersCount += 1;
          days[dayNum - 1].revenue += oVal;
        }
      }
    });

    // Accumulate expenses
    expenses.forEach((e) => {
      const d = new Date(e.date);
      if (
        !isNaN(d.getTime()) &&
        d.getFullYear() === activeYear &&
        d.getMonth() === activeMonthIndex
      ) {
        const dayNum = d.getDate();
        if (dayNum >= 1 && dayNum <= daysInMonth) {
          const eVal = Number(e.totalAmount) || 0;
          days[dayNum - 1].expense += eVal;
        }
      }
    });

    // Calculate net profits
    days.forEach((item) => {
      item.profit = item.revenue - item.expense;
    });

    return days;
  }, [sales, orders, expenses, activeYear, activeMonthIndex, daysInMonth]);

  // Find max value for Y-axis scaling
  const maxValue = useMemo(() => {
    let max = 1000;
    dailyData.forEach((d) => {
      if (d.revenue > max) max = d.revenue;
      if (d.expense > max) max = d.expense;
      if (d.ordersMoney > max) max = d.ordersMoney;
      if (d.profit > max) max = d.profit;
    });
    // Add 15% headroom
    return Math.ceil(max * 1.15);
  }, [dailyData]);

  // Month totals
  const monthTotals = useMemo(() => {
    return dailyData.reduce(
      (acc, d) => ({
        revenue: acc.revenue + d.revenue,
        expense: acc.expense + d.expense,
        ordersMoney: acc.ordersMoney + d.ordersMoney,
        ordersCount: acc.ordersCount + d.ordersCount,
        profit: acc.profit + d.profit,
      }),
      { revenue: 0, expense: 0, ordersMoney: 0, ordersCount: 0, profit: 0 }
    );
  }, [dailyData]);

  const formatCurrency = (val) =>
    `₹ ${(val || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

  const formatCompact = (val) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)}Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
    if (val >= 1000) return `₹${(val / 1000).toFixed(0)}k`;
    return `₹${val}`;
  };

  const monthLabel = `${MONTH_NAMES[activeMonthIndex]} ${activeYear}`;
  const isDefaultedNotice = selectedMonth === "All" || selectedYear === "All";

  return (
    <div className="bg-secondary/90 backdrop-blur-md rounded-3xl p-4 sm:p-6 border border-[#545454]/40 shadow-2xl flex flex-col gap-5">
      {/* ── Top Header Section ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-gray-700/50">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-accent/20 text-accent flex items-center justify-center">
              <LuChartBar size={20} />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-text-primary tracking-tight">
              30-Day Financial Performance
            </h2>
          </div>

          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-accent/15 text-accent border border-accent/30">
              <LuCalendar size={13} />
              <span>Showing: {monthLabel}</span>
            </span>

            {isDefaultedNotice && (
              <span className="text-[11px] text-gray-400 italic">
                (Displaying active month • Filtered by dashboard controls)
              </span>
            )}
          </div>
        </div>

        {/* Category / Metric Selector Pills */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto custom-scrollbar pb-1">
          {METRICS.map((metric) => {
            const isSelected = activeMetric === metric.id;
            return (
              <button
                key={metric.id}
                onClick={() => setActiveMetric(metric.id)}
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap border ${
                  isSelected
                    ? `${metric.bgClass} shadow-md`
                    : "bg-form-bg/70 border-transparent text-text-primary/70 hover:text-text-primary hover:bg-form-bg"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: metric.color }}
                  />
                  <span>{metric.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Summary KPI Pills ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="bg-form-bg/60 rounded-xl p-2.5 border border-violet-500/20">
          <span className="text-[11px] font-medium text-violet-400 block">Month Revenue</span>
          <span className="text-sm sm:text-base font-bold text-text-primary">
            {formatCurrency(monthTotals.revenue)}
          </span>
        </div>
        <div className="bg-form-bg/60 rounded-xl p-2.5 border border-rose-500/20">
          <span className="text-[11px] font-medium text-rose-400 block">Month Expenses</span>
          <span className="text-sm sm:text-base font-bold text-text-primary">
            {formatCurrency(monthTotals.expense)}
          </span>
        </div>
        <div className="bg-form-bg/60 rounded-xl p-2.5 border border-amber-500/20">
          <span className="text-[11px] font-medium text-amber-400 block">Month Orders</span>
          <span className="text-sm sm:text-base font-bold text-text-primary">
            {monthTotals.ordersCount} ({formatCurrency(monthTotals.ordersMoney)})
          </span>
        </div>
        <div className="bg-form-bg/60 rounded-xl p-2.5 border border-emerald-500/20">
          <span className="text-[11px] font-medium text-emerald-400 block">Month Net Profit</span>
          <span className="text-sm sm:text-base font-bold text-text-primary">
            {formatCurrency(monthTotals.profit)}
          </span>
        </div>
      </div>

      {/* ── Main Chart Canvas Area ── */}
      <div className="relative pt-2">
        {/* Y-Axis Gridlines & Labels */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8 pl-1">
          {[1, 0.75, 0.5, 0.25, 0].map((step, idx) => (
            <div key={idx} className="flex items-center w-full">
              <span className="text-[10px] text-gray-500 w-12 text-left font-mono">
                {formatCompact(maxValue * step)}
              </span>
              <div className="flex-1 border-b border-gray-700/30 ml-1" />
            </div>
          ))}
        </div>

        {/* 30-Day Bars Scrollable Container on Mobile, Full Width on Desktop */}
        <div className="overflow-x-auto custom-scrollbar pl-12">
          <div
            className="flex items-end gap-1 sm:gap-1.5 h-[280px] sm:h-[320px] pt-4 pb-8 min-w-[700px] lg:min-w-0"
            style={{ width: "100%" }}
          >
            {dailyData.map((d) => {
              const isHovered = hoveredDay === d.day;

              // Heights relative to maxValue
              const revHeight = Math.max(
                d.revenue > 0 ? (d.revenue / maxValue) * 100 : 0,
                d.revenue > 0 ? 3 : 0
              );
              const expHeight = Math.max(
                d.expense > 0 ? (d.expense / maxValue) * 100 : 0,
                d.expense > 0 ? 3 : 0
              );
              const ordHeight = Math.max(
                d.ordersMoney > 0 ? (d.ordersMoney / maxValue) * 100 : 0,
                d.ordersMoney > 0 ? 3 : 0
              );
              const profHeight = Math.max(
                d.profit > 0 ? (d.profit / maxValue) * 100 : 0,
                d.profit > 0 ? 3 : 0
              );

              return (
                <div
                  key={d.day}
                  onMouseEnter={() => setHoveredDay(d.day)}
                  onMouseLeave={() => setHoveredDay(null)}
                  className={`flex-1 flex flex-col items-center h-full justify-end relative cursor-pointer group transition-all ${
                    isHovered ? "z-20" : "z-10"
                  }`}
                >
                  {/* Glowing background column on hover */}
                  {isHovered && (
                    <div className="absolute inset-y-0 -inset-x-1 bg-accent/10 rounded-xl pointer-events-none transition-all border border-accent/30" />
                  )}

                  {/* Bars Area */}
                  <div className="w-full h-full flex items-end justify-center gap-0.5 pb-1">
                    {/* Mode: ALL METRICS COMPARISON (4 grouped bars) */}
                    {activeMetric === "all" && (
                      <div className="w-full flex items-end justify-center gap-0.5 h-full">
                        {/* Revenue Bar */}
                        <div
                          style={{ height: `${revHeight}%` }}
                          className={`flex-1 rounded-t-sm transition-all duration-300 ${
                            d.revenue > 0
                              ? "bg-gradient-to-t from-violet-600 to-violet-400 group-hover:brightness-125 shadow-sm"
                              : "bg-gray-700/20"
                          }`}
                        />
                        {/* Expense Bar */}
                        <div
                          style={{ height: `${expHeight}%` }}
                          className={`flex-1 rounded-t-sm transition-all duration-300 ${
                            d.expense > 0
                              ? "bg-gradient-to-t from-rose-600 to-rose-400 group-hover:brightness-125 shadow-sm"
                              : "bg-gray-700/20"
                          }`}
                        />
                        {/* Orders Bar */}
                        <div
                          style={{ height: `${ordHeight}%` }}
                          className={`flex-1 rounded-t-sm transition-all duration-300 ${
                            d.ordersMoney > 0
                              ? "bg-gradient-to-t from-amber-600 to-amber-400 group-hover:brightness-125 shadow-sm"
                              : "bg-gray-700/20"
                          }`}
                        />
                        {/* Profit Bar */}
                        <div
                          style={{ height: `${profHeight}%` }}
                          className={`flex-1 rounded-t-sm transition-all duration-300 ${
                            d.profit > 0
                              ? "bg-gradient-to-t from-emerald-600 to-emerald-400 group-hover:brightness-125 shadow-sm"
                              : "bg-gray-700/20"
                          }`}
                        />
                      </div>
                    )}

                    {/* Mode: REVENUE ONLY */}
                    {activeMetric === "revenue" && (
                      <div
                        style={{ height: `${revHeight}%` }}
                        className={`w-full rounded-t-md transition-all duration-300 ${
                          d.revenue > 0
                            ? "bg-gradient-to-t from-violet-700 via-violet-500 to-purple-300 shadow-lg shadow-violet-500/20 group-hover:brightness-125"
                            : "bg-gray-800/40 h-1"
                        }`}
                      />
                    )}

                    {/* Mode: EXPENSE ONLY */}
                    {activeMetric === "expense" && (
                      <div
                        style={{ height: `${expHeight}%` }}
                        className={`w-full rounded-t-md transition-all duration-300 ${
                          d.expense > 0
                            ? "bg-gradient-to-t from-rose-700 via-rose-500 to-red-300 shadow-lg shadow-rose-500/20 group-hover:brightness-125"
                            : "bg-gray-800/40 h-1"
                        }`}
                      />
                    )}

                    {/* Mode: ORDERS ONLY */}
                    {activeMetric === "orders" && (
                      <div
                        style={{ height: `${ordHeight}%` }}
                        className={`w-full rounded-t-md transition-all duration-300 ${
                          d.ordersMoney > 0
                            ? "bg-gradient-to-t from-amber-700 via-amber-500 to-yellow-300 shadow-lg shadow-amber-500/20 group-hover:brightness-125"
                            : "bg-gray-800/40 h-1"
                        }`}
                      />
                    )}

                    {/* Mode: PROFIT ONLY */}
                    {activeMetric === "profit" && (
                      <div
                        style={{ height: `${profHeight}%` }}
                        className={`w-full rounded-t-md transition-all duration-300 ${
                          d.profit > 0
                            ? "bg-gradient-to-t from-emerald-700 via-emerald-500 to-teal-300 shadow-lg shadow-emerald-500/20 group-hover:brightness-125"
                            : "bg-gray-800/40 h-1"
                        }`}
                      />
                    )}
                  </div>

                  {/* Day Label on X-axis */}
                  <span
                    className={`text-[10px] font-mono mt-1 ${
                      isHovered
                        ? "text-accent font-bold scale-110"
                        : d.day % 5 === 0 || d.day === 1 || d.day === daysInMonth
                        ? "text-text-primary/70 font-semibold"
                        : "text-text-primary/40"
                    }`}
                  >
                    {d.day}
                  </span>

                  {/* Floating Tooltip Card */}
                  {isHovered && (
                    <div className="absolute bottom-[90%] left-1/2 -translate-x-1/2 mb-2 w-52 sm:w-60 bg-[#161228] border border-accent/50 rounded-2xl p-3 shadow-2xl z-30 pointer-events-none text-left backdrop-blur-xl">
                      <div className="flex items-center justify-between pb-1.5 border-b border-gray-700/60 mb-2">
                        <span className="text-xs font-bold text-white">
                          Day {d.day}, {MONTH_NAMES[activeMonthIndex].slice(0, 3)}{" "}
                          {activeYear}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent/20 text-accent font-medium">
                          Daily Stats
                        </span>
                      </div>

                      <div className="space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-violet-300">
                            <span className="w-2 h-2 rounded-full bg-violet-400" />
                            Revenue:
                          </span>
                          <span className="font-semibold text-white">
                            {formatCurrency(d.revenue)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-rose-300">
                            <span className="w-2 h-2 rounded-full bg-rose-400" />
                            Expenses:
                          </span>
                          <span className="font-semibold text-white">
                            {formatCurrency(d.expense)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-amber-300">
                            <span className="w-2 h-2 rounded-full bg-amber-400" />
                            Orders ({d.ordersCount}):
                          </span>
                          <span className="font-semibold text-white">
                            {formatCurrency(d.ordersMoney)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between pt-1 border-t border-gray-700/40">
                          <span className="flex items-center gap-1.5 text-emerald-300 font-medium">
                            <span className="w-2 h-2 rounded-full bg-emerald-400" />
                            Net Profit:
                          </span>
                          <span
                            className={`font-bold ${
                              d.profit >= 0 ? "text-emerald-400" : "text-rose-400"
                            }`}
                          >
                            {formatCurrency(d.profit)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardBarChart;
