import { useAppStore } from './store/useAppStore'
import { useMediaQuery } from './hooks/useMediaQuery'
import Rail from './components/Rail'
import DesktopMain from './components/DesktopMain'
import MobileMain from './components/MobileMain'
import DetailPanel from './components/DetailPanel'
import ComicForm from './components/ComicForm'
import './App.css'

export default function App() {
  const isMobile = useMediaQuery('(max-width: 860px)')
  const selectedId = useAppStore((s) => s.selectedId)
  const adding = useAppStore((s) => s.adding)

  return (
    <div className="app">
      {isMobile ? (
        <MobileMain />
      ) : (
        <div className="app__desktop">
          <Rail />
          <DesktopMain />
        </div>
      )}
      {selectedId != null && <DetailPanel isMobile={isMobile} />}
      {adding && <ComicForm isMobile={isMobile} />}
    </div>
  )
}
