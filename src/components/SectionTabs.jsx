import { useState } from 'react';
import { LayoutDashboard, Users, Receipt } from 'lucide-react';

export default function SectionTabs({ onChange }) {
  const [tab, setTab] = useState('dashboard');
  const tabs = [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { key: 'patients', label: 'Patients', icon: Users },
    { key: 'billing', label: 'Billing', icon: Receipt },
  ];
  const select = (key) => { setTab(key); onChange?.(key); };
  return (
    <div className="w-full overflow-x-auto">
      <div className="inline-flex gap-2 rounded-lg bg-white p-1 ring-1 ring-slate-200">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => select(key)} className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition ${tab === key ? 'bg-emerald-600 text-white' : 'text-slate-700 hover:bg-slate-50'}`}>
            <Icon size={16} /> {label}
          </button>
        ))}
      </div>
    </div>
  );
}
