export interface Link {
  title: string
  logo: string
  url: string
  description: string
}

export interface List {
  term: string
  links: Link[]
}

export interface WebStack {
  taxonomy: string
  icon: string
  links: Link[]
}

export interface NestWebStack {
  taxonomy: string
  icon: string
  list: List[]
}

export type WebStacks = (WebStack | NestWebStack)[]
