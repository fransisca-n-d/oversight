import { Link } from "react-router-dom";

const menuItems = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Projects", path: "/projects" },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-white p-6">
      <nav className="space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="block py-1 hover:text-slate-300"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}