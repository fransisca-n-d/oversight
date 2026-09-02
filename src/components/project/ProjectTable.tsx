import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { calculateCPI, calculateSPI } from "../../utils/evm";
import { calculateProjectHealth } from "../../utils/projectHealth";

interface Project {
  id: number;
  name: string;
  sponsor: string;
  status: string;
  due_date: string;
  bac: number;
}

interface EVMRecord {
  project_id: number;
  date: string;
  planned_value: number;
  earned_value: number;
  actual_cost: number;
}

interface ProjectWithHealth extends Project {
  health: string;
}

export default function ProjectTable() {
  const [searchParams, setSearchParams] = useSearchParams();

  const healthFilter = searchParams.get("health") || "All";

  const [projects, setProjects] = useState<ProjectWithHealth[]>([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProjects() {
      setLoading(true);
      setError("");

      const { data: projectData, error: projectError } =
        await supabase
          .from("projects")
          .select("*")
          .order("id", { ascending: true });

      if (projectError) {
        console.error(projectError);
        setError("Unable to load projects.");
        setLoading(false);
        return;
      }

      const { data: evmData, error: evmError } =
        await supabase
          .from("evm_records")
          .select("*")
          .order("date", { ascending: true });

      if (evmError) {
        console.error(evmError);
        setError("Unable to load project performance data.");
        setLoading(false);
        return;
      }

      const projectsWithHealth = (projectData || []).map((project) => {
        const projectRecords = (evmData || []).filter(
          (record) => record.project_id === project.id
        );

        const latestEVM =
          projectRecords[projectRecords.length - 1];

        let health = "No Data";

        if (latestEVM) {
          const cpi = calculateCPI(
            Number(latestEVM.earned_value),
            Number(latestEVM.actual_cost)
          );

          const spi = calculateSPI(
            Number(latestEVM.earned_value),
            Number(latestEVM.planned_value)
          );

          health = calculateProjectHealth(cpi, spi);
        }

        return {
          ...project,
          bac: Number(project.bac),
          health,
        };
      });

      setProjects(projectsWithHealth);
      setLoading(false);
    }

    fetchProjects();
  }, []);

  const filteredProjects = projects.filter((project) => {
    const matchesStatus =
      statusFilter === "All" ||
      project.status === statusFilter;

    const matchesHealth =
      healthFilter === "All" ||
      (healthFilter === "at-risk" &&
        (project.health === "Watch" ||
          project.health === "Critical")) ||
      project.health.toLowerCase() === healthFilter.toLowerCase();

    const matchesSearch = project.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchesStatus && matchesHealth && matchesSearch;
  });

  function handleHealthChange(
    event: React.ChangeEvent<HTMLSelectElement>
  ) {
    const value = event.target.value;

    if (value === "All") {
      setSearchParams({});
    } else {
      setSearchParams({ health: value });
    }
  }

  return (
    <div className="mt-8 bg-white rounded-xl shadow overflow-hidden">
      <div className="p-6 border-b flex gap-3">
        <input
          type="text"
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-slate-300 rounded-lg px-4 py-2"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-slate-300 rounded-lg px-4 py-2"
        >
          <option value="All">All Projects</option>
          <option value="Active">Active</option>
          <option value="Completed">Completed</option>
        </select>

        <select
          value={healthFilter}
          onChange={handleHealthChange}
          className="border border-slate-300 rounded-lg px-4 py-2"
        >
          <option value="All">All Health</option>
          <option value="Healthy">Healthy</option>
          <option value="Watch">Watch</option>
          <option value="Critical">Critical</option>
          <option value="at-risk">At Risk</option>
        </select>
      </div>

      {loading && (
        <div className="p-6 text-slate-500">
          Loading projects...
        </div>
      )}

      {error && (
        <div className="p-6 text-red-600">
          {error}
        </div>
      )}

      {!loading && !error && (
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                Project
              </th>

              <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                Sponsor
              </th>

              <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                Health
              </th>

              <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                Budget
              </th>

              <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                Due Date
              </th>

              <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredProjects.map((project) => (
              <tr
                key={project.id}
                className="border-b last:border-b-0"
              >
                <td className="px-6 py-4 font-medium">
                  <Link
                    to={`/projects/${project.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {project.name}
                  </Link>
                </td>

                <td className="px-6 py-4 text-slate-600">
                  {project.sponsor}
                </td>

                <td className="px-6 py-4 text-slate-600">
                  {project.health}
                </td>

                <td className="px-6 py-4 text-slate-600">
                  £{project.bac.toLocaleString()}
                </td>

                <td className="px-6 py-4 text-slate-600">
                  {project.due_date}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      project.status === "Active"
                        ? "bg-blue-100 text-blue-700"
                        : project.status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {project.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!loading &&
        !error &&
        filteredProjects.length === 0 && (
          <div className="p-6 text-slate-500">
            No projects found.
          </div>
        )}
    </div>
  );
}