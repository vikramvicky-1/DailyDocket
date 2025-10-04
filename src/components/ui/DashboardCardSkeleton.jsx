"use client";

import React from "react";

const DashboardCardSkeleton = ({ className = "" }) => {
  return (
    <div
      className={`
        w-[268px] h-[155px] 
        bg-secondary 
        rounded-[20px] 
        p-3 
        flex flex-col 
        gap-4 
        shadow-lg
        animate-pulse
        ${className}
      `}
    >
      {/* Header with Icon Skeleton */}
      <div className="flex items-start justify-between">
        {/* Icon Container Skeleton */}
        <div className="w-10 h-10 bg-tertiary rounded-[25.33px] flex items-center justify-center">
          <div className="w-6 h-6 bg-gray-600 rounded"></div>
        </div>
      </div>

      {/* Card Data Container Skeleton */}
      <div className="flex flex-col gap-1 flex-1">
        {/* Title Skeleton */}
        <div className="h-4 bg-tertiary rounded w-3/4"></div>

        {/* Value with Trend Skeleton */}
        <div className="flex items-center gap-2 mt-1">
          {/* Value Skeleton */}
          <div className="h-8 bg-tertiary rounded w-20"></div>

          {/* Trend Indicator Skeleton */}
          <div className="h-6 bg-tertiary rounded-[15px] w-12"></div>
        </div>

        {/* Subtitle Skeleton */}
        <div className="h-3 bg-tertiary rounded w-2/3 mt-1"></div>
      </div>
    </div>
  );
};

const DashboardCardSkeletonGrid = ({ count = 4, className = "" }) => {
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 ${className}`}
    >
      {Array.from({ length: count }).map((_, index) => (
        <DashboardCardSkeleton key={index} />
      ))}
    </div>
  );
};

export default DashboardCardSkeleton;
export { DashboardCardSkeletonGrid };
