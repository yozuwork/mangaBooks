import { useAppStore } from '../store/useAppStore'
import { ED, ORDER, PALETTE, STATUS } from '../lib/constants'
import { cover, splitTags } from '../lib/helpers'
import TagEditor from './TagEditor'
import type { Edition, Group } from '../lib/types'
import './ComicForm.css'

const CAT_OPTIONS: { key: Group; label: string }[] = [
  { key: 'collection', label: '我的收藏' },
  { key: 'interested', label: '有興趣清單' },
  { key: 'physical', label: '實體書' },
]

export default function ComicForm({ isMobile }: { isMobile: boolean }) {
  const draft = useAppStore((s) => s.draft)
  const editingId = useAppStore((s) => s.editingId)
  const closeAdd = useAppStore((s) => s.closeAdd)
  const setDraft = useAppStore((s) => s.setDraft)
  const saveDraft = useAppStore((s) => s.saveDraft)

  const tagList = splitTags(draft.tags)
  const canSave = !!draft.title.trim()

  return (
    <div className="form__overlay" onClick={() => closeAdd()}>
      <div className={`form__panel${isMobile ? ' form__panel--sheet' : ' form__panel--drawer'}`} onClick={(e) => e.stopPropagation()}>
        <div className="form__body">
          <div className="form__head">
            <h2 className="form__heading">{editingId ? '編輯作品' : '新增作品'}</h2>
            <button className="form__closebtn" onClick={() => closeAdd()}>
              <span className="ms" style={{ fontSize: 20 }}>
                close
              </span>
            </button>
          </div>

          <div className="form__coverRow">
            <div className="form__coverPreview" style={{ background: cover(draft.c) }}>
              <span className="form__coverHint">封面色</span>
            </div>
            <div className="form__swatchWrap">
              <label className="form__label">封面顏色</label>
              <div className="form__swatches">
                {PALETTE.map((hex) => (
                  <div
                    key={hex}
                    className="form__swatch"
                    style={{ background: hex, outline: hex === draft.c ? '2.5px solid #26221d' : '2px solid transparent', outlineOffset: 2 }}
                    onClick={() => setDraft('c', hex)}
                  />
                ))}
              </div>
              {!isMobile && <div className="form__swatchNote">日後可換成上傳的封面圖</div>}
            </div>
          </div>

          <label className="form__label">作品標題 *</label>
          <input
            value={draft.title}
            onChange={(e) => setDraft('title', e.target.value)}
            placeholder="輸入標題…"
            className="form__input"
          />

          <label className="form__label">作者</label>
          <input
            value={draft.author}
            onChange={(e) => setDraft('author', e.target.value)}
            placeholder="輸入作者…"
            className="form__input"
          />

          <label className="form__label">作品網站連結</label>
          <input
            value={draft.link}
            onChange={(e) => setDraft('link', e.target.value)}
            placeholder="https:// …"
            className="form__input"
          />

          <label className="form__label">收藏分類</label>
          <div className="form__chiprow">
            {CAT_OPTIONS.map((ct) => (
              <button
                key={ct.key}
                className={`form__chip${draft.g === ct.key ? ' form__chip--dark' : ''}`}
                onClick={() => setDraft('g', ct.key)}
              >
                {ct.label}
              </button>
            ))}
          </div>

          {draft.g === 'physical' && (
            <>
              <label className="form__label">版本</label>
              <div className="form__chiprow">
                {(['tw', 'jp'] as Edition[]).map((key) => (
                  <button
                    key={key}
                    className={`form__chip${(draft.ed || 'tw') === key ? ' form__chip--dark' : ''}`}
                    onClick={() => setDraft('ed', key)}
                  >
                    {ED[key]}
                  </button>
                ))}
              </div>
            </>
          )}

          <label className="form__label">追蹤狀態</label>
          <div className="form__chiprow">
            {ORDER.map((k) => {
              const active = k === draft.s
              const meta = STATUS[k]
              return (
                <button
                  key={k}
                  className="form__chip"
                  style={
                    active
                      ? { background: meta.color, color: '#fff', border: `1.5px solid ${meta.color}` }
                      : { background: '#fff', color: 'var(--text-2)', border: '1.5px solid var(--border-2)' }
                  }
                  onClick={() => setDraft('s', k)}
                >
                  {!active && <span className="form__dot" style={{ background: meta.color }} />}
                  {meta.label}
                </button>
              )
            })}
          </div>

          <div className="form__numRow">
            <div className="form__numCol">
              <label className="form__label">目前進度（{draft.g === 'physical' ? '集' : '話'}）</label>
              <input
                value={draft.cur}
                onChange={(e) => setDraft('cur', e.target.value)}
                type="number"
                min={0}
                className="form__input"
              />
            </div>
            <div className="form__numCol">
              <label className="form__label">總{draft.g === 'physical' ? '集' : '話'}數（連載中留空）</label>
              <input
                value={draft.total}
                onChange={(e) => setDraft('total', e.target.value)}
                type="number"
                min={0}
                placeholder="—"
                className="form__input"
              />
            </div>
          </div>

          <label className="form__label">標籤</label>
          <div className="form__tagWrap">
            <TagEditor
              tags={tagList}
              onAdd={(text) => {
                const set = new Set(tagList)
                splitTags(text).forEach((t) => set.add(t))
                setDraft('tags', [...set].join(' '))
              }}
              onRemove={(i) => setDraft('tags', tagList.filter((_, j) => j !== i).join(' '))}
            />
          </div>

          <div className="form__actions">
            <button className="form__cancel" onClick={() => closeAdd()}>
              取消
            </button>
            <button
              className={`form__save${canSave ? '' : ' form__save--disabled'}`}
              disabled={!canSave}
              onClick={() => saveDraft()}
            >
              {editingId ? '儲存變更' : '加入書櫃'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
