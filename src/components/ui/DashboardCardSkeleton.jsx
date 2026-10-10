"use client";

import React from "react";

const DashboardCardSkeleton = ({ className = "" }) => {
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
        animate-pulse
        transition-all duration-300 ease-in-out
        ${className}
      `}
    >
      {/* Header with Icon & Trend Skeleton */}
      <div className="flex items-center justify-between">
        {/* Icon Container Skeleton */}
        <div className="w-11 h-11 sm:w-12 sm:h-12 bg-accent/20 rounded-2xl flex items-center justify-center p-2.5">
          <div className="w-6 h-6 bg-accent/40 rounded-lg"></div>
        </div>
        {/* Trend Indicator Skeleton */}
        <div className="h-5 w-16 bg-gray-700/50 rounded-full"></div>
      </div>

      {/* Card Data Container Skeleton */}
      <div className="flex flex-col gap-1.5 flex-1 justify-end">
        {/* Title Skeleton */}
        <div className="h-3.5 bg-gray-700/50 rounded-md w-28"></div>

        {/* Value Skeleton */}
        <div className="h-7 sm:h-8 bg-gray-700/70 rounded-lg w-36 my-0.5"></div>

        {/* Subtitle Skeleton */}
        <div className="h-3 bg-gray-700/40 rounded-md w-44"></div>
      </div>
    </div>
  );
};

const DashboardCardSkeletonGrid = ({ count = 4, className = "" }) => {
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 transition-all duration-300 ease-in-out ${className}`}
    >
      {Array.from({ length: count }).map((_, index) => (
        <DashboardCardSkeleton key={index} />
      ))}
    </div>
  );
};

export default DashboardCardSkeleton;
export { DashboardCardSkeletonGrid };
