import BookmarkListItem from './BookmarkLIstItem'
import { Bookmark } from 'lib/bookmarkData'

interface Props {
  bookmarks: Bookmark[]
}

const BookmarkList = (props: Props) => {
  return (
    <div>
      {props.bookmarks.map((bookmark) => (
        <BookmarkListItem bookmark={bookmark} key={bookmark.id} />
      ))}
    </div>
  )
}

export default BookmarkList
