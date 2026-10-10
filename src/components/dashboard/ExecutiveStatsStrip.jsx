"use client";

import React from "react";
import { LuTrendingUp, LuActivity, LuPercent, LuCircleCheck } from "react-icons/lu";

const ExecutiveStatsStrip = ({
  dailyAvgRevenue = 0,
  dailyAvgExpense = 0,
  profitMargin = 0,
  orderCompletionRate = 0,
  periodLabel = "Selected Period",
}) => {
  const formatCurrency = (val) => `₹ ${(val || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

  const stats = [
    {
      label: "Daily Avg Revenue",
      value: formatCurrency(dailyAvgRevenue),
      sub: "Sales & Orders / day",
      icon: <LuTrendingUp className="text-violet-400" size={18} />,
      badgeColor: "bg-violet-500/10 text-violet-300 border-violet-500/20",
    },
    {
      label: "Daily Avg Expense",
      value: formatCurrency(dailyAvgExpense),
      sub: "Operational burn / day",
      icon: <LuActivity className="text-rose-400" size={18} />,
      badgeColor: "bg-rose-500/10 text-rose-300 border-rose-500/20",
    },
    {
      label: "Net Profit Margin",
      value: `${profitMargin.toFixed(1)}%`,
      sub: profitMargin >= 0 ? "Healthy positive margin" : "Margin deficit",
      icon: <LuPercent className="text-emerald-400" size={18} />,
      badgeColor: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
    },
    {
      label: "Order Fulfillment",
      value: `${orderCompletionRate.toFixed(1)}%`,
      sub: "Successfully delivered",
      icon: <LuCircleCheck className="text-amber-400" size={18} />,
      badgeColor: "bg-amber-500/10 text-amber-300 border-amber-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 my-2">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className="bg-secondary/70 backdrop-blur-md border border-[#545454]/40 rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between hover:border-accent/40 transition-all shadow-md group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-text-primary/70">{stat.label}</span>
            <div className={`p-1.5 rounded-lg border ${stat.badgeColor}`}>
              {stat.icon}
            </div>
          </div>
          <div>
            <div className="text-lg sm:text-xl font-bold text-text-primary tracking-tight">
              {stat.value}
            </div>
            <p className="text-[11px] sm:text-xs text-text-primary/50 mt-0.5 truncate">
              {stat.sub}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExecutiveStatsStrip;
