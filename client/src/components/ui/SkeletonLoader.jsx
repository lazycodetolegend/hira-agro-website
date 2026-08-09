export const SkeletonCard = ({ className = 'h-32' }) => (
  <div className={`bg-stone/10 animate-pulse rounded-2xl ${className}`} />
);

export const SkeletonTableRow = ({ columns = 5 }) => (
  <tr className="animate-pulse border-b border-stone/10">
    {Array.from({ length: columns }).map((_, i) => (
      <td key={i} className="py-4 px-4">
        <div className="h-4 bg-stone/15 rounded-md w-3/4" />
      </td>
    ))}
  </tr>
);

export const SkeletonProductCard = () => (
  <div className="bg-white/70 border border-stone/15 rounded-2xl p-6 animate-pulse space-y-4">
    <div className="aspect-[4/3] bg-stone/15 rounded-xl" />
    <div className="h-6 bg-stone/20 rounded-md w-2/3" />
    <div className="h-4 bg-stone/15 rounded-md w-full" />
    <div className="flex justify-between items-center pt-4 border-t border-stone/10">
      <div className="h-6 bg-stone/20 rounded-md w-1/3" />
      <div className="h-4 bg-stone/15 rounded-md w-1/4" />
    </div>
  </div>
);
