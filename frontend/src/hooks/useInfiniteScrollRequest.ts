import { type Dispatch, type SetStateAction, useCallback, useEffect, useRef, useState } from 'react'

import type { AxiosRequestConfig } from 'axios'

import { request } from '@utils/request'

interface InfiniteScrollOptions {
  immediate?: boolean
  onSuccess?: (data: any) => void
  onError?: (error: any) => void
  pageSize?: number
}

interface InfiniteScrollData<T> {
  count: number
  results: T[]
  currentPage: number
  hasNextPage: boolean
  totalPages: number
}

interface InfiniteScrollReturn<T> {
  data: InfiniteScrollData<T> | null
  setData: Dispatch<SetStateAction<InfiniteScrollData<T> | null>>
  loading: boolean
  loadingMore: boolean
  error: any
  loadMore: () => Promise<void>
  reset: () => void
  hasNextPage: boolean
}

function useInfiniteScrollRequest<T = any>(
  config?: AxiosRequestConfig,
  options: InfiniteScrollOptions = {}
): InfiniteScrollReturn<T> {
  const [data, setData] = useState<InfiniteScrollData<T> | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<any>(null)

  const configRef = useRef(config)
  const optionsRef = useRef(options)
  const currentPageRef = useRef(1)
  const hasNextPageRef = useRef(true)

  configRef.current = config
  optionsRef.current = options

  const pageSize = options.pageSize || 10

  const fetchPage = useCallback(
    async (page: number, isLoadMore = false): Promise<void> => {
      if (isLoadMore) {
        setLoadingMore(true)
      } else {
        setLoading(true)
      }

      setError(null)

      try {
        const mergedConfig = {
          ...configRef.current,
          params: {
            ...configRef.current?.params,
            page,
            page_size: pageSize
          }
        }

        const result = await request(mergedConfig)

        const responseData = result.results || result.data || result

        const paginationInfo = {
          count: result.count || responseData.length,
          currentPage: result.currentPage || page,
          hasNextPage: result.hasNext || false,
          totalPages: result.totalPages || Math.ceil((result.count || responseData.length) / pageSize)
        }

        if (isLoadMore && data) {
          // Append new results to existing data
          setData(prevData => ({
            ...paginationInfo,
            results: [...(prevData?.results || []), ...responseData]
          }))
        } else {
          // Initial load or reset
          setData({
            ...paginationInfo,
            results: responseData
          })
        }

        currentPageRef.current = page
        hasNextPageRef.current = paginationInfo.hasNextPage

        optionsRef.current.onSuccess?.(result)
      } catch (err) {
        setError(err)
        optionsRef.current.onError?.(err)
      } finally {
        setLoading(false)
        setLoadingMore(false)
      }
    },
    [data, pageSize]
  )

  const loadMore = useCallback(async (): Promise<void> => {
    if (!hasNextPageRef.current || loadingMore) {
      return
    }

    const nextPage = currentPageRef.current + 1

    await fetchPage(nextPage, true)
  }, [fetchPage, loadingMore])

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setLoading(false)
    setLoadingMore(false)
    currentPageRef.current = 1
    hasNextPageRef.current = true
  }, [])

  // Initial load
  useEffect(() => {
    const method = config?.method?.toLowerCase() || 'get'
    const shouldMutate = config && (options.immediate !== undefined ? options.immediate : method === 'get')

    if (shouldMutate) {
      reset()
      fetchPage(1, false)
    }
  }, [config?.url, config?.method, options.immediate]) // eslint-disable-line

  return {
    data,
    setData,
    loading,
    loadingMore,
    error,
    loadMore,
    reset,
    hasNextPage: hasNextPageRef.current
  }
}

export default useInfiniteScrollRequest
