import { css } from '@emotion/react'
import styled from '@emotion/styled'
import Image from 'next/image'
import Link from 'next/link'
import { Bookmark } from 'lib/bookmarkData'

interface Props {
  bookmark: Bookmark
}

const BookmarkListItem = (props: Props) => {
  const bookmark = props.bookmark
  return (
    <Link href={`/viewer?id=${bookmark.id}`}>
      <Container>
        <ImageContainer>
          <Image
            src={bookmark.cover_image_url}
            width={68}
            height={98}
            objectFit='contain'
            alt={bookmark.title}
          />
        </ImageContainer>
        <Description>
          <div>
            <Title>{bookmark.title}</Title>
            <Caption>{bookmark.author}</Caption>
          </div>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='1em'
            height='1em'
            preserveAspectRatio='xMidYMid meet'
            viewBox='0 0 24 24'
            css={css`
              color: #3b8edb;
              width: 48px;
              height: 48px;
            `}
          >
            <path
              fill='currentColor'
              d='M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10s10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8s8 3.589 8 8s-3.589 8-8 8z'
            />
            <path fill='currentColor' d='m9 17l8-5l-8-5z' />
          </svg>
        </Description>
      </Container>
    </Link>
  )
}

const Container = styled.div`
  display: flex;
  align-items: stretch;
  padding: 0 0.25rem;
  cursor: pointer;
  :hover {
    background-color: #f7f8f9;
  }
`

const Title = styled.h2`
  font-size: 1.125rem;
`

const Caption = styled.p`
  font-size: 0.75rem;
`

const Description = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-grow: 1;
  border-bottom: 1px solid #d7d7e3;
  padding: 0 0.25rem;
  margin: 0 0.25rem;
`

const ImageContainer = styled.div`
  margin: 0.125rem 0;
`

export default BookmarkListItem
