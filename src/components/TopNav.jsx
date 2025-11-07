import { LogOut, LayoutDashboard, Users, Receipt } from 'lucide-react';

export default function TopNav({ role, onLogout, sections, active, onSelect }) {
  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded bg-indigo-600" />
          <span className="font-semibold">MediTrack</span>
          {role && (
            <span className="ml-2 text-xs px-2 py-1 rounded-full bg-slate-100 border border-slate-200">{role}</span>
          )}
        </div>

        <nav className="hidden sm:flex items-center gap-2">
          {sections.map((s) => (
            <button
              key={s.key}
              onClick={() => onSelect(s.key)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm border ${
                active === s.key ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {s.key === 'patients' && <Users className="w-4 h-4" />}
              {s.key === 'billing' && <Receipt className="w-4 h-4" />}
              {s.key === 'dashboard' && <LayoutDashboard className="w-4 h-4" />}
              {s.label}
            </button>
          ))}
        </nav>

        {role && (
          <button onClick={onLogout} className="inline-flex items-center gap-2 text-sm text-slate-700 hover:text-slate-900">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        )}
      </div>
    </header>
  );
}
