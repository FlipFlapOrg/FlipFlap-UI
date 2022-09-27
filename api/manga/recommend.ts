import { mangaSchema } from 'api/parser/manga'

export const recommend = async (user_id: string) => {
  return await fetch('/api/manga/recommend', {
    headers: {
      'Content-Type': 'application/json',
      'User-ID': user_id,
    },
  })
    .then((res) => res.json())
    .then((data) => mangaSchema.parse(data))
}
