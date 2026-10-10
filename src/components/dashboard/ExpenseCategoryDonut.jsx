"use client";

import React, { useState, useMemo } from "react";
import { LuChartPie, LuTag } from "react-icons/lu";

const PALETTE = [
  "#6C5CE7", // Accent purple
  "#00CEC9", // Cyan
  "#FD79A8", // Pink
  "#FDCB6E", // Gold/Amber
  "#00B894", // Mint/Emerald
  "#E17055", // Coral
  "#0984E3", // Blue
  "#A29BFE", // Lavender
  "#D63031", // Crimson
];

const ExpenseCategoryDonut = ({ expenses = [] }) => {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const { categoryData, totalExpense } = useMemo(() => {
    const map = {};
    let total = 0;

    expenses.forEach((e) => {
      const cat = e.category?.trim() || "Uncategorized";
      const amt = Number(e.totalAmount) || 0;
      map[cat] = (map[cat] || 0) + amt;
      total += amt;
    });

    const entries = Object.entries(map).map(([name, amount], index) => ({
      name,
      amount,
      color: PALETTE[index % PALETTE.length],
      percent: total > 0 ? (amount / total) * 100 : 0,
    }));

    // Sort descending by amount
    entries.sort((a, b) => b.amount - a.amount);

    return { categoryData: entries, totalExpense: total };
  }, [expenses]);

  const formatCurrency = (val) =>
    `₹ ${(val || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

  // SVG Donut coordinates calculation
  const radius = 68;
  const strokeWidth = 24;
  const center = 90;
  const circumference = 2 * Math.PI * radius;

  let cumulativeAngle = 0;
  const slices = categoryData.map((item, idx) => {
    const strokeDasharray = `${(item.percent / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -cumulativeAngle;
    cumulativeAngle += (item.percent / 100) * circumference;
    return {
      ...item,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  return (
    <div className="bg-secondary/90 backdrop-blur-md rounded-3xl p-5 sm:p-6 border border-[#545454]/40 shadow-xl flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-gray-700/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-accent/20 text-accent flex items-center justify-center">
              <LuChartPie size={18} />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-text-primary">
              Expense by Category
            </h3>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-accent/15 text-accent border border-accent/20">
            {categoryData.length} Categories
          </span>
        </div>

        {categoryData.length === 0 ? (
          <div className="py-12 text-center text-text-primary/50 text-sm">
            No expense records found for this period
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center my-4">
            {/* SVG Donut Chart */}
            <div className="relative flex items-center justify-center">
              <svg width="180" height="180" viewBox="0 0 180 180" className="transform -rotate-90">
                {/* Background Ring */}
                <circle
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="transparent"
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth={strokeWidth}
                />
                {/* Slices */}
                {slices.map((slice, idx) => (
                  <circle
                    key={idx}
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="transparent"
                    stroke={slice.color}
                    strokeWidth={hoveredIdx === idx ? strokeWidth + 4 : strokeWidth}
                    strokeDasharray={slice.strokeDasharray}
                    strokeDashoffset={slice.strokeDashoffset}
                    className="transition-all duration-300 cursor-pointer"
                    onMouseEnter={() => setHoveredIdx(idx)}
                    onMouseLeave={() => setHoveredIdx(null)}
                  />
                ))}
              </svg>

              {/* Donut Center Display */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                {hoveredIdx !== null && categoryData[hoveredIdx] ? (
                  <>
                    <span className="text-[10px] text-gray-400 truncate max-w-[90px]">
                      {categoryData[hoveredIdx].name}
                    </span>
                    <span className="text-sm font-bold text-white">
                      {categoryData[hoveredIdx].percent.toFixed(1)}%
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-[10px] uppercase font-bold text-text-primary/50 tracking-wider">
                      Total
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-text-primary">
                      {formatCurrency(totalExpense)}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Category Legend List */}
            <div className="space-y-2 max-h-[170px] overflow-y-auto custom-scrollbar pr-1">
              {categoryData.slice(0, 6).map((cat, idx) => (
                <div
                  key={idx}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  className={`flex items-center justify-between p-1.5 rounded-xl transition-all cursor-pointer ${
                    hoveredIdx === idx ? "bg-white/10" : "hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="text-xs text-text-primary font-medium truncate">
                      {cat.name}
                    </span>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <span className="text-xs font-bold text-text-primary block">
                      {formatCurrency(cat.amount)}
                    </span>
                    <span className="text-[10px] text-gray-400 block">
                      {cat.percent.toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="pt-2 border-t border-gray-700/40 text-[11px] text-text-primary/60 flex items-center justify-between">
        <span>Highest expense: {categoryData[0]?.name || "N/A"}</span>
        <span className="font-semibold text-accent">{categoryData[0]?.percent.toFixed(1) || 0}% share</span>
      </div>
    </div>
  );
};

export default ExpenseCategoryDonut;
