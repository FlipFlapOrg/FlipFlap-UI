import { useMemo } from 'react'

export interface Client {
  readonly baseUrl: string
}
export const useClient = (): Client => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:8000'
  const client = useMemo(() => {
    return {
      baseUrl,
    }
  }, [baseUrl])

  return client
}
