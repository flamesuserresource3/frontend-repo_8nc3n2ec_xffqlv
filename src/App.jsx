import { useState } from 'react';
import HeroCover from './components/HeroCover';
import RoleLogin from './components/RoleLogin';
import RoleAwareDashboard from './components/RoleAwareDashboard';
import TopNav from './components/TopNav';
import SectionTabs from './components/SectionTabs';
import PatientsManager from './components/PatientsManager';
import BillingManager from './components/BillingManager';

export default function App() {
  const [user, setUser] = useState(null);
  const [active, setActive] = useState('dashboard');

  const handleLogin = (u) => { setUser(u); setActive('dashboard'); };
  const handleLogout = () => { setUser(null); setActive('dashboard'); };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-50 text-slate-900">
      <TopNav user={user} onLogout={handleLogout} />
      <main className="mx-auto max-w-6xl px-4 py-6 space-y-8">
        <HeroCover />

        {!user && (
          <RoleLogin onLogin={handleLogin} />
        )}

        {user && (
          <div className="space-y-4">
            <div className="rounded-xl bg-white p-4 ring-1 ring-slate-200">
              <p className="text-sm text-slate-600">Welcome back, <span className="font-semibold text-slate-800">{user.email}</span>. You are signed in as <span className="font-semibold">{user.role}</span>.</p>
            </div>

            <SectionTabs onChange={setActive} />

            {active === 'dashboard' && (
              <RoleAwareDashboard role={user.role} />
            )}

            {active === 'patients' && (
              <PatientsManager role={user.role} />
            )}

            {active === 'billing' && (
              <BillingManager role={user.role} />
            )}

            <section id="settings" className="rounded-xl bg-white p-4 ring-1 ring-slate-200">
              <h3 className="text-sm font-semibold text-slate-700">Profile Settings</h3>
              <div className="mt-3 grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600">Name</label>
                  <input className="mt-1 w-full rounded-lg border-slate-300 focus:border-emerald-500 focus:ring-emerald-500" defaultValue={user.email.split('@')[0]} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600">Email</label>
                  <input className="mt-1 w-full rounded-lg border-slate-300 focus:border-emerald-500 focus:ring-emerald-500" defaultValue={user.email} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600">Role</label>
                  <input disabled className="mt-1 w-full rounded-lg border-slate-300 bg-slate-50 text-slate-500" value={user.role} />
                </div>
              </div>
              <div className="mt-4">
                <button className="inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2 text-white text-sm font-semibold hover:bg-emerald-700">Save Changes</button>
              </div>
            </section>
          </div>
        )}

        <footer className="text-center text-xs text-slate-500 py-8">
          © {new Date().getFullYear()} MediTrack — Demo UI
        </footer>
      </main>
    </div>
  );
}
