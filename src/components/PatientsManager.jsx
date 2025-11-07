import { useState } from 'react';

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export default function PatientsManager({ role }) {
  const [form, setForm] = useState({ name: '', phone: '', mrn: '', department: '', doctor: '' });
  const [created, setCreated] = useState(null);
  const [lookupId, setLookupId] = useState('');
  const [found, setFound] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Everyone can register patients. Money/billing/medicines are restricted elsewhere.
  const canEdit = true;

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/patients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const msg = await res.json().catch(()=>({detail:'Failed to add patient'}));
        throw new Error(msg.detail || 'Failed to add patient');
      }
      const data = await res.json();
      setCreated(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLookup = async () => {
    setError('');
    setLoading(true);
    setFound(null);
    try {
      const res = await fetch(`${API_BASE}/patients/${lookupId}`);
      if (!res.ok) {
        const msg = await res.json().catch(()=>({detail:'Patient not found'}));
        throw new Error(msg.detail || 'Patient not found');
      }
      const data = await res.json();
      setFound(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Patients</h3>
      </div>

      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">{error}</div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <form onSubmit={handleCreate} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input disabled={!canEdit} required placeholder="Name" className="border rounded-md px-3 py-2" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} />
            <input disabled={!canEdit} placeholder="Phone" className="border rounded-md px-3 py-2" value={form.phone} onChange={(e)=>setForm({...form,phone:e.target.value})} />
            <input disabled={!canEdit} placeholder="MRN" className="border rounded-md px-3 py-2" value={form.mrn} onChange={(e)=>setForm({...form,mrn:e.target.value})} />
            <input disabled={!canEdit} placeholder="Department" className="border rounded-md px-3 py-2" value={form.department} onChange={(e)=>setForm({...form,department:e.target.value})} />
            <input disabled={!canEdit} placeholder="Doctor" className="border rounded-md px-3 py-2" value={form.doctor} onChange={(e)=>setForm({...form,doctor:e.target.value})} />
          </div>
          <button disabled={!canEdit || loading} className={`px-4 py-2 rounded-md text-white ${canEdit? 'bg-indigo-600 hover:bg-indigo-700':'bg-slate-300 cursor-not-allowed'}`}>{loading? 'Saving...':'Add Patient'}</button>
          {created && (
            <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-md px-3 py-2">Added patient with ID: <span className="font-mono">{created.patient_id}</span></div>
          )}
        </form>

        <div className="space-y-3">
          <div className="flex gap-2">
            <input placeholder="Find by Patient ID" className="flex-1 border rounded-md px-3 py-2" value={lookupId} onChange={(e)=>setLookupId(e.target.value)} />
            <button type="button" onClick={handleLookup} className="px-4 py-2 rounded-md border bg-white hover:bg-slate-50">Search</button>
          </div>
          {found && (
            <div className="text-sm bg-slate-50 border border-slate-200 rounded-md p-3">
              <div><span className="text-slate-500">Name:</span> {found.name}</div>
              <div><span className="text-slate-500">Phone:</span> {found.phone || '-'} | <span className="text-slate-500">MRN:</span> {found.mrn || '-'}</div>
              <div><span className="text-slate-500">Department:</span> {found.department || '-'} | <span className="text-slate-500">Doctor:</span> {found.doctor || '-'}</div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
