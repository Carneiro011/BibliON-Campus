// src/components/resources/ResourceCardSkeleton.tsx
export default function ResourceCardSkeleton() {
  return (
    <div className="card p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="skeleton h-5 w-16 rounded-full" />
        <div className="skeleton h-5 w-20 rounded-full" />
      </div>
      <div className="skeleton h-5 w-full" />
      <div className="skeleton h-4 w-3/4" />
      <div className="skeleton h-16 rounded-lg" />
      <div className="flex gap-2">
        <div className="skeleton h-5 w-14 rounded-full" />
        <div className="skeleton h-5 w-16 rounded-full" />
        <div className="skeleton h-5 w-12 rounded-full" />
      </div>
      <div className="mt-auto flex items-center justify-between pt-2 border-t border-gray-100">
        <div className="flex gap-3">
          <div className="skeleton h-4 w-10" />
          <div className="skeleton h-4 w-10" />
        </div>
        <div className="skeleton h-4 w-16" />
      </div>
    </div>
  )
}
