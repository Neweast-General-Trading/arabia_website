export default function Loading() {
  return (
    <div className="container-wide py-24">
      <div className="h-3 w-24 animate-pulse rounded-full bg-line" />
      <div className="mt-6 h-10 w-2/3 max-w-xl animate-pulse rounded-2xl bg-line" />
      <div className="mt-4 h-4 w-1/2 max-w-md animate-pulse rounded-full bg-line" />
    </div>
  );
}
