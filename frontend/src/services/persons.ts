import useRequest from '@hooks/useRequest'
import { PERSON_DETAIL, PERSON_LIST, PERSON_AI_SUMMARY, PERSON_DETAIL_WITH_CARTS } from '@/urls'
import type { Pagination, PersonType, PersonAISummaryType, PersonDetailType } from '@/types'

export const usePersonActionList = () => {
  return useRequest<Pagination<PersonType>>({ url: PERSON_LIST })
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
