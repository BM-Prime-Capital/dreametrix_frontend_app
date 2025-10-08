import { useEffect } from "react"
import { useRequestInfo } from "./useRequestInfo"
import { useParentDashboard } from "./useParentDashboard"
import { useLoading } from "@/lib/LoadingContext"
import { Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

/**
 * Options for useParentPage hook
 */
interface UseParentPageOptions {
  /**
   * Whether the page requires students to be linked
   * If true, will show empty state when no students are linked
   */
  requireStudents?: boolean

  /**
   * Whether to use the global loading overlay
   */
  useGlobalLoading?: boolean
}

/**
 * Unified hook for Parent Dashboard pages
 * Provides consistent loading, error, and empty state handling
 *
 * @param options - Configuration options
 * @returns Dashboard data and state management
 *
 * @example
 * ```tsx
 * function ParentAttendancePage() {
 *   const page = useParentPage({ requireStudents: true })
 *
 *   if (!page.shouldRender) {
 *     return page.renderState
 *   }
 *
 *   return <div>Your page content with {page.studentsSummary}</div>
 * }
 * ```
 */
export function useParentPage(options: UseParentPageOptions = {}) {
  const { requireStudents = false, useGlobalLoading = true } = options

  const { accessToken } = useRequestInfo()
  const { stopLoading } = useLoading()
  const dashboard = useParentDashboard(accessToken)

  // Auto-stop global loading when data is loaded
  useEffect(() => {
    if (!dashboard.loading && useGlobalLoading) {
      stopLoading()
    }
  }, [dashboard.loading, useGlobalLoading, stopLoading])

  // Loading state component
  const LoadingState = (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative">
        <Loader2 className="h-12 w-12 animate-spin text-[#25AAE1] mb-6" />
        <div className="absolute inset-0 w-12 h-12 border-4 border-[#25AAE1]/20 rounded-full"></div>
      </div>
      <p className="text-gray-600 font-medium text-lg">Loading data...</p>
    </div>
  )

  // Error state component
  const ErrorState = dashboard.error ? (
    <div className="flex flex-col items-center justify-center py-16">
      <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
      <p className="text-gray-800 font-medium text-lg mb-2">Error Loading Data</p>
      <p className="text-gray-600 text-sm mb-4">{dashboard.error}</p>
      <Button
        onClick={dashboard.refreshData}
        className="bg-[#25AAE1] hover:bg-[#1D8CB3]"
      >
        <Loader2 className="h-4 w-4 mr-2" />
        Try Again
      </Button>
    </div>
  ) : null

  // Empty state component (no students)
  const EmptyState = null // Will be handled by layout.tsx

  // Determine what to render
  const shouldRender =
    !dashboard.loading &&
    !dashboard.error &&
    (!requireStudents || dashboard.hasStudents)

  const renderState = dashboard.loading
    ? LoadingState
    : dashboard.error
    ? ErrorState
    : !dashboard.hasStudents && requireStudents
    ? EmptyState
    : null

  return {
    // Dashboard data
    ...dashboard,

    // Render helpers
    shouldRender,
    renderState,

    // Individual states (for custom handling)
    LoadingState,
    ErrorState,
    EmptyState
  }
}
