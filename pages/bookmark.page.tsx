import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { NextPage } from 'next'
import Link from 'next/link'
import { Toggle } from 'components/Toggle'
import BookmarkList from 'components/bookmark/bookmarkList'
import { useBookmarks } from 'lib/bookmarkData'

const BookMark: NextPage = () => {
  const { data: bookmarks, isLoading } = useBookmarks()

  if (isLoading) return <div>Loading</div>

  return (
    <Container>
      <Toggle
        state='bookmark'
        cssProp={css`
          position: fixed;
          z-index: 1;
          bottom: 16px;
          right: 0;
          left: 0;
          margin: 0 auto;
        `}
      />
      <Header>
        <HeaderContent>
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
        </HeaderContent>
      </Header>
      <BookmarkList bookmarks={bookmarks!} />
    </Container>
  )
}

const Container = styled.div``

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  width: 100%;
  max-width: 640px;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff7da;
`

const H1 = styled.h1`
  flex-grow: 1;
  font-size: 1.125rem;
  text-align: center;
`

export default BookMark
