import { Client } from 'api'
import { mangaSchema } from 'api/parser/manga'

export const getManga =
  (client: Client) => async (user_id: string, manga_id: string) => {
    return await fetch(`${client.baseUrl}/api/manga/${manga_id}`, {
      headers: {
        'Content-Type': 'application/json',
        'User-ID': user_id,
      },
    })
      .then((res) => res.json())
      .then((data) => mangaSchema.parse(data))
  }
