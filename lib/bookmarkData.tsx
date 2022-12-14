import { useMemo } from 'react'
import useSWR from 'swr'
import { useUserData } from './userData'
import { Client, useClient } from 'api'
import { bookmarks } from 'api/users/[user_id]/bookmarks'

export interface Bookmark {
  id: string
  title: string
  author: string
  cover_image_url: string
}

export const getBookmarks = async (
  client: Client,
  userId: string
): Promise<Bookmark[] | null> => {
  try {
    const data = await bookmarks(client)(userId)
    return data.map((d) => ({
      id: d.manga_id,
      title: d.title,
      author: d.author,
      cover_image_url: `${client.baseUrl}/manga/${d.manga_id}/image/0`,
    }))
  } catch (e) {
    console.error(e)
    return null
  }
}

export const useBookmarks = () => {
  const client = useClient()
  const { data: userData, error: userError } = useUserData()

  const user_id = useMemo(() => {
    return userData?.id ?? 'unknown'
  }, [userData?.id])

  const { data, error } = useSWR(['state:bookmarks', user_id], async (_) => {
    return getBookmarks(client, user_id)
  })

  return { data, isLoading: !error && !data && !userError }
}
