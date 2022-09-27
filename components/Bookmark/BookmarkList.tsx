import styled from '@emotion/styled'
import BookmarkListItem from './BookmarkLIstItem'
import { Bookmark } from 'lib/bookmarkData'

interface Props {
  bookmarks: Bookmark[]
}

const BookmarkList = (props: Props) => {
  return (
    <Container>
      {props.bookmarks.map((bookmark, idx) => (
        <BookmarkListItem bookmark={bookmark} key={idx} />
      ))}
    </Container>
  )
}
const Container = styled.div`
  padding: 0.25rem;
`

export default BookmarkList
