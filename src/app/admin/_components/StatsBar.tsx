type Stat = {
  label: string
  value: string | number
  color: string
}

export default function StatsBar({ stats }: { stats: Stat[] }) {
  return (
    <div className="px-8 pb-5 grid grid-cols-4 gap-4">
      {stats.map(s => (
        <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-soft">
          <p className={`text-2xl font-bold mb-1 ${s.color.split(' ')[0]}`}>{s.value}</p>
          <p className="text-xs text-gray-400">{s.label}</p>
        </div>
      ))}
    </div>
  )
}
