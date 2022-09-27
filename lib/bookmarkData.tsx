import useSWR from 'swr'
import { getBookmarks } from 'api/users/[user_id]/bookmarks'

export const useBookmark = () => {
  const { data, error } = useSWR('state:bookmark', getBookmarks)

  return {
    bookmarks: data,
    isLoading: !error && !data,
  }
}
