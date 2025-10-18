import useRequest from '../hooks/useRequest'

import {
  PERSON_DETAIL,
  PERSON_LIST,
  PERSON_AI_SUMMARY,
  PERSON_DETAIL_WITH_CARTS,
  CART_CREATE,
  CART_PRODUCTS_BULK,
  PRODUCT_LIST
} from '../urls'

import type {
  Pagination,
  PersonType,
  PersonAISummaryType,
  PersonDetailType,
  ProductType,
  CartCreateResponseType,
  BulkCartProductCreateResponseType
} from '../types'

export const usePersonActionList = () => {
  return useRequest<Pagination<PersonType>>({ url: PERSON_LIST, params: { page_size: 100 } })
}

export const usePersonUpdate = (id: string) => {
  return useRequest<PersonType>({ method: 'PUT', url: PERSON_DETAIL.replace('{id}', id) })
}

export const usePersonAISummary = (id: string, enabled = true) => {
  return useRequest<PersonAISummaryType>({ url: PERSON_AI_SUMMARY.replace('{id}', id) }, { immediate: enabled })
}

export const usePersonDetailWithCarts = (id: string, enabled = true) => {
  return useRequest<PersonDetailType>({ url: PERSON_DETAIL_WITH_CARTS.replace('{id}', id) }, { immediate: enabled })
}

export const useProductList = (enabled = true) => {
  return useRequest<Pagination<ProductType>>(
    {
      url: PRODUCT_LIST,
      params: { page_size: 100 }
    },
    { immediate: enabled }
  )
}

export const useCartCreate = () => {
  return useRequest<CartCreateResponseType>({ method: 'POST', url: CART_CREATE })
}

export const useBulkCartProductCreate = () => {
  return useRequest<BulkCartProductCreateResponseType>({ method: 'POST', url: CART_PRODUCTS_BULK })
}
