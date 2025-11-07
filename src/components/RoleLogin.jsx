import { useState } from 'react';
import { User, Shield } from 'lucide-react';

const MOCK_USERS = [
  { email: 'manager@meditrack.com', password: 'manager123', role: 'Manager' },
  { email: 'manager2@meditrack.com', password: 'manager456', role: 'Manager' },
  { email: 'doctor@meditrack.com', password: 'doctor123', role: 'Doctor' },
  { email: 'doctor2@meditrack.com', password: 'doctor456', role: 'Doctor' },
  { email: 'staff@meditrack.com', password: 'staff123', role: 'Staff' },
  { email: 'staff2@meditrack.com', password: 'staff456', role: 'Staff' },
];

export default function RoleLogin({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Manager');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const found = MOCK_USERS.find(u => u.email === email && u.password === password && u.role === role);
    if (found) {
      onLogin({ email: found.email, role: found.role });
    } else {
      setError('Invalid credentials. Please check email, password, and role.');
    }
  };

  return (
    <section id="login" className="w-full">
      <div className="grid md:grid-cols-2 gap-6 items-start">
        <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <User size={20} />
            </div>
            <h2 className="text-lg font-semibold text-slate-800">Secure Login</h2>
          </div>
          <p className="text-sm text-slate-600 mt-1">Sign in with a role to explore the demo dashboard.</p>

          <div className="mt-4 space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-700">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-lg border-slate-300 focus:border-emerald-500 focus:ring-emerald-500" placeholder="you@meditrack.com" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full rounded-lg border-slate-300 focus:border-emerald-500 focus:ring-emerald-500" placeholder="••••••••" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Role</label>
              <div className="mt-1 relative">
                <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full appearance-none rounded-lg border-slate-300 pr-10 focus:border-emerald-500 focus:ring-emerald-500">
                  <option>Manager</option>
                  <option>Doctor</option>
                  <option>Staff</option>
                </select>
                <Shield className="absolute right-3 top-2.5 text-slate-400" size={18} />
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-3 rounded-lg bg-red-50 text-red-700 text-sm px-3 py-2 border border-red-200">
              {error}
            </div>
          )}

          <button type="submit" className="mt-5 inline-flex w-full justify-center rounded-lg bg-emerald-600 px-4 py-2.5 text-white font-semibold shadow hover:bg-emerald-700 transition">
            Sign In
          </button>
        </form>

        <div className="bg-slate-900 text-slate-100 rounded-xl p-6 border border-slate-800">
          <h3 className="text-sm font-semibold text-emerald-300">Mock Credentials</h3>
          <p className="mt-1 text-xs text-slate-300">Use any of these combinations. Email and password fields start empty by design.</p>
          <div className="mt-4 grid sm:grid-cols-2 gap-3">
            {['Manager','Doctor','Staff'].map(group => (
              <div key={group} className="rounded-lg bg-slate-800/60 p-3 ring-1 ring-white/10">
                <p className="text-xs uppercase tracking-wide text-slate-400">{group}</p>
                <ul className="mt-2 space-y-1">
                  {MOCK_USERS.filter(u => u.role === group).map((u, i) => (
                    <li key={i} className="text-xs">
                      <span className="text-slate-200">{u.email}</span>
                      <span className="text-slate-500"> / {u.password}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
