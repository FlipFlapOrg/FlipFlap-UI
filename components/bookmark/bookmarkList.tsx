import styled from '@emotion/styled'
import BookmarkListItem from './bookmarkListItem'
import { Bookmark } from 'lib/bookmarkData'

interface Props {
  bookmarks: Bookmark[]
}

const BookmarkList = (props: Props) => {
  return (
    <Container>
      {props.bookmarks.map((bookmark) => (
        <BookmarkListItem bookmark={bookmark} key={bookmark.id} />
      ))}
    </Container>
  )
}

const Container = styled.div`
  margin: 0 auto;
  width: 100%;
  max-width: 640px;
`

export default BookmarkList
