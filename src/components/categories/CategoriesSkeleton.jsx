"use client";

import React from "react";

const CategoriesSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-pulse">
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className="bg-secondary border border-gray-700/60 rounded-xl p-5 flex flex-col justify-between shadow-md"
        >
          <div>
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-lg bg-accent/20 flex items-center justify-center">
                  <div className="w-5 h-5 bg-accent/30 rounded"></div>
                </div>
                <div className="h-5 bg-gray-500/30 rounded w-28"></div>
              </div>

              <div className="h-7 w-7 bg-gray-600/20 rounded-lg"></div>
            </div>

            {/* Subcategories list skeleton */}
            <div className="mt-4">
              <div className="h-3 bg-gray-600/30 rounded w-24 mb-2"></div>
              <div className="flex flex-wrap gap-1.5 min-h-[32px]">
                <div className="h-6 bg-form-bg rounded-full w-16 border border-gray-700/50"></div>
                <div className="h-6 bg-form-bg rounded-full w-20 border border-gray-700/50"></div>
                <div className="h-6 bg-form-bg rounded-full w-14 border border-gray-700/50"></div>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-gray-700/50 flex items-center justify-between">
            <div className="h-3 bg-gray-600/30 rounded w-20"></div>
            <div className="h-3 bg-accent/30 rounded w-24"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoriesSkeleton;
