"use client";

const OrdersTableSkeleton = () => {
  return (
    <div className="animate-pulse">
      {/* Table Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
        <div className="h-6 bg-secondary rounded-md w-24"></div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="h-6 bg-secondary rounded-md w-32"></div>
          <div className="h-10 bg-accent/20 rounded-lg w-28"></div>
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="overflow-x-auto">
        <div className="min-w-[1080px]">
          {/* Header Row */}
          <div className="grid grid-cols-10 gap-4 p-4 border-b border-gray-600 bg-form-bg rounded-tl-xl rounded-tr-xl">
            {Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="h-3 bg-secondary rounded"></div>
            ))}
          </div>

          {/* Data Rows */}
          <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
            {Array.from({ length: 7 }).map((_, rowIndex) => (
              <div
                key={rowIndex}
                className="grid grid-cols-10 gap-4 p-4 border-b border-gray-700"
              >
                {Array.from({ length: 10 }).map((_, colIndex) => (
                  <div
                    key={colIndex}
                    className={`h-4 bg-secondary rounded ${
                      colIndex === 9 ? "flex justify-center space-x-1" : ""
                    } ${colIndex === 7 ? "flex justify-center" : ""}`}
                  >
                    {colIndex === 9 && (
                      <>
                        <div className="h-4 w-4 bg-secondary rounded"></div>
                        <div className="h-4 w-4 bg-secondary rounded"></div>
                      </>
                    )}
                    {colIndex === 7 && (
                      <div className="h-4 w-16 bg-secondary rounded-full"></div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersTableSkeleton;
