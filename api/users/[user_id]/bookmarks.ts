import { Client } from 'api'
import { bookmarksSchema } from 'api/parser/manga'

export const bookmarks = (client: Client) => async (user_id: string) => {
  return await fetch(`${client.baseUrl}/users/${user_id}/bookmarks`, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((data) => bookmarksSchema.parse(data))
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
