export type Group = 'collection' | 'interested' | 'physical'
export type StatusKey = 'reading' | 'waiting' | 'done' | 'paused' | 'dropped' | 'none'
export type Edition = 'tw' | 'jp'
export type TabKey = Group | 'category'

export interface Comic {
  id: number
  g: Group
  title: string
  author: string
  s: StatusKey
  cur: number
  total: number | null
  c: string
  ed?: Edition
  tags: string[]
  link: string
  note?: string
}

export interface Draft {
  title: string
  author: string
  link: string
  s: StatusKey
  cur: number | string
  total: number | string
  g: Group
  ed: Edition
  tags: string
  c: string
}
