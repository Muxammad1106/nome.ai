import type { AxiosRequestConfig } from 'axios'
import axios from 'axios'
import humps from 'humps'

import { auth } from './auth'
import { ORGANIZATION_KEY } from './organization'

export const BACKEND_API = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'

const baseAxios = axios.create({
  baseURL: `${BACKEND_API}/api/`,
  transformResponse: [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...(axios.defaults.transformResponse as any),
    humps.camelizeKeys
  ],
  transformRequest: [
    function (data, headers: AxiosRequestConfig['headers']) {
      if (data instanceof FormData) {
        return data
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return humps.decamelizeKeys(data, headers as any)
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...(axios.defaults.transformRequest as any)
  ]
})

baseAxios.interceptors.request.use(config => ({
  ...config,
  params: humps.decamelizeKeys(config.params)
}))

export default baseAxios

export async function request(options: AxiosRequestConfig, isPublic = true) {
  const params = { ...options.params, organizationKey: ORGANIZATION_KEY || '' }

  options = isPublic ? options : { ...options, ...auth(), params }
  const { data } = await baseAxios(options)

  return data
}
