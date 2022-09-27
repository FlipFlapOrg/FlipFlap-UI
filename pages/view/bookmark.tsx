import { NextPage } from 'next'
import { useMemo } from 'react'
import BookmarkListItem from 'components/Bookmark/BookmarkLIstItem'
import { Bookmark, useBookmarks } from 'lib/bookmarkData'

const BookMark: NextPage = () => {
  const { data, isLoading } = useBookmarks()

  const bookmarks = useMemo(() => {
    return data
  }, [data])

  if (isLoading) return <div>Loading</div>

  const test: Bookmark = bookmarks![0]
  return (
    <>
      <BookmarkListItem bookmark={test} />
    </>
  )
}

export default BookMark
