export const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse bg-slate-200 dark:bg-slate-800 rounded ${className}`} />
)

export const Shimmer = ({ className = "" }) => (
  <div className={`relative overflow-hidden bg-slate-200 dark:bg-slate-800 rounded ${className}`}>
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent dark:via-white/10" />
  </div>
)

export const ProductCardSkeleton = () => (
  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 overflow-hidden animate-pulse">
    <div className="aspect-[4/5] bg-slate-200 dark:bg-slate-800" />
    <div className="p-5 space-y-3">
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
      <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full" />
      <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-5/6" />
      <div className="flex items-center justify-between pt-2">
        <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-20" />
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg w-24" />
      </div>
    </div>
  </div>
)

export const ProductRowSkeleton = () => (
  <tr className="border-b border-gray-50 dark:border-slate-800">
    <td className="px-4 py-3"><div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse" /></td>
    <td className="px-4 py-3"><div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-40 animate-pulse" /></td>
    <td className="px-4 py-3"><div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-24 animate-pulse" /></td>
    <td className="px-4 py-3"><div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-16 animate-pulse" /></td>
    <td className="px-4 py-3"><div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-12 animate-pulse" /></td>
    <td className="px-4 py-3"><div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg w-20 ml-auto animate-pulse" /></td>
  </tr>
)

export const OrderCardSkeleton = () => (
  <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200/70 dark:border-slate-800 p-5 shadow-sm space-y-4 animate-pulse">
    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        <div className="space-y-1">
          <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-24" />
          <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded w-32" />
        </div>
      </div>
      <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-full w-20" />
    </div>
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 py-1">
      <div className="w-16 h-16 rounded-xl bg-slate-200 dark:bg-slate-800 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
        <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
      </div>
      <div className="flex items-center gap-10 w-full sm:w-auto">
        <div className="space-y-1">
          <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded w-12" />
          <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-16" />
        </div>
        <div className="space-y-1 text-right">
          <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded w-10 ml-auto" />
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-20 ml-auto" />
        </div>
      </div>
    </div>
    <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
      <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-xl w-28" />
      <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-xl w-24" />
    </div>
  </div>
)

export const StatCardSkeleton = () => (
  <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm dark:shadow-slate-800 p-6 animate-pulse">
    <div className="flex items-center justify-between mb-4">
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-24" />
      <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-lg" />
    </div>
    <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-32 mb-2" />
    <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-28" />
  </div>
)

export const ProductDetailSkeleton = () => (
  <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12">
    <div className="max-w-6xl mx-auto px-4">
      {/* Back link */}
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-28 mb-8 animate-pulse" />

      {/* Main card */}
      <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
          {/* Image */}
          <div className="aspect-square rounded-xl bg-slate-200 dark:bg-slate-800" />
          {/* Info */}
          <div className="space-y-5">
            <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-full w-24" />
            <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
            <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
            <div className="space-y-2">
              <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full" />
              <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-5/6" />
              <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-4/6" />
            </div>
            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-32" />
            <div className="h-11 bg-slate-200 dark:bg-slate-800 rounded-xl w-40" />
          </div>
        </div>
      </div>

      {/* Related products */}
      <div className="mt-12">
        <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-44 mb-6 animate-pulse" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800 p-4 animate-pulse">
              <div className="w-full aspect-square rounded-lg bg-slate-200 dark:bg-slate-800 mb-3" />
              <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-3/4 mb-2" />
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
)

export const CartItemSkeleton = () => (
  <div className="bg-white dark:bg-slate-950 rounded-xl p-4 flex items-center gap-4 border border-slate-100 dark:border-slate-800 shadow-sm animate-pulse">
    <div className="w-20 h-20 rounded-lg bg-slate-200 dark:bg-slate-800 shrink-0" />
    <div className="flex-1 min-w-0 space-y-2">
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
    </div>
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800" />
      <div className="w-8 h-4 bg-slate-200 dark:bg-slate-800 rounded" />
      <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800" />
    </div>
    <div className="text-right space-y-1">
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-20 ml-auto" />
      <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-12 ml-auto" />
    </div>
  </div>
)

export const OrderCardUserSkeleton = () => (
  <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200/70 dark:border-slate-800 p-5 shadow-sm space-y-4 animate-pulse">
    {/* Header */}
    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-800" />
        <div className="space-y-1">
          <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-32" />
          <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded w-48" />
        </div>
      </div>
      <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-full w-20" />
    </div>
    {/* Item row */}
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 py-1">
      <div className="w-16 h-16 rounded-xl bg-slate-200 dark:bg-slate-800 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full" />
        <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
      </div>
      <div className="flex items-center gap-10 w-full sm:w-auto">
        <div className="space-y-1">
          <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded w-14" />
          <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-16" />
        </div>
        <div className="space-y-1 text-right">
          <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded w-10 ml-auto" />
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-20 ml-auto" />
        </div>
      </div>
    </div>
    {/* Footer buttons */}
    <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
      <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-xl w-28" />
      <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-xl w-24" />
    </div>
  </div>
)
