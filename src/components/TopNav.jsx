import { Home, Settings, LogOut } from 'lucide-react';

export default function TopNav({ user, onLogout }) {
  return (
    <header className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/60 border-b border-slate-200">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">M</div>
          <div>
            <p className="text-sm font-semibold text-slate-800">MediTrack</p>
            <p className="text-xs text-slate-500">{user ? user.role : 'Guest'}</p>
          </div>
        </div>

        <nav className="hidden sm:flex items-center gap-4 text-sm text-slate-600">
          <a href="#dashboard" className="inline-flex items-center gap-1 hover:text-emerald-700"><Home size={16} /> Dashboard</a>
          <a href="#settings" className="inline-flex items-center gap-1 hover:text-emerald-700"><Settings size={16} /> Settings</a>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <button onClick={onLogout} className="inline-flex items-center gap-1 rounded-lg bg-slate-900 text-white px-3 py-1.5 text-sm hover:bg-slate-800">
              <LogOut size={16} /> Logout
            </button>
          ) : (
            <span className="text-xs text-slate-500">Not signed in</span>
          )}
        </div>
      </div>
    </header>
  );
}
