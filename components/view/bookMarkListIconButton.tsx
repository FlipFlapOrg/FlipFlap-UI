import { css } from '@emotion/react'
import styled from '@emotion/styled'
import Image from 'next/image'
import Link from 'next/link'

const BookmarkListIconButton = () => {
  return (
    <Link href='/view/bookmark'>
      <Container>
        <Image
          src='/flipflap.png'
          css={css`
            border-radius: 50%;
          `}
          width={48}
          height={48}
          alt='logo'
          objectFit='contain'
          quality={100}
        />
      </Container>
    </Link>
  )
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  min-width: 48px;
  min-height: 48px;
  padding: auto;

  border-radius: 50%;
  cursor: pointer;

  box-shadow: 2px 2px 4px #1d2023;
`

export default BookmarkListIconButton
