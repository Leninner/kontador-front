export interface Status {
  id: string
  name: string
  color: string
}

export interface Owner {
  id: string
  image: string
  name: string
}

export interface Group {
  id: string
  name: string
}

export interface Product {
  id: string
  name: string
}

export interface Initiative {
  id: string
  name: string
}

export interface Release {
  id: string
  name: string
}

export interface Feature {
  id: string
  name: string
  startAt: Date
  endAt: Date
  status: Status
  group: Group
  product: Product
  owner: Owner
  initiative: Initiative
  release: Release
}

export interface DragEndEvent {
  active: {
    id: string
  }
  over: {
    id: string
  } | null
}
