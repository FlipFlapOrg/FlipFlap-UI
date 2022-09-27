import { Client } from 'api'

export const favorite =
  (client: Client) => async (user_id: string, manga_id: string) => {
    const res = await fetch(`${client.baseUrl}/users/${user_id}/faves`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        manga_id,
      }),
    })
    const data = await res.json()
    return data
  }

export const unfavorite =
  (client: Client) => async (user_id: string, manga_id: string) => {
    const res = await fetch(`${client.baseUrl}/users/${user_id}/faves`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        manga_id,
      }),
    })
    const data = await res.json()
    return data
  }
