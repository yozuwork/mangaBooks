import { useAppStore } from '../store/useAppStore'
import { ED, SHELF, STATUS } from '../lib/constants'
import { computeBar, cover, progText } from '../lib/helpers'
import type { Comic } from '../lib/types'
import './ComicCard.css'

export default function ComicCard({ comic, showShelf }: { comic: Comic; showShelf: boolean }) {
  const select = useAppStore((s) => s.select)
  const bar = computeBar(comic)
  const statusMeta = STATUS[comic.s]

  return (
    <div className="ccard" onClick={() => select(comic.id)}>
      <div className="ccard__cover" style={{ background: cover(comic.c) }}>
        <div className="ccard__badge">
          <span className="ccard__badge-dot" style={{ background: statusMeta.color }} />
          {statusMeta.label}
        </div>
        {comic.g === 'physical' && <div className="ccard__edition">{ED[comic.ed || 'tw']}</div>}
        <div className="ccard__title">{comic.title}</div>
        <div className="ccard__author">{comic.author}</div>
      </div>
      <div className="ccard__foot">
        {showShelf && <div className="ccard__shelf">{SHELF[comic.g]}</div>}
        <div className="ccard__track">
          <div className="ccard__bar" style={{ width: bar.width, background: bar.color }} />
        </div>
        <div className="ccard__progress">{progText(comic)}</div>
      </div>
    </div>
  )
}
