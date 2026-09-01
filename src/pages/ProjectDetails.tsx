import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import { supabase } from "../lib/supabase";
import {
  calculateCPI,
  calculateSPI,
  calculateEAC,
} from "../utils/evm";
import { calculateProjectHealth } from "../utils/projectHealth";
import { calculateManagementPriority } from "../utils/managementPriority";

export default function ProjectDetails() {
  const { id } = useParams();

  const [project, setProject] = useState<any>(null);
  const [evmRecords, setEvmRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProject() {
      if (!id) return;

      setLoading(true);
      setError(null);

      const projectId = Number(id);

      const { data: projectData, error: projectError } =
        await supabase
          .from("projects")
          .select("*")
          .eq("id", projectId)
          .single();

      if (projectError) {
        setError(projectError.message);
        setLoading(false);
        return;
      }

      const { data: evmData, error: evmError } =
        await supabase
          .from("evm_records")
          .select("*")
          .eq("project_id", projectId)
          .order("date", { ascending: true });

      if (evmError) {
        setError(evmError.message);
        setLoading(false);
        return;
      }

      setProject(projectData);
      setEvmRecords(evmData ?? []);
      setLoading(false);
    }

    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <p className="text-slate-600">Loading project...</p>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <h1 className="text-2xl font-bold text-red-600">
          Error loading project
        </h1>

        <p className="mt-2 text-slate-600">
          {error}
        </p>
      </DashboardLayout>
    );
  }

  if (!project) {
    return (
      <DashboardLayout>
        <h1 className="text-2xl font-bold text-slate-800">
          Project not found
        </h1>

        <Link
          to="/projects"
          className="inline-block mt-4 text-blue-600 hover:underline"
        >
          Back to Projects
        </Link>
      </DashboardLayout>
    );
  }

  const latestEVM =
    evmRecords[evmRecords.length - 1];

  const previousEVM =
    evmRecords.length > 1
      ? evmRecords[evmRecords.length - 2]
      : null;

  if (!latestEVM) {
    return (
      <DashboardLayout>
        <h1 className="text-2xl font-bold text-slate-800">
          No EVM data available
        </h1>

        <Link
          to="/projects"
          className="inline-block mt-4 text-blue-600 hover:underline"
        >
          Back to Projects
        </Link>
      </DashboardLayout>
    );
  }

  const cpi = calculateCPI(
    Number(latestEVM.earned_value),
    Number(latestEVM.actual_cost)
  );

  const spi = calculateSPI(
    Number(latestEVM.earned_value),
    Number(latestEVM.planned_value)
  );

  const eac = calculateEAC(
    Number(project.bac),
    cpi
  );

  const forecastVariance =
    eac - Number(project.bac);

  const forecastVariancePercent =
    (forecastVariance / Number(project.bac)) * 100;

  const previousCPI = previousEVM
    ? calculateCPI(
        Number(previousEVM.earned_value),
        Number(previousEVM.actual_cost)
      )
    : null;

  const previousSPI = previousEVM
    ? calculateSPI(
        Number(previousEVM.earned_value),
        Number(previousEVM.planned_value)
      )
    : null;

  const cpiChange =
    previousCPI !== null
      ? cpi - previousCPI
      : null;

  const spiChange =
    previousSPI !== null
      ? spi - previousSPI
      : null;

  const cpiTrend =
    cpiChange === null
      ? "No trend"
      : cpiChange > 0
      ? "Improving"
      : cpiChange < 0
      ? "Deteriorating"
      : "Stable";

  const spiTrend =
    spiChange === null
      ? "No trend"
      : spiChange > 0
      ? "Improving"
      : spiChange < 0
      ? "Deteriorating"
      : "Stable";

  const managementPriority =
    calculateManagementPriority(
      cpi,
      spi,
      cpiTrend,
      spiTrend,
      forecastVariancePercent
    );

  const projectHealth =
    calculateProjectHealth(cpi, spi);

  const cpiStatus =
    cpi >= 1
      ? "Healthy"
      : cpi >= 0.9
      ? "Watch"
      : "Critical";

  const spiStatus =
    spi >= 1
      ? "On Schedule"
      : spi >= 0.9
      ? "Watch"
      : "Critical";

  const needsAttention =
    cpiTrend === "Deteriorating" ||
    spiTrend === "Deteriorating" ||
    cpiStatus === "Critical" ||
    spiStatus === "Critical";

  return (
    <DashboardLayout>
      <Link
        to="/projects"
        className="text-blue-600 hover:underline"
      >
        ← Back to Projects
      </Link>

      <div className="mt-6">
        <h1 className="text-3xl font-bold text-slate-800">
          {project.name}
        </h1>

        <p className="mt-2 text-slate-500">
          Project overview and delivery information.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-6">

        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-sm text-slate-500">
            Sponsor
          </p>
          <p className="mt-2 font-semibold text-slate-800">
            {project.sponsor}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-sm text-slate-500">
            Health
          </p>
          <p className="mt-2 font-semibold text-slate-800">
            {projectHealth}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-sm text-slate-500">
            Budget
          </p>
          <p className="mt-2 font-semibold text-slate-800">
            £{Number(project.bac).toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-sm text-slate-500">
            Due Date
          </p>
          <p className="mt-2 font-semibold text-slate-800">
            {project.due_date}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-sm text-slate-500">
            Status
          </p>
          <p className="mt-2 font-semibold text-slate-800">
            {project.status}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-sm text-slate-500">
            CPI
          </p>

          <p className="mt-2 text-2xl font-semibold text-slate-800">
            {cpi.toFixed(2)}
          </p>

          <p
            className={`mt-1 text-sm font-medium ${
              cpiStatus === "Healthy"
                ? "text-green-600"
                : cpiStatus === "Watch"
                ? "text-yellow-600"
                : "text-red-600"
            }`}
          >
            {cpiStatus}
          </p>

          {cpiTrend !== "No trend" && (
            <p
              className={`mt-1 text-sm font-medium ${
                cpiTrend === "Improving"
                  ? "text-green-600"
                  : cpiTrend === "Deteriorating"
                  ? "text-red-600"
                  : "text-slate-500"
              }`}
            >
              Trend: {cpiTrend}
            </p>
          )}
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-sm text-slate-500">
            SPI
          </p>

          <p className="mt-2 text-2xl font-semibold text-slate-800">
            {spi.toFixed(2)}
          </p>

          <p
            className={`mt-1 text-sm font-medium ${
              spiStatus === "On Schedule"
                ? "text-green-600"
                : spiStatus === "Watch"
                ? "text-yellow-600"
                : "text-red-600"
            }`}
          >
            {spiStatus}
          </p>

          {spiTrend !== "No trend" && (
            <p
              className={`mt-1 text-sm font-medium ${
                spiTrend === "Improving"
                  ? "text-green-600"
                  : spiTrend === "Deteriorating"
                  ? "text-red-600"
                  : "text-slate-500"
              }`}
            >
              Trend: {spiTrend}
            </p>
          )}
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-sm text-slate-500">
            Estimate at Completion
          </p>

          <p className="mt-2 text-2xl font-semibold text-slate-800">
            £{Math.round(eac).toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-sm text-slate-500">
            Forecast Variance
          </p>

          <p className="mt-2 text-2xl font-semibold text-slate-800">
            £{Math.round(forecastVariance).toLocaleString()}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            {forecastVariancePercent.toFixed(1)}% vs budget
          </p>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-xl shadow p-6">
        <p className="text-sm text-slate-500">
          Management Assessment
        </p>

        <div className="mt-2 flex items-center gap-3">
          <p
            className={`text-2xl font-semibold ${
              managementPriority === "High"
                ? "text-red-600"
                : managementPriority === "Medium"
                ? "text-yellow-600"
                : "text-green-600"
            }`}
          >
            {managementPriority}
          </p>

          <span className="text-sm text-slate-500">
            Management Priority
          </span>
        </div>

        <div className="mt-5">
          <p className="text-sm font-medium text-slate-700">
            Management Attention
          </p>

          <p
            className={`mt-1 font-semibold ${
              needsAttention
                ? "text-red-600"
                : "text-green-600"
            }`}
          >
            {needsAttention
              ? "Attention Required"
              : "No Immediate Attention Required"}
          </p>

          {needsAttention && (
            <div className="mt-3 text-sm text-slate-600 space-y-1">
              {cpiTrend === "Deteriorating" && (
                <p>
                  • Cost performance is deteriorating.
                </p>
              )}

              {spiTrend === "Deteriorating" && (
                <p>
                  • Schedule performance is deteriorating.
                </p>
              )}

              {cpiStatus === "Critical" && (
                <p>
                  • CPI is at a critical level.
                </p>
              )}

              {spiStatus === "Critical" && (
                <p>
                  • SPI is at a critical level.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}