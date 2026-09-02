import { useEffect, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import KPICard from "../components/dashboard/KPICard";
import { supabase } from "../lib/supabase";
import { calculateCPI, calculateSPI } from "../utils/evm";
import { calculateProjectHealth } from "../utils/projectHealth";
import { Link } from "react-router-dom";

interface Project {
  id: number;
  status: string;
}

interface EVMRecord {
  project_id: number;
  date: string;
  planned_value: number;
  earned_value: number;
  actual_cost: number;
}

export default function Dashboard() {
  const [activeProjects, setActiveProjects] = useState(0);
  const [portfolioHealth, setPortfolioHealth] = useState("0%");
  const [atRiskProjects, setAtRiskProjects] = useState(0);
  const [onSchedule, setOnSchedule] = useState("0%");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      const { data: projectData, error: projectError } =
        await supabase
          .from("projects")
          .select("id, status");

      const { data: evmData, error: evmError } =
        await supabase
          .from("evm_records")
          .select("*")
          .order("date", { ascending: true });

      if (projectError || evmError) {
        console.error(projectError || evmError);
        setLoading(false);
        return;
      }

      const projects = (projectData || []) as Project[];
      const records = (evmData || []) as EVMRecord[];

      const active = projects.filter(
        (project) => project.status === "Active"
      );

      setActiveProjects(active.length);

      let healthyCount = 0;
      let atRiskCount = 0;
      let onScheduleCount = 0;

      active.forEach((project) => {
        const projectRecords = records.filter(
          (record) => record.project_id === project.id
        );

        const latestEVM =
          projectRecords[projectRecords.length - 1];

        if (!latestEVM) {
          return;
        }

        const cpi = calculateCPI(
          Number(latestEVM.earned_value),
          Number(latestEVM.actual_cost)
        );

        const spi = calculateSPI(
          Number(latestEVM.earned_value),
          Number(latestEVM.planned_value)
        );

        const health = calculateProjectHealth(cpi, spi);

        if (health === "Healthy") {
          healthyCount++;
        }

        if (health === "Watch" || health === "Critical") {
          atRiskCount++;
        }

        if (spi >= 1) {
          onScheduleCount++;
        }
      });

      if (active.length > 0) {
        setPortfolioHealth(
          `${Math.round((healthyCount / active.length) * 100)}%`
        );

        setOnSchedule(
          `${Math.round((onScheduleCount / active.length) * 100)}%`
        );
      }

      setAtRiskProjects(atRiskCount);
      setLoading(false);
    }

    fetchDashboardData();
  }, []);

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-slate-800">
        Portfolio Overview
      </h1>

      {loading ? (
        <div className="mt-8 text-slate-500">
          Loading portfolio data...
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-6 mt-8">
       <Link to="/projects?status=Active">
          <KPICard
            title="Active Projects"
            value={activeProjects}
          />
        </Link>

          <KPICard
            title="Portfolio Health"
            value={portfolioHealth}
          />

        <Link to="/projects?health=at-risk">
          <KPICard
            title="At Risk Projects"
            value={atRiskProjects}
          />
        </Link>

          <KPICard
            title="On Schedule"
            value={onSchedule}
          />
        </div>
      )}
    </DashboardLayout>
  );
}