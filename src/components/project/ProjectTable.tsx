import { projects } from "../../data/projects";
import { useState } from "react";

export default function ProjectTable() {
      const [statusFilter, setStatusFilter] = useState("All");
      const [searchTerm, setSearchTerm] = useState("");

const filteredProjects = projects.filter((project) => {
  const matchesStatus =
    statusFilter === "All" || project.status === statusFilter;

  const matchesSearch = project.name
    .toLowerCase()
    .includes(searchTerm.toLowerCase());

  return matchesStatus && matchesSearch;
});

  return (

    <div className="mt-8 bg-white rounded-xl shadow overflow-hidden">
      <div className="p-6 border-b">
  <input
  type="text"
  placeholder="Search projects..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  className="border border-slate-300 rounded-lg px-4 py-2 mr-4"
 />
  <select
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
    className="border border-slate-300 rounded-lg px-4 py-2"
  >
    <option value="All">All Projects</option>
    <option value="On Track">On Track</option>
    <option value="At Risk">At Risk</option>
    <option value="Delayed">Delayed</option>
  </select>
</div>
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
            <tr key={project.id} className="border-b last:border-b-0">
              <td className="px-6 py-4 font-medium text-slate-800">
                {project.name}
              </td>

              <td className="px-6 py-4 text-slate-600">
                {project.sponsor}
              </td>

              <td className="px-6 py-4 text-slate-600">
                {project.health}
              </td>

              <td className="px-6 py-4 text-slate-600">
                {project.budget}
              </td>

              <td className="px-6 py-4 text-slate-600">
                {project.dueDate}
              </td>

             <td className="px-6 py-4">
  <span
    className={`px-3 py-1 rounded-full text-sm font-medium ${
      project.status === "On Track"
        ? "bg-green-100 text-green-700"
        : project.status === "At Risk"
        ? "bg-yellow-100 text-yellow-700"
        : "bg-red-100 text-red-700"
    }`}
  >
    {project.status}
  </span>
</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}