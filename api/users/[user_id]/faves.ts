import { Client } from 'api'

export const favorite =
  (client: Client) => async (user_id: string, manga_id: string) => {
    await fetch(`${client.baseUrl}/users/${user_id}/faves`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        manga_id,
      }),
    })
    return
  }

export const unfavorite =
  (client: Client) => async (user_id: string, manga_id: string) => {
    await fetch(`${client.baseUrl}/users/${user_id}/faves`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        manga_id,
      }),
    })
    return
  }
