import type { Comic } from '../lib/types'
import ComicCard from './ComicCard'
import './ComicGrid.css'

export default function ComicGrid({ cards, showShelf }: { cards: Comic[]; showShelf: boolean }) {
  if (cards.length === 0) {
    return <div className="cgrid__empty">目前沒有符合條件的作品。</div>
  }
  return (
    <div className="cgrid">
      {cards.map((c) => (
        <ComicCard key={c.id} comic={c} showShelf={showShelf} />
      ))}
    </div>
  )
}
