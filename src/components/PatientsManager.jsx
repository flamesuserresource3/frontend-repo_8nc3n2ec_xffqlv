import { useMemo, useState } from 'react';
import { UserPlus, Users, Download } from 'lucide-react';

function toCSV(rows) {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]);
  const escape = (val) => `"${String(val ?? '').replace(/"/g, '""')}"`;
  const lines = [headers.map(escape).join(',')];
  for (const row of rows) {
    lines.push(headers.map((h) => escape(row[h])).join(','));
  }
  return lines.join('\n');
}

export default function PatientsManager({ role }) {
  const canAdd = ['Manager', 'Doctor', 'Staff'].includes(role);
  const [patients, setPatients] = useState(() => []);
  const [form, setForm] = useState({
    name: '',
    age: '',
    gender: 'Male',
    phone: '',
    mrn: '',
    department: 'General',
    diagnosis: '',
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addPatient = (e) => {
    e.preventDefault();
    if (!form.name || !form.mrn) return;
    const entry = {
      id: Date.now().toString(36),
      ...form,
      age: Number(form.age || 0),
      createdAt: new Date().toISOString(),
    };
    setPatients((prev) => [entry, ...prev]);
    setForm({ name: '', age: '', gender: 'Male', phone: '', mrn: '', department: 'General', diagnosis: '' });
  };

  const csv = useMemo(() => toCSV(patients.map(({ id, createdAt, ...rest }) => rest)), [patients]);

  const downloadCSV = () => {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'patients.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section id="patients" className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center"><Users size={18} /></div>
          <h3 className="text-sm font-semibold text-slate-700">Patients</h3>
        </div>
        <button onClick={downloadCSV} disabled={!patients.length} className="inline-flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-sm font-medium ring-1 ring-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-50">
          <Download size={16} /> Export CSV
        </button>
      </div>

      {canAdd && (
        <form onSubmit={addPatient} className="rounded-xl bg-white p-4 ring-1 ring-slate-200 grid md:grid-cols-7 gap-3">
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-slate-600">Full Name</label>
            <input name="name" value={form.name} onChange={handleChange} required className="mt-1 w-full rounded-lg border-slate-300 focus:border-emerald-500 focus:ring-emerald-500" placeholder="John Doe" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600">Age</label>
            <input name="age" value={form.age} onChange={handleChange} type="number" min="0" className="mt-1 w-full rounded-lg border-slate-300 focus:border-emerald-500 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600">Gender</label>
            <select name="gender" value={form.gender} onChange={handleChange} className="mt-1 w-full rounded-lg border-slate-300 focus:border-emerald-500 focus:ring-emerald-500">
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600">Phone</label>
            <input name="phone" value={form.phone} onChange={handleChange} className="mt-1 w-full rounded-lg border-slate-300 focus:border-emerald-500 focus:ring-emerald-500" placeholder="+91-9876543210" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600">MRN</label>
            <input name="mrn" value={form.mrn} onChange={handleChange} required className="mt-1 w-full rounded-lg border-slate-300 focus:border-emerald-500 focus:ring-emerald-500" placeholder="HOS-0001" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600">Department</label>
            <select name="department" value={form.department} onChange={handleChange} className="mt-1 w-full rounded-lg border-slate-300 focus:border-emerald-500 focus:ring-emerald-500">
              <option>General</option>
              <option>Cardiology</option>
              <option>Orthopedics</option>
              <option>Pediatrics</option>
              <option>Oncology</option>
            </select>
          </div>
          <div className="md:col-span-7">
            <label className="block text-xs font-medium text-slate-600">Diagnosis / Notes</label>
            <input name="diagnosis" value={form.diagnosis} onChange={handleChange} className="mt-1 w-full rounded-lg border-slate-300 focus:border-emerald-500 focus:ring-emerald-500" placeholder="Fever, cough — suspected viral infection" />
          </div>
          <div className="md:col-span-7 flex justify-end">
            <button type="submit" className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 text-white px-4 py-2 text-sm font-semibold hover:bg-emerald-700">
              <UserPlus size={16} /> Add Patient
            </button>
          </div>
        </form>
      )}

      <div className="rounded-xl bg-white ring-1 ring-slate-200 overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              {['MRN','Name','Age','Gender','Phone','Department','Diagnosis','Created'].map((h) => (
                <th key={h} className="px-3 py-2 text-left text-xs font-semibold text-slate-600">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {patients.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-3 py-6 text-center text-sm text-slate-500">No patients yet. Use the form above to add a new patient.</td>
              </tr>
            ) : (
              patients.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50">
                  <td className="px-3 py-2 text-sm font-medium text-slate-800">{p.mrn}</td>
                  <td className="px-3 py-2 text-sm text-slate-700">{p.name}</td>
                  <td className="px-3 py-2 text-sm text-slate-700">{p.age}</td>
                  <td className="px-3 py-2 text-sm text-slate-700">{p.gender}</td>
                  <td className="px-3 py-2 text-sm text-slate-700">{p.phone}</td>
                  <td className="px-3 py-2 text-sm text-slate-700">{p.department}</td>
                  <td className="px-3 py-2 text-sm text-slate-700 max-w-xs truncate" title={p.diagnosis}>{p.diagnosis}</td>
                  <td className="px-3 py-2 text-xs text-slate-500">{new Date(p.createdAt).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
