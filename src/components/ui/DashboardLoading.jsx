"use client";

import React from "react";
import { DashboardCardSkeletonGrid } from "./DashboardCardSkeleton";

const DashboardLoading = () => {
  return (
    <div className="text-text-primary">
      {/* Header Skeleton */}
      <div className="mb-6">
        <div className="h-8 w-48 bg-gray-700/40 rounded animate-pulse mb-2"></div>
      </div>

      {/* Dashboard Cards Skeleton Grid */}
      <DashboardCardSkeletonGrid count={4} />
    </div>
  );
};

export default DashboardLoading;
