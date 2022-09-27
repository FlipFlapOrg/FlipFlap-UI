import { Client } from 'api'
import { Manga, mangaSchema } from 'api/parser/manga'

export const getBookmarks = (client: Client) => async (user_id: string) => {
  const res = await fetch(`${client.baseUrl}/api/users/${user_id}/bookmarks`, {
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const data: Array<Manga> = await res.json()
  return data.map((d) => mangaSchema.parse(d))
}

export const addBookmarks =
  (client: Client) => async (user_id: string, manga_id: string) => {
    const res = await fetch(
      `${client.baseUrl}/api/users/${user_id}/bookmarks`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          manga_id,
        }),
      }
    )
    const data = await res.json()
    return data
  }

export const removeBookmarks =
  (client: Client) => async (user_id: string, manga_id: string) => {
    const res = await fetch(
      `${client.baseUrl}/api/users/${user_id}/bookmarks`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          manga_id,
        }),
      }
    )
    const data = await res.json()
    return data
  }
