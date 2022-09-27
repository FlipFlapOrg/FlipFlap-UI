import useSWR from 'swr'

export interface Bookmark {
  id: string
  manga_url: string
  description: {
    title: string
    author: string
    links: string[]
    cover_image_url: string
  }
}

export const useBookmark = () => {
  const { data, error } = useSWR('state:bookmarks', {})
}
