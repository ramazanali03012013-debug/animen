export default function Loading() {
  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8">
      <div className="skeleton h-9 w-48 rounded mb-6" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="skeleton shimmer-card aspect-[2/3] rounded-md" />
        ))}
      </div>
    </div>
  );
}
