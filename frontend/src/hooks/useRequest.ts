import { type Dispatch, type  SetStateAction, useCallback, useEffect, useRef, useState } from 'react'

import type { AxiosRequestConfig } from 'axios'

import { request } from '@utils/request'

interface RequestOptions {
  immediate?: boolean
  onSuccess?: (data: any) => void
  onError?: (error: any) => void
}

interface RequestReturn<T> {
  data: T | null
  setData: Dispatch<SetStateAction<T | null>>
  loading: boolean
  error: any
  mutate: (config?: AxiosRequestConfig) => Promise<T | null>
  reset: () => void
}

function useRequest<T = any>(config?: AxiosRequestConfig, options: RequestOptions = {}): RequestReturn<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<any>(null)

  const configRef = useRef(config)
  const optionsRef = useRef(options)

  configRef.current = config
  optionsRef.current = options

  const mutate = useCallback(
    async (requestConfig?: AxiosRequestConfig): Promise<T | null> => {
      setLoading(true)
      setError(null)

      try {
        const mergedConfig = { ...configRef.current, ...requestConfig }
        const result = await request(mergedConfig)

        setData(result)
        optionsRef.current.onSuccess?.(result)

        return result
      } catch (err) {
        setError(err)
        optionsRef.current.onError?.(err)

        return null
      } finally {
        setLoading(false)
      }
    },
    [] // Empty dependency array since we use refs
  )

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setLoading(false)
  }, [])

  useEffect(() => {
    const method = config?.method?.toLowerCase() || 'get'
    const shouldMutate = config && (method === 'get' || options.immediate)

    if (shouldMutate) {
      mutate()
    }
  }, [config?.url, config?.method, options.immediate]) // eslint-disable-line

  return {
    data,
    setData,
    loading,
    error,
    mutate,
    reset
  }
}

export default useRequest
