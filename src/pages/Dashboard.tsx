import DashboardLayout from "../components/layout/DashboardLayout";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-slate-800">
        Dashboard
      </h1>

      <p className="mt-2 text-slate-600">
        Welcome to Oversight.
      </p>
    </DashboardLayout>
  );
}