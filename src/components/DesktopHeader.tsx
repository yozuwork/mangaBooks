import { useAppStore } from '../store/useAppStore'
import './DesktopHeader.css'

export default function DesktopHeader() {
  const openAdd = useAppStore((s) => s.openAdd)
  const searchText = useAppStore((s) => s.searchText)
  const setSearch = useAppStore((s) => s.setSearch)

  return (
    <header className="dheader">
      <div className="dheader__search">
        <span className="ms" style={{ fontSize: 20 }}>
          search
        </span>
        <input
          value={searchText}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="搜尋作品、作者或標籤…"
          className="dheader__search-input"
        />
      </div>
      <button className="dheader__add" onClick={() => openAdd()}>
        <span className="ms" style={{ fontSize: 20 }}>
          add
        </span>
        新增作品
      </button>
    </header>
  )
}
