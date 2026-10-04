import React from "react";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-gray-200 rounded ${className}`}
      aria-hidden="true"
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 flex flex-col h-full animate-pulse">
      {/* Image Skeleton */}
      <div className="w-full aspect-[4/3] bg-gray-200" />

      {/* Content Skeleton */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Category pill */}
          <div className="h-4 w-20 bg-gray-200 rounded mb-2" />
          {/* Title 2 lines */}
          <div className="h-5 w-4/5 bg-gray-200 rounded mb-1" />
          <div className="h-5 w-2/3 bg-gray-200 rounded mb-2" />
          {/* Part number */}
          <div className="h-3 w-28 bg-gray-200 rounded" />
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
          <div className="h-6 w-24 bg-gray-200 rounded" />
          <div className="h-9 w-20 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}

export function TableRowSkeleton({ cols = 6 }: { cols?: number }) {
  return (
    <tr className="animate-pulse border-b border-gray-100">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="py-3 px-4">
          <div className="h-4 bg-gray-200 rounded w-full max-w-[120px]" />
        </td>
      ))}
    </tr>
  );
}
