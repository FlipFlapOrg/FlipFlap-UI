import useSWR from 'swr'
import { ulid } from 'ulid'

export interface UserData {
  id: string
}
export const useUserData = () => {
  const { data, error, mutate } = useSWR<UserData>(
    'local:userData',
    async (_) => {
      const id = localStorage.getItem('user_id')
      if (id) {
        return { id }
      }

      const newId = ulid()
      localStorage.setItem('user_id', newId)
      return { id: newId }
    }
  )

  return { data, error, mutate }
}
