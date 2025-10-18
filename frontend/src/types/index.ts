export type Pagination<T> = {
  count: number
  results: T[]
}

export type PersonType = {
  id: string
  fullName: string
  image: string
  phoneNumber: string
  age: number
  gender: string
  emotion: string
  bodyType: string
  entryTime: string
  exitTime: string
  created_at: string
  updated_at: string
}


export type PersonEventType = {
  event: string
  person: PersonType
}
