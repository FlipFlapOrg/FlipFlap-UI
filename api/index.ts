export interface Client {
  readonly baseUrl: string
}
export const useClient = (): Client => {
  const baseUrl = process.env.BASE_URL ?? 'http://localhost:8000'

  return {
    baseUrl,
  }
}
