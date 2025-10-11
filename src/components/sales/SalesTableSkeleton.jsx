"use client";

const SalesTableSkeleton = () => {
  return (
    <div className="bg-secondary p-4 sm:p-6 rounded-xl flex flex-col animate-pulse">
      {/* 1. STATIC HEADER SECTION SKELETON */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0 pb-4">
        {/* Small screens: heading and export on same line */}
        <div className="flex items-center justify-between sm:hidden">
          <div className="h-6 bg-gray-600/30 rounded w-24"></div>
          <div className="h-8 bg-gray-600/30 rounded w-20"></div>
        </div>

        {/* Large screens: original layout */}
        <div className="hidden sm:block h-6 sm:h-7 bg-gray-600/30 rounded w-24"></div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center space-x-2">
            <div className="h-4 sm:h-5 bg-gray-600/30 rounded w-20"></div>
            <div className="h-5 sm:h-6 bg-gray-600/30 rounded w-24"></div>
          </div>
          <div className="hidden sm:block h-8 sm:h-10 bg-gray-600/30 rounded w-28"></div>
        </div>
      </div>

      {/* 2. SCROLLABLE CONTENT AREA SKELETON */}
      <div className="flex-1 overflow-y-auto custom-scrollbar max-h-[550px] md:max-h-[500px] lg:max-h-[450px]">
        {/* Table Header (Visible on large screens only, STICKY) */}
        <div className="hidden lg:grid grid-cols-11 gap-4 p-4 border-b border-secondary bg-form-bg rounded-t-lg sticky top-0 z-10">
          <div className="h-4 bg-gray-600/30 rounded w-12"></div>
          <div className="h-4 bg-gray-600/30 rounded w-12"></div>
          <div className="h-4 bg-gray-600/30 rounded w-16"></div>
          <div className="h-4 bg-gray-600/30 rounded w-18"></div>
          <div className="h-4 bg-gray-600/30 rounded w-14"></div>
          <div className="h-4 bg-gray-600/30 rounded w-16"></div>
          <div className="h-4 bg-gray-600/30 rounded w-20"></div>
          <div className="h-4 bg-gray-600/30 rounded w-14"></div>
          <div className="h-4 bg-gray-600/30 rounded w-20"></div>
          <div className="h-4 bg-gray-600/30 rounded w-20"></div>
          <div className="h-4 bg-gray-600/30 rounded w-16 mx-auto"></div>
        </div>

        {/* Table Body Skeleton */}
        <div className="space-y-4 lg:space-y-0">
          {[...Array(8)].map((_, index) => (
            <div key={index}>
              {/* Mobile Card Skeleton (visible on mobile/tablet) */}
              <div className="block lg:hidden bg-gradient-to-br from-primary to-secondary rounded-xl p-4 shadow-lg border border-primary/30">
                {/* Header with Date and Actions */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex flex-col space-y-1">
                    <div className="h-4 bg-gray-400/30 rounded w-20"></div>
                    <div className="h-5 bg-green-300/30 rounded w-36"></div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 bg-gray-400/30 rounded-full"></div>
                    <div className="h-8 w-8 bg-gray-400/30 rounded-full"></div>
                  </div>
                </div>

                {/* Data Grid Skeleton - 2x3 layout */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="space-y-1">
                    <div className="h-3 bg-gray-400/30 rounded w-12"></div>
                    <div className="h-4 bg-gray-300/30 rounded w-18"></div>
                  </div>
                  <div className="space-y-1">
                    <div className="h-3 bg-gray-400/30 rounded w-12"></div>
                    <div className="h-4 bg-gray-300/30 rounded w-16"></div>
                  </div>
                  <div className="space-y-1">
                    <div className="h-3 bg-gray-400/30 rounded w-14"></div>
                    <div className="h-4 bg-gray-300/30 rounded w-20"></div>
                  </div>
                  <div className="space-y-1">
                    <div className="h-3 bg-gray-400/30 rounded w-14"></div>
                    <div className="h-4 bg-gray-300/30 rounded w-18"></div>
                  </div>
                  <div className="space-y-1">
                    <div className="h-3 bg-gray-400/30 rounded w-16"></div>
                    <div className="h-4 bg-gray-300/30 rounded w-20"></div>
                  </div>
                  <div className="space-y-1">
                    <div className="h-3 bg-gray-400/30 rounded w-18"></div>
                    <div className="h-4 bg-green-400/30 rounded w-16"></div>
                  </div>
                </div>

                {/* Optional Attachment Section Skeleton */}
                {index % 4 === 0 && (
                  <div className="border-t border-primary/30 pt-3">
                    <div className="flex items-center justify-between bg-secondary/50 rounded-lg p-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-red-400/30 rounded"></div>
                        <div className="h-4 bg-gray-300/30 rounded w-18"></div>
                      </div>
                      <div className="h-6 w-6 bg-gray-400/30 rounded-full"></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Desktop Table Row Skeleton (visible on large screens) */}
              <div className="hidden lg:grid lg:grid-cols-11 lg:gap-4 lg:p-4 lg:border-b lg:border-gray-600/60 lg:rounded-none lg:bg-transparent text-sm text-text-primary">
                <div className="h-4 bg-gray-600/30 rounded w-16"></div>
                <div className="h-4 bg-gray-600/30 rounded w-14"></div>
                <div className="h-4 bg-gray-600/30 rounded w-16"></div>
                <div className="h-4 bg-gray-600/30 rounded w-18"></div>
                <div className="h-4 bg-gray-600/30 rounded w-16"></div>
                <div className="h-4 bg-gray-600/30 rounded w-16"></div>
                <div className="h-4 bg-gray-600/30 rounded w-18"></div>
                <div className="h-4 bg-gray-600/30 rounded w-16"></div>
                <div className="h-4 bg-gray-600/30 rounded w-16"></div>
                <div className="h-4 bg-gray-600/30 rounded w-20"></div>
                <div className="flex justify-start items-center">
                  <div className="h-6 w-6 bg-gray-600/30 rounded-full mr-2"></div>
                  <div className="h-6 w-6 bg-gray-600/30 rounded-full"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SalesTableSkeleton;
