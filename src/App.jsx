import { useState } from 'react';
import TopNav from './components/TopNav.jsx';
import RoleLogin from './components/RoleLogin.jsx';
import PatientsManager from './components/PatientsManager.jsx';
import BillingManager from './components/BillingManager.jsx';

const sections = [
  { key: 'patients', label: 'Patients' },
  { key: 'billing', label: 'Billing' },
];

export default function App() {
  const [role, setRole] = useState(null);
  const [active, setActive] = useState('patients');

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      <TopNav role={role} onLogout={() => { setRole(null); setActive('patients'); }} sections={sections} active={active} onSelect={setActive} />

      {/* Public landing experience */}
      {!role && (
        <div className="max-w-6xl mx-auto px-4">
          <section className="mt-6 relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-sky-600 to-indigo-700 text-white">
            <div className="absolute inset-0 opacity-20" style={{backgroundImage:'radial-gradient(circle at 20% 20%, white 2px, transparent 2px), radial-gradient(circle at 60% 40%, white 2px, transparent 2px), radial-gradient(circle at 80% 70%, white 2px, transparent 2px)', backgroundSize:'220px 220px'}} />
            <div className="relative px-6 md:px-10 py-12">
              <div className="max-w-3xl">
                <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-semibold ring-1 ring-white/25">Hospital • Inventory • Patients</span>
                <h1 className="mt-4 text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">MediTrack — Smart Hospital Management</h1>
                <p className="mt-3 md:mt-4 text-sm md:text-base text-white/90 max-w-2xl">Manage patients, billing, and medicines with a clean, role‑aware workflow. Fast, secure, and designed for clarity.</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a href="#login" className="inline-flex items-center rounded-lg bg-white text-emerald-700 px-4 py-2 text-sm font-semibold shadow hover:bg-white/90 transition">Get Started</a>
                  <span className="inline-flex items-center rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold ring-1 ring-white/20">Manager & Doctor can modify billing and inventory</span>
                </div>
              </div>
            </div>
          </section>

          <section id="login" className="py-8">
            <RoleLogin onLogin={setRole} />
          </section>
        </div>
      )}

      {/* Authenticated dashboard sections */}
      {role && (
        <main className="max-w-6xl mx-auto px-4 py-6">
          <div className="space-y-8">
            {active === 'patients' && <PatientsManager role={role} />}
            {active === 'billing' && <BillingManager role={role} />}
          </div>
        </main>
      )}
    </div>
  );
}
