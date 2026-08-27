import { Skeleton } from "@heroui/react";

const MemeSkeletonCard = () => {
  return (
    <div className="overflow-hidden rounded-2xl">
      <Skeleton className="h-64 w-full rounded-none" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex gap-6 pt-2">
          <Skeleton className="h-5 w-12" />
          <Skeleton className="h-5 w-12" />
        </div>
      </div>
    </div>
  );
};

const MemeSkeletonGrid = ({ count = 6 }) => {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, idx) => (
        <MemeSkeletonCard key={idx} />
      ))}
    </div>
  );
};

export default MemeSkeletonGrid;
