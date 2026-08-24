import DashboardLayout from "../components/layout/DashboardLayout";
import KPICard from "../components/dashboard/KPICard";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-slate-800">
        Portfolio Overview
      </h1>

      <div className="grid grid-cols-4 gap-6 mt-8">

        <KPICard
          title="Active Projects"
          value={28}
        />

        <KPICard
          title="Portfolio Health"
          value="81%"
        />

        <KPICard
          title="At Risk Projects"
          value={6}
        />

        <KPICard
          title="Delivery Confidence"
          value="86%"
        />

      </div>

    </DashboardLayout>
  );
}