import { useMemo, useState } from 'react';

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export default function BillingManager({ role }) {
  const [patientId, setPatientId] = useState('');
  const [patient, setPatient] = useState(null);
  const [items, setItems] = useState([{ name: '', qty: 1, price: 0 }]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  const canEditMoney = role === 'Manager' || role === 'Doctor';

  const total = useMemo(() => items.reduce((sum, it) => sum + (Number(it.qty) || 0) * (Number(it.price) || 0), 0), [items]);

  const fetchPatient = async () => {
    setError('');
    setMessage('');
    try {
      const res = await fetch(`${API_BASE}/patients/${patientId}`);
      if (!res.ok) {
        const msg = await res.json().catch(()=>({detail:'Patient not found'}));
        throw new Error(msg.detail || 'Patient not found');
      }
      const data = await res.json();
      setPatient(data);
    } catch (err) {
      setPatient(null);
      setError(err.message);
    }
  };

  const setItem = (idx, patch) => {
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  };

  const addItem = () => setItems((prev) => [...prev, { name: '', qty: 1, price: 0 }]);

  const createBill = async () => {
    if (!canEditMoney) return;
    setError('');
    setMessage('');
    try {
      const res = await fetch(`${API_BASE}/bills`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Role': role },
        body: JSON.stringify({ patient_id: patientId, items }),
      });
      if (!res.ok) {
        const msg = await res.json().catch(()=>({detail:'Failed to create bill'}));
        throw new Error(msg.detail || 'Failed to create bill');
      }
      const data = await res.json();
      setMessage(`Bill ${data.bill_id} created. Total: ₹${data.total}`);
      setItems([{ name: '', qty: 1, price: 0 }]);
    } catch (err) {
      setError(err.message);
    }
  };

  const onCsvUpload = async (e) => {
    if (!canEditMoney) return;
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    setMessage('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('patient_id', patientId);
      const res = await fetch(`${API_BASE}/bills/upload-csv`, { method: 'POST', headers: { 'X-Role': role }, body: fd });
      if (!res.ok) {
        const msg = await res.json().catch(()=>({detail:'CSV upload failed'}));
        throw new Error(msg.detail || 'CSV upload failed');
      }
      const data = await res.json();
      setMessage(`Bill ${data.bill_id} created from CSV. Total: ₹${data.total}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const onImageUpload = async (e) => {
    if (!canEditMoney) return;
    const file = e.target.files?.[0];
    if (!file) return;
    setImageUploading(true);
    setError('');
    setMessage('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('patient_id', patientId);
      const res = await fetch(`${API_BASE}/bills/upload-image`, { method: 'POST', headers: { 'X-Role': role }, body: fd });
      if (!res.ok) {
        const msg = await res.json().catch(()=>({detail:'Image bill upload failed'}));
        throw new Error(msg.detail || 'Image bill upload failed');
      }
      const data = await res.json();
      setMessage(`Bill ${data.bill_id} created from image. Total: ₹${data.total}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setImageUploading(false);
      e.target.value = '';
    }
  };

  return (
    <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Billing</h3>
        {!canEditMoney && <span className="text-xs text-slate-500">Only Doctor/Manager can edit billing or medicines</span>}
      </div>

      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">{error}</div>
      )}
      {message && (
        <div className="mb-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-md px-3 py-2">{message}</div>
      )}

      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <input value={patientId} onChange={(e)=>setPatientId(e.target.value)} placeholder="Patient ID" className="border rounded-md px-3 py-2 w-full md:w-64" />
          <button onClick={fetchPatient} className="px-4 py-2 rounded-md border bg-white hover:bg-slate-50">Autofill</button>
          <label className={`px-4 py-2 rounded-md border cursor-pointer ${canEditMoney? 'bg-white hover:bg-slate-50':'bg-slate-100 cursor-not-allowed'}`}>
            Upload Bill CSV
            <input type="file" accept=".csv" onChange={onCsvUpload} className="hidden" disabled={!canEditMoney || uploading} />
          </label>
          <label className={`px-4 py-2 rounded-md border cursor-pointer ${canEditMoney? 'bg-white hover:bg-slate-50':'bg-slate-100 cursor-not-allowed'}`}>
            Upload Bill Image
            <input type="file" accept="image/*" onChange={onImageUpload} className="hidden" disabled={!canEditMoney || imageUploading} />
          </label>
        </div>

        {patient && (
          <div className="text-sm bg-slate-50 border border-slate-200 rounded-md p-3">
            <div><span className="text-slate-500">Name:</span> {patient.name} | <span className="text-slate-500">MRN:</span> {patient.mrn || '-'}</div>
            <div><span className="text-slate-500">Doctor:</span> {patient.doctor || '-'} | <span className="text-slate-500">Phone:</span> {patient.phone || '-'}</div>
          </div>
        )}

        <div className="space-y-2">
          {items.map((it, idx) => (
            <div key={idx} className="grid grid-cols-1 md:grid-cols-6 gap-2 items-center">
              <input disabled={!canEditMoney} placeholder="Item name" className="md:col-span-3 border rounded-md px-3 py-2" value={it.name} onChange={(e)=>setItem(idx,{name:e.target.value})} />
              <input disabled={!canEditMoney} type="number" min="1" placeholder="Qty" className="border rounded-md px-3 py-2" value={it.qty} onChange={(e)=>setItem(idx,{qty:e.target.value})} />
              <input disabled={!canEditMoney} type="number" min="0" step="0.01" placeholder="Price" className="border rounded-md px-3 py-2" value={it.price} onChange={(e)=>setItem(idx,{price:e.target.value})} />
              <div className="text-right font-medium">₹{(Number(it.qty||0)*Number(it.price||0)).toFixed(2)}</div>
            </div>
          ))}
          <div className="flex items-center justify-between pt-2">
            <button onClick={addItem} disabled={!canEditMoney} className={`px-3 py-2 rounded-md text-sm ${canEditMoney? 'border bg-white hover:bg-slate-50':'bg-slate-100 cursor-not-allowed'}`}>Add Item</button>
            <div className="text-right text-lg font-semibold">Total: ₹{total.toFixed(2)}</div>
          </div>
        </div>

        <div className="flex justify-end">
          <button onClick={createBill} disabled={!canEditMoney} className={`px-4 py-2 rounded-md text-white ${canEditMoney? 'bg-indigo-600 hover:bg-indigo-700':'bg-slate-300 cursor-not-allowed'}`}>Generate Bill</button>
        </div>
      </div>
    </section>
  );
}
