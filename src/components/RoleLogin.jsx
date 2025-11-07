const MOCK_USERS = [
  { email: 'manager@meditrack.com', password: 'manager123', role: 'Manager' },
  { email: 'doctor@meditrack.com', password: 'doctor123', role: 'Doctor' },
  { email: 'staff@meditrack.com', password: 'staff123', role: 'Staff' },
];

export default function RoleLogin({ onLogin }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    const user = MOCK_USERS.find((u) => u.email === email && u.password === password);
    if (user) onLogin(user.role);
    else alert('Invalid credentials');
  };

  return (
    <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Sign in</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input name="email" type="email" className="w-full border rounded-md px-3 py-2" defaultValue="manager@meditrack.com" />
        </div>
        <div>
          <label className="block text-sm mb-1">Password</label>
          <input name="password" type="password" className="w-full border rounded-md px-3 py-2" defaultValue="manager123" />
        </div>
        <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-md py-2">Continue</button>
      </form>
    </div>
  );
}
