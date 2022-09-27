import { css } from '@emotion/react'
import styled from '@emotion/styled'
import Image from 'next/image'

interface Props {
  shopName: string
  href: string
  icon: string
}

const ShopListItem = (props: Props) => {
  const { shopName, href, icon } = props
  return (
    <a href={href}>
      <Container>
        <Description>
          <ImageContainer>
            <Image
              src={icon}
              css={css`
                border-radius: 50%;
              `}
              width={48}
              height={48}
              alt='logo'
              objectFit='contain'
              quality={100}
            />
          </ImageContainer>

          <H2>{shopName}</H2>
        </Description>

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
      </Container>
    </a>
  )
}

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  :hover {
    background-color: #f7f8f9;
  }
`

const ImageContainer = styled.div`
  min-width: 48px;
  min-height: 48px;
  border-radius: 50%;
  padding: auto;
`

const H2 = styled.h2`
  font-size: 1.125rem;
  margin-left: 1rem;
`
const Description = styled.div`
  display: flex;
`

export default ShopListItem
