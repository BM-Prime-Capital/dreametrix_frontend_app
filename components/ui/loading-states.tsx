import { Loader2, AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

/**
 * Generic loading spinner for dashboard pages
 */
export function DashboardLoadingState({ message = "Loading data..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative">
        <Loader2 className="h-12 w-12 animate-spin text-[#25AAE1] mb-6" />
        <div className="absolute inset-0 w-12 h-12 border-4 border-[#25AAE1]/20 rounded-full"></div>
      </div>
      <p className="text-gray-600 font-medium text-lg">{message}</p>
    </div>
  )
}

/**
 * Compact loading spinner for inline use
 */
export function InlineLoadingState({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-4">
      <Loader2 className="h-5 w-5 animate-spin text-[#25AAE1]" />
      <span className="text-gray-600 text-sm">{message}</span>
    </div>
  )
}

/**
 * Error state with retry button
 */
export function ErrorState({
  error,
  onRetry,
  title = "Error Loading Data"
}: {
  error: string
  onRetry?: () => void
  title?: string
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
      <p className="text-gray-800 font-medium text-lg mb-2">{title}</p>
      <p className="text-gray-600 text-sm mb-4 text-center max-w-md">{error}</p>
      {onRetry && (
        <Button onClick={onRetry} className="bg-[#25AAE1] hover:bg-[#1D8CB3]">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      )}
    </div>
  )
}

/**
 * Empty state for when there's no data
 */
export function EmptyDataState({
  title = "No Data Available",
  message = "There is no data to display at this time.",
  icon: Icon = AlertCircle
}: {
  title?: string
  message?: string
  icon?: React.ComponentType<{ className?: string }>
}) {
  return (
    <Card className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
      <div className="text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600">{message}</p>
      </div>
    </Card>
  )
}

/**
 * Skeleton loader for cards
 */
export function CardSkeleton() {
  return (
    <Card className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="animate-pulse space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gray-200 rounded-lg"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-3 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded w-full"></div>
          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    </Card>
  )
}

/**
 * Grid of skeleton loaders
 */
export function SkeletonGrid({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}
