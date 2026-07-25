export function ProductSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
      <div className="bg-gray-200 aspect-square" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-gray-200 rounded w-1/3" />
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-4/5" />
        <div className="flex justify-between items-center mt-2">
          <div className="h-6 bg-gray-200 rounded w-1/4" />
          <div className="h-8 bg-gray-200 rounded-xl w-1/3" />
        </div>
      </div>
    </div>
  );
}

export function Spinner() {
  return (
    <div className="flex items-center justify-center p-10">
      <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
    </div>
  );
}
