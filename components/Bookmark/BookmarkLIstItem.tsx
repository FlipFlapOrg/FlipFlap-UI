import styled from '@emotion/styled'
import Image from 'next/image'
import { Manga } from 'api/parser/manga'

interface Props {
  manga: Manga
}

const BookmarkListItem = (props: Props) => {
  return (
    <Container>
      {/* <Image
        src={props.manga.manga_url}
        alt={props.manga.title}
        layout='fill'
        objectFit='contain'
      /> */}
      <div>{props.manga.author}</div>
      <div>aaaaaaa</div>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
`

export default BookmarkListItem
