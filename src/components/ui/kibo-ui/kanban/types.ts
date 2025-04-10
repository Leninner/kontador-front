export interface Status {
  id: string
  name: string
  color: string
}

export interface DragEndEvent {
  active: {
    id: string
  }
  over: {
    id: string
  } | null
}
