import SalesTableSkeleton from "../../../components/sales/SalesTableSkeleton";

export default function Loading() {
  return (
    <div className="w-full flex flex-col">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-gray-700/40 rounded w-28 animate-pulse"></div>
          <div className="h-10 bg-accent/30 rounded-lg w-32 animate-pulse"></div>
        </div>
      </div>
      <div className="flex-1 min-h-0">
        <SalesTableSkeleton />
      </div>
    </div>
  );
}
