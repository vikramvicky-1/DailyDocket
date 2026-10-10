"use client";

import React from "react";
import { VscTriangleUp, VscTriangleDown } from "react-icons/vsc";
const DashboardCard = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendValue,
  iconBgColor = "bg-accent",
  iconColor = "text-white",
  valueColor = "text-text-primary",
  className = "",
}) => {
  const formatValue = (val) => {
    if (typeof val === "number") {
      return val.toLocaleString("en-IN");
    }
    return val;
  };

  const getTrendBadge = () => {
    if (!trend || !trendValue) return null;
    const isUp = trend === "up";
    return (
      <div
        className={`flex items-center rounded-full px-2.5 py-0.5 gap-1 text-xs font-semibold border ${
          isUp
            ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
            : "bg-rose-500/15 text-rose-400 border-rose-500/30"
        }`}
      >
        {isUp ? (
          <VscTriangleUp size={11} className="text-emerald-400" />
        ) : (
          <VscTriangleDown size={11} className="text-rose-400" />
        )}
        <span>{trendValue}</span>
      </div>
    );
  };

  return (
    <div
      className={`
        w-full
        min-h-[160px]
        bg-secondary/90
        backdrop-blur-md
        rounded-2xl sm:rounded-3xl
        p-4 sm:p-5
        flex flex-col 
        justify-between
        gap-3 sm:gap-4
        shadow-xl
        border border-[#545454]/40
        hover:border-accent/50
        transition-all duration-300 ease-in-out
        hover:translate-y-[-2px]
        ${className}
      `}
    >
      {/* Header with Icon & Trend */}
      <div className="flex items-center justify-between">
        {/* Icon Container */}
        <div
          className={`
            w-11 h-11 sm:w-12 sm:h-12
            ${iconBgColor} 
            rounded-2xl 
            flex items-center justify-center 
            p-2.5
            shadow-md
            transition-all duration-300 ease-in-out
          `}
        >
          {icon &&
            React.cloneElement(icon, {
              size: 24,
              className: `${iconColor} transition-transform duration-300`,
            })}
        </div>

        {/* Trend Indicator in top-right */}
        {getTrendBadge()}
      </div>

      {/* Card Data Container */}
      <div className="flex flex-col gap-1.5 flex-1 justify-end">
        {/* Title */}
        <h3 className="text-xs sm:text-sm font-medium text-text-primary/70 leading-tight">
          {title}
        </h3>

        {/* Value */}
        <div className={`text-xl sm:text-2xl font-bold ${valueColor} tracking-tight leading-tight`}>
          {formatValue(value)}
        </div>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-[11px] sm:text-xs text-text-primary/60 leading-tight truncate">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default DashboardCard;
