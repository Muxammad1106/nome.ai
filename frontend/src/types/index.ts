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

export type PersonAISummaryType = {
  personId: string
  personName: string
  totalVisits: number
  favoriteTable: number | null
  favoriteDishes: {
    dish: string
    count: number
  }[]
  aiSummary: string
  lastVisit: string | null
  totalSpentItems: number
}

export type CartProductType = {
  id: string
  productId: string
  productName: string
  createdAt: string
  updatedAt: string
}

export type CartType = {
  id: string
  tableNumber: number
  cartProducts: CartProductType[]
  totalProducts: string
  createdAt: string
  updatedAt: string
}

export type PersonDetailType = {
  id: string
  organization: string
  fullName: string
  phoneNumber: string
  age: number
  gender: string
  emotion: string
  bodyType: string
  entryTime: string
  exitTime: string
  image: string
  carts: CartType[]
  totalCarts: string
  totalProductsInCarts: string
  createdAt: string
  updatedAt: string
}

export type ProductType = {
  id: string
  organization: string
  name: string
  createdAt: string
  updatedAt: string
}

export type CartCreateRequestType = {
  organizationKey: string
  person: string
  tableNumber: number
}

export type CartCreateResponseType = {
  id: string
  organization: string
  person: string
  tableNumber: number
  createdAt: string
  updatedAt: string
}

export type CartProductCreateRequestType = {
  organizationKey: string
  cart: string
  product: string
}

export type CartProductCreateResponseType = {
  id: string
  organization: string
  cart: string
  product: string
  createdAt: string
  updatedAt: string
}

export type BulkCartProductCreateRequestType = {
  cartProducts: CartProductCreateRequestType[]
}

export type BulkCartProductCreateResponseType = CartProductCreateResponseType[]

export type AgeStatisticsType = {
  totalPeople: number
  data: {
    type: string
    percentage: number
  }[]
}

export type BodyTypeStatisticsType = {
  totalPeople: number
  data: {
    type: string
    percentage: number
  }[]
}

export type EmotionStatisticsType = {
  totalPeople: number
  data: {
    type: string
    value: number
  }[]
}

export type GenderStatisticsType = {
  totalPeople: number
  data: {
    type: string
    percentage: number
  }[]
}

export type VisitCountStatisticsType = {
  type: string
  totalVisits: number
  data: {
    date: string
    value: number
  }[]
}
