import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { NextPage } from 'next'
import Link from 'next/link'
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
    <Container>
      <Header>
        <Link href={'/'}>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='1em'
            height='1em'
            preserveAspectRatio='xMidYMid meet'
            viewBox='0 0 24 24'
            css={css`
              :hover {
                color: #3b8edb;
              }
            `}
          >
            <path
              fill='currentColor'
              d='M17.77 3.77L16 2L6 12l10 10l1.77-1.77L9.54 12z'
            />
          </svg>
        </Link>

        <H1>ブックマーク</H1>
      </Header>
      <BookmarkList bookmarks={bookmarks!} />
    </Container>
  )
}

const Container = styled.div``

const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: #e9f3fc;
`

const H1 = styled.h1`
  flex-grow: 1;
  font-size: 1.125rem;
  text-align: center;
`

export default BookMark
