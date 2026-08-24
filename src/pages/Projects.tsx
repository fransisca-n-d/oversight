import DashboardLayout from "../components/layout/DashboardLayout";
import ProjectTable from "../components/project/ProjectTable";

export default function Projects() {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-slate-800">
        Projects
      </h1>

      <p className="mt-2 text-slate-500">
        Manage and monitor all projects.
      </p>

      <ProjectTable />
    </DashboardLayout>
  );
}