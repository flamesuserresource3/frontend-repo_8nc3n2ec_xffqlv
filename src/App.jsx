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
      <TopNav role={role} onLogout={() => setRole(null)} sections={sections} active={active} onSelect={setActive} />
      <main className="max-w-6xl mx-auto px-4 py-6">
        {!role ? (
          <RoleLogin onLogin={setRole} />
        ) : (
          <div className="space-y-8">
            {active === 'patients' && <PatientsManager role={role} />}
            {active === 'billing' && <BillingManager role={role} />}
          </div>
        )}
      </main>
    </div>
  );
}
