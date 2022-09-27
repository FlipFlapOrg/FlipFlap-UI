import BookmarkListItem from './BookmarkLIstItem'
import { Bookmark } from 'lib/bookmarkData'

interface Props {
  bookmarks: Bookmark[]
}

const BookmarkList = (props: Props) => {
  return (
    <div>
      {props.bookmarks.map((bookmark, idx) => (
        <BookmarkListItem bookmark={bookmark} key={idx} />
      ))}
    </div>
  )
}

export default BookmarkList
