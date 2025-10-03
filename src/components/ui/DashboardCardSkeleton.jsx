"use client";

import React from "react";
import Skeleton, { SkeletonCircle } from "./Skeleton";

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
        ${className}
      `}
    >
      {/* Header with Icon Skeleton */}
      <div className="flex items-start justify-between">
        {/* Icon Container Skeleton */}
        <SkeletonCircle 
          size="40px" 
          className="bg-gray-700/40" 
        />
      </div>

      {/* Card Data Container */}
      <div className="flex flex-col gap-2 flex-1">
        {/* Title Skeleton */}
        <Skeleton
          width="60%"
          height="14px"
          className="bg-gray-700/30"
          rounded="rounded"
        />

        {/* Value with Trend Skeleton */}
        <div className="flex items-center gap-2">
          {/* Main Value Skeleton */}
          <Skeleton
            width="120px"
            height="28px"
            className="bg-gray-700/40"
            rounded="rounded"
          />
          
          {/* Trend Indicator Skeleton */}
          <Skeleton
            width="50px"
            height="20px"
            className="bg-gray-700/30"
            rounded="rounded-[15px]"
          />
        </div>

        {/* Subtitle Skeleton */}
        <Skeleton
          width="80%"
          height="12px"
          className="bg-gray-700/20"
          rounded="rounded"
        />
      </div>
    </div>
  );
};

// Grid of skeleton cards for dashboard
export const DashboardCardSkeletonGrid = ({ count = 4, className = "" }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <DashboardCardSkeleton key={index} />
      ))}
    </div>
  );
};

export default DashboardCardSkeleton;
