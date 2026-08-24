import { Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";

function Home() {
  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-xl">
        <h1 className="text-4xl font-bold text-slate-900">
          Oversight
        </h1>

        <p className="mt-3 text-slate-600">
          Track project health, forecast delivery risks,
          and monitor portfolio performance in one place.
        </p>

        <Link
          to="/dashboard"
          className="mt-8 inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
        >
          View Dashboard
        </Link>
      </div>
    </main>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/projects" element={<Projects />} />
    </Routes>
  );
}