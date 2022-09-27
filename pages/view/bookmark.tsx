import { NextPage } from 'next'
import { useMemo } from 'react'
import BookmarkList from 'components/Bookmark/BookmarkList'
import { useBookmarks } from 'lib/bookmarkData'

const BookMark: NextPage = () => {
  const { data, isLoading } = useBookmarks()

  const bookmarks = useMemo(() => {
    return data
  }, [data])

  if (isLoading) return <div>Loading</div>

  return (
    <>
      <BookmarkList bookmarks={bookmarks!} />
    </>
  )
}

export default BookMark
