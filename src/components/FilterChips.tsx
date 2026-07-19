import { useAppStore } from '../store/useAppStore'
import type { FilterChip } from '../hooks/useLibraryView'
import './FilterChips.css'

export default function FilterChips({ filters }: { filters: FilterChip[] }) {
  const setFilter = useAppStore((s) => s.setFilter)

  return (
    <div className="chips">
      {filters.map((f) => (
        <button
          key={f.key}
          className={`chips__item${f.active ? ' chips__item--active' : ''}`}
          onClick={() => setFilter(f.key)}
        >
          {f.color && <span className="chips__dot" style={{ background: f.color }} />}
          {f.label}
          <span className="chips__count">{f.count}</span>
        </button>
      ))}
    </div>
  )
}
