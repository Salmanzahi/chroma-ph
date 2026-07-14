import { Skeleton } from "@/src/components/ui/Skeleton";

export default function AppLoading() {
  return (
    <div className="page-loading" role="status" aria-live="polite">
      <span className="sr-only">Memuat halaman</span>
      <Skeleton className="h-3 w-28" />
      <Skeleton className="mt-5 h-14 w-full max-w-xl" />
      <Skeleton className="mt-3 h-5 w-full max-w-md" />
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <Skeleton className="h-56 w-full" />
        <Skeleton className="h-56 w-full" />
      </div>
    </div>
  );
}
