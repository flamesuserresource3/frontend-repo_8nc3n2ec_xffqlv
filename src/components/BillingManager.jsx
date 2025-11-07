import { useMemo, useState } from 'react';
import { Receipt, Plus, Download, Upload, Search } from 'lucide-react';

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

function currency(n) {
  const num = Number(n || 0);
  return `₹${num.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
}

function toCSV(rows) {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]);
  const escape = (val) => `"${String(val ?? '').replace(/"/g, '""')}"`;
  const lines = [headers.map(escape).join(',')];
  for (const row of rows) lines.push(headers.map((h) => escape(row[h])).join(','));
  return lines.join('\n');
}

export default function BillingManager({ role }) {
  const canBill = ['Manager', 'Staff'].includes(role);
  const [items, setItems] = useState([{ name: '', qty: 1, price: 0 }]);
  const [bills, setBills] = useState([]);
  const [meta, setMeta] = useState({ patient: '', patient_id: '', mrn: '', doctor: '', phone: '' });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const subtotal = items.reduce((s, it) => s + (Number(it.qty || 0) * Number(it.price || 0)), 0);
  const tax = Math.round(subtotal * 0.12 * 100) / 100; // 12%
  const total = subtotal + tax;

  const addRow = () => setItems((prev) => [...prev, { name: '', qty: 1, price: 0 }]);
  const removeRow = (idx) => setItems((prev) => prev.filter((_, i) => i !== idx));
  const updateRow = (idx, key, val) => setItems((prev) => prev.map((r, i) => i === idx ? { ...r, [key]: val } : r));

  const submitBill = async (e) => {
    e.preventDefault();
    if (!canBill) return;
    if (!meta.patient_id) return setError('Patient ID is required');
    try {
      setError('');
      const payload = {
        patient_id: meta.patient_id,
        patient_name: meta.patient || undefined,
        patient_phone: meta.phone || undefined,
        doctor: meta.doctor || undefined,
        mrn: meta.mrn || undefined,
        items: items.filter((it) => it.name && Number(it.qty) > 0),
        subtotal,
        tax,
        total,
      };
      const res = await fetch(`${API}/bills`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await res.text());
      const record = await res.json();
      setBills((prev) => [record, ...prev]);
      setMeta({ patient: '', patient_id: '', mrn: '', doctor: '', phone: '' });
      setItems([{ name: '', qty: 1, price: 0 }]);
    } catch (err) {
      setError('Failed to create bill');
    }
  };

  const csv = useMemo(() => toCSV(bills.map(({ _id, createdAt, updatedAt, items, ...rest }) => rest)), [bills]);

  const downloadCSV = () => {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bills.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const uploadCSV = async (file) => {
    if (!file) return;
    try {
      setUploading(true);
      setError('');
      const form = new FormData();
      form.append('file', file);
      const res = await fetch(`${API}/bills/upload-csv`, { method: 'POST', body: form });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setBills((prev) => [data, ...prev]);
    } catch (err) {
      setError('Upload failed. Ensure CSV has name,qty,price and patient fields.');
    } finally {
      setUploading(false);
    }
  };

  const fetchPatient = async () => {
    if (!meta.patient_id) return;
    try {
      const res = await fetch(`${API}/patients/${meta.patient_id}`);
      if (!res.ok) throw new Error(await res.text());
      const p = await res.json();
      setMeta((m) => ({ ...m, patient: p.name, phone: p.phone || '', mrn: p.mrn || '', doctor: p.doctor || '' }));
    } catch (e) {
      setError('No patient found for that ID');
    }
  };

  return (
    <section id="billing" className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center"><Receipt size={18} /></div>
          <h3 className="text-sm font-semibold text-slate-700">Medical Billing</h3>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={downloadCSV} disabled={!bills.length} className="inline-flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-sm font-medium ring-1 ring-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-50">
            <Download size={16} /> Export CSV
          </button>
          <label className="inline-flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-sm font-medium ring-1 ring-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer">
            <Upload size={16} /> Upload Bill CSV
            <input type="file" accept=".csv" className="hidden" onChange={(e) => uploadCSV(e.target.files?.[0])} />
          </label>
        </div>
      </div>

      <form onSubmit={submitBill} className="rounded-xl bg-white p-4 ring-1 ring-slate-200 space-y-3">
        <div className="grid md:grid-cols-4 gap-3">
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-slate-600">Patient ID</label>
            <div className="flex gap-2">
              <input value={meta.patient_id} onChange={(e) => setMeta({ ...meta, patient_id: e.target.value })} required className="flex-1 rounded-lg border-slate-300 focus:border-emerald-500 focus:ring-emerald-500" placeholder="PT-240101-01234" />
              <button type="button" onClick={fetchPatient} className="inline-flex items-center gap-1 rounded-lg bg-slate-900 text-white px-3 py-1.5 text-sm">
                <Search size={16} /> Autofill
              </button>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600">Patient Name</label>
            <input value={meta.patient} onChange={(e) => setMeta({ ...meta, patient: e.target.value })} className="mt-1 w-full rounded-lg border-slate-300 focus:border-emerald-500 focus:ring-emerald-500" placeholder="John Doe" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600">Phone</label>
            <input value={meta.phone} onChange={(e) => setMeta({ ...meta, phone: e.target.value })} className="mt-1 w-full rounded-lg border-slate-300 focus:border-emerald-500 focus:ring-emerald-500" placeholder="+91-9876543210" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600">MRN</label>
            <input value={meta.mrn} onChange={(e) => setMeta({ ...meta, mrn: e.target.value })} className="mt-1 w-full rounded-lg border-slate-300 focus:border-emerald-500 focus:ring-emerald-500" placeholder="HOS-0001" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600">Consulting Doctor</label>
            <input value={meta.doctor} onChange={(e) => setMeta({ ...meta, doctor: e.target.value })} className="mt-1 w-full rounded-lg border-slate-300 focus:border-emerald-500 focus:ring-emerald-500" placeholder="Dr. Smith" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600">Item/Service</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600">Qty</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600">Price</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600">Amount</th>
                <th className="px-3 py-2" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((row, idx) => (
                <tr key={idx}>
                  <td className="px-3 py-2">
                    <input value={row.name} onChange={(e) => updateRow(idx, 'name', e.target.value)} className="w-full rounded-lg border-slate-300 focus:border-emerald-500 focus:ring-emerald-500" placeholder="e.g., Paracetamol 650mg" />
                  </td>
                  <td className="px-3 py-2 w-28">
                    <input type="number" min="1" value={row.qty} onChange={(e) => updateRow(idx, 'qty', Number(e.target.value))} className="w-full rounded-lg border-slate-300 focus:border-emerald-500 focus:ring-emerald-500" />
                  </td>
                  <td className="px-3 py-2 w-36">
                    <input type="number" min="0" step="0.01" value={row.price} onChange={(e) => updateRow(idx, 'price', Number(e.target.value))} className="w-full rounded-lg border-slate-300 focus:border-emerald-500 focus:ring-emerald-500" />
                  </td>
                  <td className="px-3 py-2 text-sm font-medium text-slate-800">{currency((row.qty || 0) * (row.price || 0))}</td>
                  <td className="px-3 py-2 w-10">
                    <button type="button" onClick={() => removeRow(idx)} className="text-xs text-slate-500 hover:text-red-600">Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between items-center">
          <button type="button" onClick={addRow} className="inline-flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-sm font-medium ring-1 ring-slate-200 text-slate-700 hover:bg-slate-50">
            <Plus size={16} /> Add Item
          </button>
          <div className="text-right space-y-0.5">
            <p className="text-sm text-slate-600">Subtotal: <span className="font-semibold text-slate-800">{currency(subtotal)}</span></p>
            <p className="text-sm text-slate-600">Tax (12%): <span className="font-semibold text-slate-800">{currency(tax)}</span></p>
            <p className="text-base font-semibold text-slate-800">Total: {currency(total)}</p>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-sm text-red-600">{error}</div>
          <button type="submit" disabled={!canBill} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 text-white px-4 py-2 text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50">
            <Receipt size={16} /> Generate Bill
          </button>
        </div>
      </form>

      <div className="rounded-xl bg-white ring-1 ring-slate-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
          <h4 className="text-sm font-semibold text-slate-700">Recent Bills</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                {['Bill #','Patient','MRN','Doctor','Items','Total','Created'].map((h) => (
                  <th key={h} className="px-3 py-2 text-left text-xs font-semibold text-slate-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bills.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-3 py-6 text-center text-sm text-slate-500">No bills yet. Fill the form above to generate one or upload a CSV.</td>
                </tr>
              ) : (
                bills.map((b) => (
                  <tr key={b.bill_id || b._id} className="hover:bg-slate-50/50">
                    <td className="px-3 py-2 text-sm font-medium text-slate-800">{b.bill_id || b._id}</td>
                    <td className="px-3 py-2 text-sm text-slate-700">{b.patient_name}</td>
                    <td className="px-3 py-2 text-sm text-slate-700">{b.mrn}</td>
                    <td className="px-3 py-2 text-sm text-slate-700">{b.doctor}</td>
                    <td className="px-3 py-2 text-sm text-slate-700">{b.items?.length || 0}</td>
                    <td className="px-3 py-2 text-sm font-semibold text-slate-800">{currency(b.total)}</td>
                    <td className="px-3 py-2 text-xs text-slate-500">{b.createdAt ? new Date(b.createdAt).toLocaleString() : ''}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
