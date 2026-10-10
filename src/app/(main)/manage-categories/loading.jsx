import CategoriesSkeleton from "../../../components/categories/CategoriesSkeleton";

export default function Loading() {
  return (
    <div className="w-full max-w-full">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 bg-gray-700/40 rounded w-52 animate-pulse"></div>
          <div className="h-4 bg-gray-700/30 rounded w-80 animate-pulse"></div>
        </div>
        <div className="h-10 bg-accent/30 rounded-lg w-44 animate-pulse"></div>
      </div>
      <CategoriesSkeleton />
    </div>
  );
}
