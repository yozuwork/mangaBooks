import { useState } from 'react'
import './TagEditor.css'

export default function TagEditor({
  tags,
  onAdd,
  onRemove,
  placeholder = '＋ 新增標籤，按 Enter',
}: {
  tags: string[]
  onAdd: (text: string) => void
  onRemove: (index: number) => void
  placeholder?: string
}) {
  const [value, setValue] = useState('')

  return (
    <div className="tagedit">
      {tags.map((t, i) => (
        <span key={`${t}-${i}`} className="tagedit__chip">
          ＃{t}
          <button className="tagedit__remove" onClick={() => onRemove(i)}>
            <span className="ms" style={{ fontSize: 15 }}>
              close
            </span>
          </button>
        </span>
      ))}
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ',' || e.key === '、') {
            e.preventDefault()
            if (value.trim()) {
              onAdd(value)
              setValue('')
            }
          }
        }}
        placeholder={placeholder}
        className="tagedit__input"
      />
    </div>
  )
}
