export interface Client {
  readonly baseUrl: string
}
export const useClient = (): Client => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:8000'
  return {
    baseUrl,
  }
}
