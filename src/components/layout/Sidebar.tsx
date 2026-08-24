const menuItems = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Projects", path: "/projects" },
  { label: "Forecast", path: "/forecast" },
  { label: "Portfolio", path: "/portfolio" },
  { label: "Risks", path: "/risks" },
  { label: "Settings", path: "/settings" },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-white p-6">
        {menuItems.map((item) => (
  <div key={item.path}>
    {item.label}
  </div>
))}

    </aside>
  );
}