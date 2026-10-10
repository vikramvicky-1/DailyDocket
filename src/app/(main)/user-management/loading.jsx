import UsersTableSkeleton from "../../../components/user-management/UsersTableSkeleton";

export default function Loading() {
  return (
    <div className="w-full max-w-full">
      <div className="mb-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-gray-700/40 rounded w-24 animate-pulse"></div>
          <div className="h-10 bg-accent/30 rounded-lg w-36 animate-pulse"></div>
        </div>
      </div>
      <div className="flex-1 min-h-0">
        <UsersTableSkeleton />
      </div>
    </div>
  );
}
