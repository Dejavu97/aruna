/** Stat — kartu statistik kecil (diekstrak verbatim dari Manage.jsx). */
export default function Stat({ label, value }) {
  return (
    <div className="border border-ink/10 bg-paper px-3 py-4 text-center">
      <p className="font-display text-3xl">{value}</p>
      <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-stone">{label}</p>
    </div>
  )
}
