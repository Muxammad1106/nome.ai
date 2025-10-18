import useRequest from '@hooks/useRequest'
import { PERSON_DETAIL, PERSON_LIST } from '@/urls'
import type { Pagination, PersonType } from '@/types'

export const usePersonActionList = () => {
  return useRequest<Pagination<PersonType>>({ url: PERSON_LIST })
}

export const usePersonUpdate = (id: string) => {
  return useRequest<PersonType>({ method: 'PUT', url: PERSON_DETAIL.replace('{id}', id) })
}
