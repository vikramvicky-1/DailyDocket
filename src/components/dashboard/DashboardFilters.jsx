"use client";

import React from "react";
import { LuCalendar, LuFilter, LuRotateCcw } from "react-icons/lu";

export const MONTH_NAMES = [
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

const DashboardFilters = ({
  selectedMonth = new Date().getMonth().toString(),
  onMonthChange,
  selectedYear = new Date().getFullYear().toString(),
  onYearChange,
  availableYears = [],
}) => {
  const currentMonth = new Date().getMonth().toString();
  const currentYear = new Date().getFullYear().toString();
  const yearsList = availableYears.length > 0 ? availableYears : [currentYear];

  const monthOptions = [
    { value: "All", label: "All Months" },
    ...MONTH_NAMES.map((name, index) => ({
      value: index.toString(),
      label: name,
    })),
  ];

  const yearOptions = [
    { value: "All", label: "All Years" },
    ...yearsList.map((yr) => ({
      value: yr.toString(),
      label: yr.toString(),
    })),
  ];

  const isCurrentDefault =
    selectedMonth === currentMonth && selectedYear === currentYear;

  const handleReset = () => {
    onMonthChange(currentMonth);
    onYearChange(currentYear);
  };

  return (
    <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 bg-secondary/80 backdrop-blur-md px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl border border-[#545454]/40 shadow-lg">
      <div className="flex items-center gap-1.5 text-text-primary/70 text-xs sm:text-sm font-medium mr-1">
        <LuFilter className="text-accent text-base" />
        <span className="hidden sm:inline">Filter By:</span>
      </div>

      {/* Month Dropdown */}
      <div className="relative min-w-[130px] sm:min-w-[145px]">
        <select
          value={selectedMonth}
          onChange={(e) => onMonthChange(e.target.value)}
          className="w-full h-9 sm:h-10 px-3 pr-8 bg-form-bg border border-[#545454] rounded-xl text-text-primary text-xs sm:text-sm font-medium focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all cursor-pointer appearance-none"
        >
          {monthOptions.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-form-bg text-text-primary">
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-primary/60">
          <LuCalendar size={15} />
        </div>
      </div>

      {/* Year Dropdown */}
      <div className="relative min-w-[110px] sm:min-w-[125px]">
        <select
          value={selectedYear}
          onChange={(e) => onYearChange(e.target.value)}
          className="w-full h-9 sm:h-10 px-3 pr-8 bg-form-bg border border-[#545454] rounded-xl text-text-primary text-xs sm:text-sm font-medium focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all cursor-pointer appearance-none"
        >
          {yearOptions.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-form-bg text-text-primary">
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-primary/60">
          <span className="text-xs font-semibold">Yr</span>
        </div>
      </div>

      {/* Reset Filter Button */}
      {!isCurrentDefault ? (
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-accent/20 hover:bg-accent/30 text-accent rounded-xl text-xs font-medium transition-colors cursor-pointer border border-accent/30"
          title="Reset to current month & year"
        >
          <LuRotateCcw size={13} />
          <span className="hidden sm:inline">Current Month</span>
        </button>
      ) : (
        <span className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Current Period
        </span>
      )}
    </div>
  );
};

export default DashboardFilters;
