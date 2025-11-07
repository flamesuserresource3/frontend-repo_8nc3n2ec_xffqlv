import Spline from '@splinetool/react-spline';

export default function HeroCover() {
  return (
    <section className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden rounded-2xl shadow-sm">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/2fSS9b44gtYBt4RI/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="relative z-10 flex items-center h-full">
        <div className="px-6 md:px-12 max-w-4xl relative">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#030712] via-[#030712]/70 to-transparent" />
          <div className="relative">
            <span className="inline-flex items-center rounded-full bg-emerald-500/10 text-emerald-300 px-3 py-1 text-xs font-medium ring-1 ring-inset ring-emerald-500/20">Healthcare • Inventory • Patients</span>
            <h1 className="mt-4 text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
              MediTrack — Smart Hospital Management
            </h1>
            <p className="mt-3 md:mt-4 text-sm md:text-base text-slate-300 max-w-2xl">
              Manage inventory, sales, and patient records with a modern, role‑aware dashboard. Designed with a professional blue/green aesthetic for clarity and speed.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#login" className="inline-flex items-center rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-600 transition">Get Started</a>
              <a href="#dashboard" className="inline-flex items-center rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/20 hover:bg-white/15 transition">View Dashboard</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
