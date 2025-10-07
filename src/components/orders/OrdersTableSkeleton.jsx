"use client";

const OrdersTableSkeleton = () => {
  return (
    <div className="bg-secondary max-sm:p-2 rounded-xl flex flex-col h-full animate-pulse">
      {/* 1. STATIC HEADER SECTION SKELETON */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0 pb-4">
        {/* Small screens: heading and export on same line */}
        <div className="flex items-center justify-between sm:hidden">
          <div className="h-6 bg-gray-600/30 rounded w-28"></div>
          <div className="h-8 bg-gray-600/30 rounded w-20"></div>
        </div>

        {/* Large screens: original layout */}
        <div className="hidden sm:block h-6 sm:h-7 bg-gray-600/30 rounded w-28"></div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center space-x-2">
            <div className="h-4 sm:h-5 bg-gray-600/30 rounded w-24"></div>
            <div className="h-5 sm:h-6 bg-gray-600/30 rounded w-20"></div>
          </div>
          <div className="hidden sm:block h-8 sm:h-10 bg-gray-600/30 rounded w-28"></div>
        </div>
      </div>

      {/* 2. SCROLLABLE CONTENT AREA SKELETON */}
      <div className="flex-1 overflow-y-auto custom-scrollbar max-h-[500px] md:max-h-[500px] lg:max-h-[450px]">
        {/* Table Header (Visible on large screens only, STICKY) */}
        <div className="hidden lg:grid grid-cols-10 gap-4 p-4 border-b border-secondary bg-form-bg rounded-t-lg sticky top-0 z-10">
          <div className="h-4 bg-gray-600/30 rounded w-16"></div>
          <div className="h-4 bg-gray-600/30 rounded w-12"></div>
          <div className="h-4 bg-gray-600/30 rounded w-24"></div>
          <div className="h-4 bg-gray-600/30 rounded w-24"></div>
          <div className="h-4 bg-gray-600/30 rounded w-20"></div>
          <div className="h-4 bg-gray-600/30 rounded w-12"></div>
          <div className="h-4 bg-gray-600/30 rounded w-16"></div>
          <div className="h-4 bg-gray-600/30 rounded w-14"></div>
          <div className="h-4 bg-gray-600/30 rounded w-20"></div>
          <div className="h-4 bg-gray-600/30 rounded w-16 mx-auto"></div>
        </div>

        {/* Table Body Skeleton */}
        <div className="space-y-4 lg:space-y-0">
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className="block p-4 rounded-lg bg-secondary border-b border-gray-600/60 lg:grid lg:grid-cols-10 lg:gap-4 lg:p-4 lg:border-b lg:border-gray-600/60 lg:rounded-none lg:bg-transparent text-sm text-text-primary"
            >
              {/* Mobile/Tablet View */}
              <div className="flex justify-between lg:block mb-2 lg:mb-0">
                <div className="h-3 bg-gray-500/30 rounded w-16 lg:hidden"></div>
                <div className="h-4 bg-gray-600/30 rounded w-20"></div>
              </div>
              <div className="flex justify-between lg:block mb-2 lg:mb-0">
                <div className="h-3 bg-gray-500/30 rounded w-12 lg:hidden"></div>
                <div className="h-4 bg-gray-600/30 rounded w-16"></div>
              </div>
              <div className="flex justify-between lg:block mb-2 lg:mb-0">
                <div className="h-3 bg-gray-500/30 rounded w-24 lg:hidden"></div>
                <div className="h-4 bg-gray-600/30 rounded w-28"></div>
              </div>
              <div className="flex justify-between lg:block mb-2 lg:mb-0">
                <div className="h-3 bg-gray-500/30 rounded w-24 lg:hidden"></div>
                <div className="h-4 bg-gray-600/30 rounded w-18"></div>
              </div>
              <div className="flex justify-between lg:block mb-2 lg:mb-0">
                <div className="h-3 bg-gray-500/30 rounded w-20 lg:hidden"></div>
                <div className="h-4 bg-gray-600/30 rounded w-16"></div>
              </div>
              <div className="flex justify-between lg:block mb-2 lg:mb-0">
                <div className="h-3 bg-gray-500/30 rounded w-12 lg:hidden"></div>
                <div className="h-4 bg-gray-600/30 rounded w-16"></div>
              </div>
              <div className="flex justify-between lg:block mb-2 lg:mb-0">
                <div className="h-3 bg-gray-500/30 rounded w-16 lg:hidden"></div>
                <div className="h-4 bg-gray-600/30 rounded w-16"></div>
              </div>
              <div className="flex justify-between lg:block mb-2 lg:mb-0">
                <div className="h-3 bg-gray-500/30 rounded w-14 lg:hidden"></div>
                <div className="h-4 bg-gray-600/30 rounded w-16"></div>
              </div>
              <div className="flex justify-between lg:block mb-4 lg:mb-0">
                <div className="h-3 bg-gray-500/30 rounded w-20 lg:hidden"></div>
                <div className="h-4 bg-gray-600/30 rounded w-24"></div>
              </div>
              <div className="flex justify-end items-center mt-4 pt-4 border-t border-secondary/50 lg:mt-0 lg:pt-0 lg:border-none lg:justify-start">
                <div className="h-6 w-6 bg-gray-600/30 rounded-full mr-2"></div>
                <div className="h-6 w-6 bg-gray-600/30 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrdersTableSkeleton;
