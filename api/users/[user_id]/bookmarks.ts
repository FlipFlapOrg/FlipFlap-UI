export const getBookmarks = async (user_id: string) => {
  return await fetch(`/api/users/${user_id}/bookmarks`, {
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((res) => res.json())
}

export const addBookmarks = async (user_id: string, manga_id: string) => {
  const res = await fetch(`/api/users/${user_id}/bookmarks`, {
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

export const removeBookmarks = async (user_id: string, manga_id: string) => {
  const res = await fetch(`/api/users/${user_id}/bookmarks`, {
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
