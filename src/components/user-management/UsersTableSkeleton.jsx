"use client";

import React from "react";

const UsersTableSkeleton = () => {
  return (
    <div className="bg-secondary p-4 sm:p-6 rounded-xl flex flex-col h-full animate-pulse">
      {/* 1. STATIC HEADER SECTION SKELETON */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0 pb-4">
        <div className="h-6 bg-gray-600/30 rounded w-28"></div>
        <div className="flex flex-col max-sm:flex-row justify-between sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="h-5 bg-gray-600/30 rounded w-28"></div>
        </div>
      </div>

      {/* 2. SCROLLABLE CONTENT AREA SKELETON */}
      <div className="flex-1 overflow-y-auto custom-scrollbar max-h-[500px] md:max-h-[500px] lg:max-h-[450px]">
        {/* Table Header (Visible on large screens only, STICKY) */}
        <div className="hidden lg:grid grid-cols-4 gap-4 p-4 border-b border-secondary bg-form-bg rounded-t-lg sticky top-0 z-10">
          <div className="h-4 bg-gray-600/30 rounded w-16"></div>
          <div className="h-4 bg-gray-600/30 rounded w-16"></div>
          <div className="h-4 bg-gray-600/30 rounded w-14"></div>
          <div className="flex justify-center">
            <div className="h-4 bg-gray-600/30 rounded w-16"></div>
          </div>
        </div>

        {/* Table Body */}
        <div className="space-y-4 lg:space-y-0">
          {[...Array(5)].map((_, index) => (
            <div key={index}>
              {/* Mobile Card Skeleton (matches UserMobileCard) */}
              <div className="block lg:hidden bg-gradient-to-br from-primary to-secondary rounded-xl p-4 shadow-lg border border-primary/30">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex flex-col space-y-1.5">
                    <div className="h-4 bg-gray-300/30 rounded w-28"></div>
                    <div className="h-3.5 bg-gray-400/30 rounded w-36"></div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 bg-white/10 rounded-full"></div>
                    <div className="h-8 w-8 bg-white/10 rounded-full"></div>
                  </div>
                </div>
                <div className="space-y-1 pt-1">
                  <div className="h-3 bg-gray-400/20 rounded w-10"></div>
                  <div className="h-5 bg-blue-500/20 rounded-full w-20"></div>
                </div>
              </div>

              {/* Desktop Table Row Skeleton */}
              <div className="hidden lg:grid lg:grid-cols-4 lg:gap-4 lg:p-4 lg:border-b lg:border-gray-600/60 lg:rounded-none lg:bg-transparent text-sm text-text-primary items-center">
                <div className="h-4 bg-gray-600/30 rounded w-32"></div>
                <div className="h-4 bg-gray-600/30 rounded w-44"></div>
                <div className="h-5 bg-blue-500/20 rounded-full w-20"></div>
                <div className="flex justify-center items-center space-x-2">
                  <div className="h-6 w-6 bg-gray-600/30 rounded"></div>
                  <div className="h-6 w-6 bg-gray-600/30 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UsersTableSkeleton;
