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

  const getTrendColor = () => {
    if (!trend) return "";
    return trend === "up" ? "text-green" : "text-red";
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    return trend === "up" ? (
      <VscTriangleUp size={12} className="text-green" />
    ) : (
      <VscTriangleDown size={12} className="text-red" />
    );
  };

  return (
    <div
      className={`
        w-full lg:w-auto lg:min-w-[270px] lg:max-w-[280px]
        min-h-[155px] lg:h-[155px]
        h-auto
        bg-secondary 
        rounded-[20px] 
        p-3 sm:p-4 lg:p-3
        flex flex-col 
        gap-4 
        shadow-lg
        transition-all duration-300 ease-in-out
        ${className}
      `}
    >
      {/* Header with Icon */}
      <div className="flex items-start justify-between">
        {/* Icon Container */}
        <div
          className={`
            w-10 h-10 sm:w-12 sm:h-12 lg:w-10 lg:h-10
            ${iconBgColor} 
            rounded-[25.33px] 
            flex items-center justify-center 
            p-2
            transition-all duration-300 ease-in-out
          `}
        >
          {icon &&
            React.cloneElement(icon, {
              size: 24,
              className: `${iconColor} sm:scale-110 lg:scale-100 transition-transform duration-300`,
            })}
        </div>
      </div>

      {/* Card Data Container */}
      <div className="flex flex-col gap-1 flex-1">
        {/* Title */}
        <h3 className="text-sm sm:text-base lg:text-sm font-medium text-text-primary leading-tight">
          {title}
        </h3>

        {/* Value with Trend */}
        <div className="flex items-center gap-2 flex-wrap">
          <div
            className={`text-xl sm:text-2xl lg:text-2xl font-bold ${valueColor} leading-tight`}
          >
            {formatValue(value)}
          </div>

          {/* Trend Indicator */}
          {trend && trendValue && (
            <div
              className={`flex items-center bg-black rounded-[15px] px-2 py-0.5 gap-1 ${getTrendColor()}`}
            >
              {getTrendIcon()}
              <span className="text-sm font-medium">{trendValue}</span>
            </div>
          )}
        </div>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-xs sm:text-sm lg:text-xs text-text-primary leading-tight mt-1">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default DashboardCard;
