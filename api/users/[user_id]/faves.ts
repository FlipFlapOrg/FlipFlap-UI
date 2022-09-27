export const favorite = async (user_id: string, manga_id: string) => {
  const res = await fetch(`/api/users/${user_id}/faves`, {
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

export const unfavorite = async (user_id: string, manga_id: string) => {
  const res = await fetch(`/api/users/${user_id}/faves`, {
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
