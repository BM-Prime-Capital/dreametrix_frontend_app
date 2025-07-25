// components/ui/SkeletonCard.tsx
export const SkeletonCard = () => {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5">
          <div className="flex items-start gap-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-full bg-gray-200 animate-pulse" />
            </div>
            
            <div className="flex-1 min-w-0 space-y-2">
              <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse" />
            </div>
            
            <div className="h-5 w-5 bg-gray-200 rounded animate-pulse" />
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
            <div className="h-3 w-1/2 bg-gray-200 rounded animate-pulse" />
            <div className="w-full bg-gray-200 rounded-full h-2 animate-pulse" />
            <div className="flex justify-between">
              <div className="h-4 w-1/4 bg-gray-200 rounded animate-pulse" />
              <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  };