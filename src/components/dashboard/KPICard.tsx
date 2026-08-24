interface KPICardProps {
  title: string;
  value: string | number;
   change?: string;
  trend?: "up" | "down" | "neutral";
}

export default function KPICard({
  title,
  value,
}: KPICardProps) {
  return (
      <div className="bg-white rounded-xl shadow p-6">
  <p className="text-sm text-slate-500">
    {title}
  </p>

  <h2 className="mt-2 text-3xl font-bold text-slate-900">
    {value}
  </h2>
</div>
  );
}