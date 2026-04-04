import { Upload, FileText, ClipboardCheck } from "lucide-react";

const navItems = [
  { id: "submit", label: "Submit", icon: Upload },
  { id: "submissions", label: "Submissions", icon: FileText },
  { id: "review", label: "Review", icon: ClipboardCheck },
];

export default function Navbar({ setPage, currentPage }) {
  return (
    <nav className="sticky top-0 z-50 border-b border-edge bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-sm font-bold text-white">E</span>
          </div>
          <span className="text-lg font-semibold text-content">ElevateX</span>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-1">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setPage(id)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200
                ${
                  currentPage === id
                    ? "bg-primary/10 text-primary"
                    : "text-muted hover:bg-surface hover:text-content"
                }`}
            >
              <Icon size={18} />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}