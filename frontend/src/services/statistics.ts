import useRequest from '@hooks/useRequest'

import {
  STATISTICS_AGE,
  STATISTICS_BODY_TYPE,
  STATISTICS_EMOTION,
  STATISTICS_GENDER,
  STATISTICS_VISIT_COUNT
} from '@/urls'

import type {
  AgeStatisticsType,
  BodyTypeStatisticsType,
  EmotionStatisticsType,
  GenderStatisticsType,
  VisitCountStatisticsType
} from '@/types'

export const useAgeStatistics = (enabled = true) => {
  return useRequest<AgeStatisticsType>({ url: STATISTICS_AGE }, { immediate: enabled })
}

export const useBodyTypeStatistics = (enabled = true) => {
  return useRequest<BodyTypeStatisticsType>({ url: STATISTICS_BODY_TYPE }, { immediate: enabled })
}

export const useEmotionStatistics = (enabled = true) => {
  return useRequest<EmotionStatisticsType>({ url: STATISTICS_EMOTION }, { immediate: enabled })
}

export const useGenderStatistics = (enabled = true) => {
  return useRequest<GenderStatisticsType>({ url: STATISTICS_GENDER }, { immediate: enabled })
}

export const useVisitCountStatistics = (enabled = true) => {
  return useRequest<VisitCountStatisticsType>(
    { url: STATISTICS_VISIT_COUNT, params: { type: 'day' } },
    { immediate: enabled }
  )
}
