import { useAppStore } from '../store/useAppStore'
import type { CategoryTile } from '../hooks/useLibraryView'
import './CategoryTiles.css'

export default function CategoryTiles({ tiles }: { tiles: CategoryTile[] }) {
  const setCategory = useAppStore((s) => s.setCategory)

  if (tiles.length === 0) {
    return <div className="cgrid__empty">還沒有任何分類，先在作品上新增標籤，或按「新增分類」建立一個空分類。</div>
  }

  return (
    <div className="ctiles">
      {tiles.map((cat) => (
        <div key={cat.tag} className="ctile" onClick={() => setCategory(cat.tag)}>
          <div className="ctile__covers">
            {cat.covers.length > 0 ? (
              cat.covers.map((cv, i) => <div key={i} className="ctile__cover" style={{ background: cv }} />)
            ) : (
              <div className="ctile__cover ctile__cover--empty" />
            )}
          </div>
          <div className="ctile__meta">
            <div className="ctile__tag">＃{cat.tag}</div>
            <div className="ctile__count">{cat.count} 部</div>
          </div>
        </div>
      ))}
    </div>
  )
}
