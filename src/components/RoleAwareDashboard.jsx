import { useMemo } from 'react';
import { DollarSign, Activity, Users, Package, TrendingUp } from 'lucide-react';

function StatCard({ title, value, icon: Icon, accent = 'emerald' }) {
  const accentMap = {
    emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    sky: 'bg-sky-50 text-sky-700 ring-sky-200',
    violet: 'bg-violet-50 text-violet-700 ring-violet-200',
    amber: 'bg-amber-50 text-amber-700 ring-amber-200',
  };
  return (
    <div className={`rounded-xl bg-white p-4 ring-1 ${accentMap[accent]} flex items-center gap-3`}>
      <div className={`h-10 w-10 rounded-lg flex items-center justify-center bg-white/70 ring-1 ring-black/5`}>
        <Icon size={18} />
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide opacity-70">{title}</p>
        <p className="text-xl font-semibold">{value}</p>
      </div>
    </div>
  );
}

function Bar({ label, value, max = 100, color = 'bg-emerald-500' }) {
  const width = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-slate-500">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="h-2 rounded-full bg-slate-100">
        <div className={`h-2 rounded-full ${color}`} style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}

function RecentSales() {
  const items = [
    { name: 'Amit Shah', item: 'Paracetamol 650mg', amount: 1800 },
    { name: 'Neha Verma', item: 'Amoxicillin 500mg', amount: 1320 },
    { name: 'Rahul Singh', item: 'Insulin (10ml)', amount: 2450 },
    { name: 'Priya Nair', item: 'Vitamin D3', amount: 760 },
  ];
  return (
    <div className="rounded-xl bg-white p-4 ring-1 ring-slate-200">
      <h3 className="text-sm font-semibold text-slate-700">Recent Sales</h3>
      <ul className="mt-3 divide-y">
        {items.map((s, i) => (
          <li key={i} className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-xs font-semibold">
                {s.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800">{s.name}</p>
                <p className="text-xs text-slate-500">{s.item}</p>
              </div>
            </div>
            <p className="text-sm font-semibold text-slate-800">₹{s.amount.toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SmartReorder() {
  const suggestions = [
    { name: 'Paracetamol 650mg', suggestQty: 120, estCost: 3600, reason: '7-day trend shows 35% spike in fever cases; stock below 3-day threshold.' },
    { name: 'Insulin (10ml)', suggestQty: 60, estCost: 7200, reason: 'Chronic patients increasing; reorder to maintain 2-week supply.' },
    { name: 'Surgical Masks', suggestQty: 500, estCost: 5000, reason: 'Seasonal flu forecast; maintain buffer for OPD rush.' },
  ];
  return (
    <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-sky-50 p-4 ring-1 ring-emerald-100">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-emerald-900">AI Smart Reorder Suggestions</h3>
        <span className="inline-flex items-center rounded-full bg-emerald-600 text-white text-xs font-semibold px-2 py-0.5">Genkit</span>
      </div>
      <ul className="mt-3 space-y-3">
        {suggestions.map((s, i) => (
          <li key={i} className="rounded-lg bg-white p-3 ring-1 ring-emerald-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-800">{s.name}</p>
                <p className="text-xs text-slate-500">{s.reason}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500">Suggested Qty</p>
                <p className="text-sm font-semibold">{s.suggestQty}</p>
                <p className="text-xs text-slate-500">Est. Cost ₹{s.estCost.toLocaleString()}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function RoleAwareDashboard({ role }) {
  const stats = useMemo(() => ({
    revenue: '₹12.4L',
    sales: '1,284',
    patients: '324',
    lowStock: '12 items',
  }), []);

  const showFinance = role === 'Manager' || role === 'Doctor';

  const salesOverview = [
    { label: 'Mon', value: 120 },
    { label: 'Tue', value: 140 },
    { label: 'Wed', value: 160 },
    { label: 'Thu', value: 90 },
    { label: 'Fri', value: 180 },
    { label: 'Sat', value: 210 },
    { label: 'Sun', value: 130 },
  ];

  const activePatients = [
    { label: 'OPD', value: 80 },
    { label: 'IPD', value: 55 },
    { label: 'ER', value: 30 },
    { label: 'Lab', value: 40 },
  ];

  return (
    <section id="dashboard" className="w-full">
      <div className="grid md:grid-cols-4 gap-4">
        {showFinance && (
          <StatCard title="Total Revenue" value={stats.revenue} icon={DollarSign} accent="emerald" />
        )}
        {showFinance && (
          <StatCard title="Sales" value={stats.sales} icon={TrendingUp} accent="sky" />
        )}
        <StatCard title="Active Patients" value={stats.patients} icon={Users} accent="violet" />
        <StatCard title="Low Stock" value={stats.lowStock} icon={Package} accent="amber" />
      </div>

      <div className="mt-4 grid lg:grid-cols-3 gap-4">
        {/* Charts */}
        <div className="rounded-xl bg-white p-4 ring-1 ring-slate-200 lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-700">{showFinance ? 'Sales Overview' : 'Active Patients'}</h3>
          <div className="mt-3 grid grid-cols-7 gap-2">
            {(showFinance ? salesOverview : salesOverview).map((d, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="w-full bg-emerald-100 rounded-md overflow-hidden h-28 flex items-end">
                  <div className="w-full bg-emerald-500" style={{ height: `${d.value / 2.5}%` }} />
                </div>
                <span className="text-xs text-slate-500">{d.label}</span>
              </div>
            ))}
          </div>
        </div>
        <SmartReorder />
      </div>

      <div className="mt-4 grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-xl bg-white p-4 ring-1 ring-slate-200">
          <h3 className="text-sm font-semibold text-slate-700">Active Patients</h3>
          <div className="mt-3 space-y-2">
            {activePatients.map((a, i) => (
              <Bar key={i} label={a.label} value={a.value} max={100} color={i % 2 === 0 ? 'bg-sky-500' : 'bg-emerald-500'} />
            ))}
          </div>
        </div>
        <RecentSales />
      </div>
    </section>
  );
}
