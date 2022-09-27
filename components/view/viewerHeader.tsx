import styled from '@emotion/styled'
import BookmarkListIconButton from './bookMarkListIconButton'

interface Props {
  title: string
  authorName: string
}

const ViewerHeader = (props: Props) => {
  const { title, authorName } = props
  return (
    <Container>
      <MangaDetail>
        <Title>{title}</Title>
        <AuthorName>{authorName}</AuthorName>
      </MangaDetail>
      <BookmarkListIconButton />
    </Container>
  )
}

const Container = styled.div`
  display: flex;

  justify-content: space-between;
  align-items: center;

  padding: 2rem;
`

const Title = styled.h1`
  font-size: 1.125rem;
`

const AuthorName = styled.p`
  font-size: 0.75rem;
`

const MangaDetail = styled.div``

export default ViewerHeader
