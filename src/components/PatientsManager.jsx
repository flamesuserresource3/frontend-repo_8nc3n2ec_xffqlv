import { useMemo, useState } from 'react';
import { UserPlus, Users, Download, Search } from 'lucide-react';

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

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
  const [lookupId, setLookupId] = useState('');
  const [foundPatient, setFoundPatient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addPatient = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name) return;
    try {
      setLoading(true);
      const payload = {
        name: form.name,
        age: Number(form.age || 0),
        gender: form.gender,
        phone: form.phone || undefined,
        mrn: form.mrn || undefined,
        department: form.department || undefined,
        diagnosis: form.diagnosis || undefined,
      };
      const res = await fetch(`${API}/patients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await res.text());
      const saved = await res.json();
      setPatients((prev) => [saved, ...prev]);
      setForm({ name: '', age: '', gender: 'Male', phone: '', mrn: '', department: 'General', diagnosis: '' });
    } catch (err) {
      setError('Failed to add patient');
    } finally {
      setLoading(false);
    }
  };

  const csv = useMemo(() => toCSV(patients.map(({ _id, createdAt, updatedAt, ...rest }) => rest)), [patients]);

  const downloadCSV = () => {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'patients.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const lookupPatient = async () => {
    setError('');
    setFoundPatient(null);
    if (!lookupId) return;
    try {
      setLoading(true);
      const res = await fetch(`${API}/patients/${lookupId}`);
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setFoundPatient(data);
    } catch (err) {
      setError('Patient not found');
    } finally {
      setLoading(false);
    }
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

      <div className="grid md:grid-cols-3 gap-4">
        {canAdd && (
          <form onSubmit={addPatient} className="md:col-span-2 rounded-xl bg-white p-4 ring-1 ring-slate-200 grid md:grid-cols-7 gap-3">
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
              <input name="mrn" value={form.mrn} onChange={handleChange} className="mt-1 w-full rounded-lg border-slate-300 focus:border-emerald-500 focus:ring-emerald-500" placeholder="HOS-0001" />
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
              <button type="submit" disabled={loading} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 text-white px-4 py-2 text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50">
                <UserPlus size={16} /> {loading ? 'Saving...' : 'Add Patient'}
              </button>
            </div>
            {error && <div className="md:col-span-7 text-sm text-red-600">{error}</div>}
          </form>
        )}

        {/* Lookup by Patient ID */}
        <div className="rounded-xl bg-white p-4 ring-1 ring-slate-200 space-y-3">
          <label className="block text-xs font-medium text-slate-600">Find by Patient ID</label>
          <div className="flex gap-2">
            <input value={lookupId} onChange={(e) => setLookupId(e.target.value)} className="flex-1 rounded-lg border-slate-300 focus:border-emerald-500 focus:ring-emerald-500" placeholder="e.g., PT-240101-01234" />
            <button onClick={lookupPatient} className="inline-flex items-center gap-1 rounded-lg bg-slate-900 text-white px-3 py-1.5 text-sm">
              <Search size={16} /> Lookup
            </button>
          </div>
          {foundPatient && (
            <div className="text-sm text-slate-700 space-y-1">
              <p><span className="font-semibold">Name:</span> {foundPatient.name}</p>
              <p><span className="font-semibold">Phone:</span> {foundPatient.phone || '-'} | <span className="font-semibold">MRN:</span> {foundPatient.mrn || '-'}</p>
              <p><span className="font-semibold">Department:</span> {foundPatient.department || '-'} | <span className="font-semibold">Doctor:</span> {foundPatient.doctor || '-'}</p>
              <p className="text-xs text-slate-500">Patient ID: {foundPatient.patient_id}</p>
            </div>
          )}
          {error && !foundPatient && (
            <div className="text-xs text-red-600">{error}</div>
          )}
        </div>
      </div>

      <div className="rounded-xl bg-white ring-1 ring-slate-200 overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              {['Patient ID','MRN','Name','Age','Gender','Phone','Department','Diagnosis','Created'].map((h) => (
                <th key={h} className="px-3 py-2 text-left text-xs font-semibold text-slate-600">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {patients.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-3 py-6 text-center text-sm text-slate-500">No patients yet. Use the form above to add a new patient.</td>
              </tr>
            ) : (
              patients.map((p) => (
                <tr key={p.patient_id || p._id} className="hover:bg-slate-50/50">
                  <td className="px-3 py-2 text-xs text-slate-700">{p.patient_id}</td>
                  <td className="px-3 py-2 text-sm font-medium text-slate-800">{p.mrn}</td>
                  <td className="px-3 py-2 text-sm text-slate-700">{p.name}</td>
                  <td className="px-3 py-2 text-sm text-slate-700">{p.age}</td>
                  <td className="px-3 py-2 text-sm text-slate-700">{p.gender}</td>
                  <td className="px-3 py-2 text-sm text-slate-700">{p.phone}</td>
                  <td className="px-3 py-2 text-sm text-slate-700">{p.department}</td>
                  <td className="px-3 py-2 text-sm text-slate-700 max-w-xs truncate" title={p.diagnosis}>{p.diagnosis}</td>
                  <td className="px-3 py-2 text-xs text-slate-500">{p.createdAt ? new Date(p.createdAt).toLocaleString() : ''}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
