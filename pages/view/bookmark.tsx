import { NextPage } from 'next'
import { useMemo } from 'react'
import { Manga } from 'api/parser/manga'
import BookmarkListItem from 'components/Bookmark/BookmarkLIstItem'
import { useBookmark } from 'lib/bookmarkData'

const BookMark: NextPage = () => {
  const { manga, isLoading } = useBookmark()

  const bookmarks = useMemo(() => {
    return manga?.data
  }, [manga])

  if (typeof bookmarks === 'undefined') return <div>Loading</div>

  const test: Manga = bookmarks![0]
  return (
    <>
      <BookmarkListItem manga={test} />
    </>
  )
}

export default BookMark
