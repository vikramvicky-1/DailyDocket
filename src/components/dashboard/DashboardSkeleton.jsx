"use client";

import React from "react";
import { DashboardCardSkeletonGrid } from "../ui/DashboardCardSkeleton";

const DashboardSkeleton = () => {
  // Pre-generate staggered bar heights for a realistic 30-day chart skeleton
  const sampleBarHeights = [
    40, 65, 30, 85, 50, 70, 95, 45, 60, 35,
    80, 55, 90, 40, 75, 60, 85, 30, 70, 95,
    50, 65, 40, 80, 55, 90, 45, 75, 60, 85,
  ];

  return (
    <div className="text-text-primary space-y-6 pb-8 animate-pulse">
      {/* ── 1. Top Header & Filters Skeleton ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="h-8 w-44 bg-gray-700/60 rounded-xl mb-2"></div>
          <div className="h-4 w-72 sm:w-96 bg-gray-700/30 rounded-md"></div>
        </div>

        {/* Filter controls skeleton */}
        <div className="flex items-center gap-2.5 bg-secondary/80 px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl border border-[#545454]/30">
          <div className="w-4 h-4 bg-accent/30 rounded-md"></div>
          <div className="h-9 w-32 bg-form-bg rounded-xl border border-gray-700/40"></div>
          <div className="h-9 w-24 bg-form-bg rounded-xl border border-gray-700/40"></div>
          <div className="h-6 w-24 bg-emerald-500/10 rounded-xl border border-emerald-500/20 hidden lg:block"></div>
        </div>
      </div>

      {/* ── 2. Four Dynamic KPI Cards Skeleton Grid ── */}
      <DashboardCardSkeletonGrid count={4} />

      {/* ── 3. Executive Mini-KPI Metrics Bar Skeleton ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 p-3 sm:p-4 bg-secondary/60 rounded-2xl border border-[#545454]/30 shadow-lg">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-accent/20 flex-shrink-0"></div>
            <div className="flex flex-col gap-1.5 flex-1 min-w-0">
              <div className="h-3 w-20 bg-gray-700/40 rounded"></div>
              <div className="h-5 w-24 bg-gray-700/60 rounded"></div>
            </div>
          </div>
        ))}
      </div>

      {/* ── 4. Visual Analytics Grid Skeleton (Donut & Cash Flow) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
        {/* Category Donut Skeleton */}
        <div className="bg-secondary/90 backdrop-blur-md rounded-3xl p-5 sm:p-6 border border-[#545454]/40 shadow-xl flex flex-col justify-between min-h-[340px]">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-700/40">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-accent/20"></div>
                <div className="h-5 w-36 bg-gray-700/60 rounded-md"></div>
              </div>
              <div className="h-6 w-24 bg-accent/15 rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center my-6">
              {/* Circular Donut Ring Skeleton */}
              <div className="flex items-center justify-center">
                <div className="w-40 h-40 rounded-full border-8 border-gray-700/40 flex items-center justify-center relative">
                  <div className="w-24 h-24 rounded-full bg-secondary flex flex-col items-center justify-center gap-1">
                    <div className="h-2.5 w-12 bg-gray-700/40 rounded"></div>
                    <div className="h-5 w-16 bg-gray-700/60 rounded"></div>
                  </div>
                </div>
              </div>

              {/* Legend Items Skeleton */}
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-form-bg/40">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-gray-700/50"></div>
                      <div className="h-3 w-20 bg-gray-700/50 rounded"></div>
                    </div>
                    <div className="h-3 w-16 bg-gray-700/40 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="pt-2 border-t border-gray-700/30 flex justify-between">
            <div className="h-3 w-28 bg-gray-700/30 rounded"></div>
            <div className="h-3 w-16 bg-gray-700/30 rounded"></div>
          </div>
        </div>

        {/* Cash Flow Health Widget Skeleton */}
        <div className="bg-secondary/90 backdrop-blur-md rounded-3xl p-5 sm:p-6 border border-[#545454]/40 shadow-xl flex flex-col justify-between min-h-[340px]">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-700/40">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20"></div>
                <div className="h-5 w-44 bg-gray-700/60 rounded-md"></div>
              </div>
              <div className="h-6 w-28 bg-emerald-500/15 rounded-full"></div>
            </div>

            {/* Split Progress Bar Skeleton */}
            <div className="my-5 space-y-2">
              <div className="flex justify-between">
                <div className="h-3 w-32 bg-gray-700/40 rounded"></div>
                <div className="h-3 w-32 bg-gray-700/40 rounded"></div>
              </div>
              <div className="w-full h-3.5 bg-gray-800 rounded-full overflow-hidden flex p-0.5">
                <div className="w-3/5 h-full bg-violet-600/30 rounded-l-full"></div>
                <div className="w-2/5 h-full bg-amber-500/30 rounded-r-full"></div>
              </div>
            </div>

            {/* 3 Detail Cards Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-3 rounded-2xl bg-form-bg/50 border border-gray-700/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="h-3 w-16 bg-gray-700/40 rounded"></div>
                    <div className="w-4 h-4 bg-gray-700/40 rounded"></div>
                  </div>
                  <div className="h-5 w-20 bg-gray-700/60 rounded"></div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-gray-700/30 flex justify-between">
            <div className="h-3 w-36 bg-gray-700/30 rounded"></div>
            <div className="h-3 w-20 bg-gray-700/30 rounded"></div>
          </div>
        </div>
      </div>

      {/* ── 5. 30-Day Multi-Metric Interactive Bar Graph Skeleton ── */}
      <div className="bg-secondary/90 backdrop-blur-md rounded-3xl p-4 sm:p-6 border border-[#545454]/40 shadow-2xl flex flex-col gap-5">
        {/* Header with Title and Metric Selector Pills Skeleton */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-gray-700/40">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-accent/20"></div>
              <div className="h-6 w-60 bg-gray-700/60 rounded-md"></div>
            </div>
            <div className="h-5 w-36 bg-accent/15 rounded-full mt-2"></div>
          </div>

          {/* Metric Selector Pills Skeleton */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-8 w-24 bg-form-bg/80 rounded-xl border border-gray-700/40"></div>
            ))}
          </div>
        </div>

        {/* 4 Summary KPI Pills Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-form-bg/60 rounded-xl p-2.5 border border-gray-700/30 space-y-1.5">
              <div className="h-3 w-20 bg-gray-700/40 rounded"></div>
              <div className="h-5 w-24 bg-gray-700/60 rounded"></div>
            </div>
          ))}
        </div>

        {/* 30-Day Bars Canvas Area Skeleton */}
        <div className="relative pt-2">
          {/* Y-Axis Gridlines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8 pl-1">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="flex items-center w-full">
                <div className="h-2 w-8 bg-gray-700/40 rounded"></div>
                <div className="flex-1 border-b border-gray-700/20 ml-2"></div>
              </div>
            ))}
          </div>

          {/* 30 Staggered Bars */}
          <div className="overflow-x-auto pl-10">
            <div className="flex items-end gap-1 sm:gap-1.5 h-[280px] sm:h-[320px] pt-4 pb-8 min-w-[700px] lg:min-w-0 w-full">
              {sampleBarHeights.map((h, dayIdx) => (
                <div key={dayIdx} className="flex-1 flex flex-col items-center h-full justify-end">
                  <div
                    style={{ height: `${h}%` }}
                    className="w-full rounded-t-sm bg-gradient-to-t from-accent/30 via-accent/20 to-accent/10"
                  ></div>
                  <span className="text-[10px] text-gray-600 font-mono mt-1">
                    {dayIdx + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
