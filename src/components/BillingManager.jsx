import { useMemo, useState } from 'react';
import { Receipt, Plus, Download } from 'lucide-react';

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
  const [meta, setMeta] = useState({ patient: '', mrn: '', doctor: '' });

  const subtotal = items.reduce((s, it) => s + (Number(it.qty || 0) * Number(it.price || 0)), 0);
  const tax = Math.round(subtotal * 0.12 * 100) / 100; // 12%
  const total = subtotal + tax;

  const addRow = () => setItems((prev) => [...prev, { name: '', qty: 1, price: 0 }]);
  const removeRow = (idx) => setItems((prev) => prev.filter((_, i) => i !== idx));
  const updateRow = (idx, key, val) => setItems((prev) => prev.map((r, i) => i === idx ? { ...r, [key]: val } : r));

  const submitBill = (e) => {
    e.preventDefault();
    if (!canBill) return;
    if (!meta.patient || !meta.mrn) return;
    const id = Date.now().toString(36);
    const cleanItems = items.filter((it) => it.name && Number(it.qty) > 0);
    const record = { id, ...meta, items: cleanItems, subtotal, tax, total, createdAt: new Date().toISOString() };
    setBills((prev) => [record, ...prev]);
    // reset form
    setMeta({ patient: '', mrn: '', doctor: '' });
    setItems([{ name: '', qty: 1, price: 0 }]);
  };

  const csv = useMemo(() => toCSV(bills.map(({ id, items, createdAt, ...rest }) => rest)), [bills]);

  const downloadCSV = () => {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bills.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section id="billing" className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center"><Receipt size={18} /></div>
          <h3 className="text-sm font-semibold text-slate-700">Medical Billing</h3>
        </div>
        <button onClick={downloadCSV} disabled={!bills.length} className="inline-flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-sm font-medium ring-1 ring-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-50">
          <Download size={16} /> Export CSV
        </button>
      </div>

      <form onSubmit={submitBill} className="rounded-xl bg-white p-4 ring-1 ring-slate-200 space-y-3">
        <div className="grid md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-600">Patient Name</label>
            <input value={meta.patient} onChange={(e) => setMeta({ ...meta, patient: e.target.value })} required className="mt-1 w-full rounded-lg border-slate-300 focus:border-emerald-500 focus:ring-emerald-500" placeholder="John Doe" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600">MRN</label>
            <input value={meta.mrn} onChange={(e) => setMeta({ ...meta, mrn: e.target.value })} required className="mt-1 w-full rounded-lg border-slate-300 focus:border-emerald-500 focus:ring-emerald-500" placeholder="HOS-0001" />
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
        <div className="flex justify-end">
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
                  <td colSpan={7} className="px-3 py-6 text-center text-sm text-slate-500">No bills yet. Fill the form above to generate one.</td>
                </tr>
              ) : (
                bills.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/50">
                    <td className="px-3 py-2 text-sm font-medium text-slate-800">{b.id}</td>
                    <td className="px-3 py-2 text-sm text-slate-700">{b.patient}</td>
                    <td className="px-3 py-2 text-sm text-slate-700">{b.mrn}</td>
                    <td className="px-3 py-2 text-sm text-slate-700">{b.doctor}</td>
                    <td className="px-3 py-2 text-sm text-slate-700">{b.items.length}</td>
                    <td className="px-3 py-2 text-sm font-semibold text-slate-800">{currency(b.total)}</td>
                    <td className="px-3 py-2 text-xs text-slate-500">{new Date(b.createdAt).toLocaleString()}</td>
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
