import { css } from '@emotion/react'
import Image from 'next/image'
import FloatButton from './FloatButton'

interface FavoriteButtonProps {
  isFavorite: boolean
  count: number
  onClick: () => void
}

const FavoriteButton = ({
  isFavorite,
  count,
  onClick,
}: FavoriteButtonProps) => {
  return (
    <FloatButton size={60} onClick={onClick}>
      <Image
        src={isFavorite ? '/icons/heart-fill.svg' : '/icons/heart.svg'}
        width={40}
        height={40}
        alt=''
      />
      <p
        css={css`
          line-height: 1;
          margin-top: -2px;
          margin-bottom: 0px;
          font-size: 14px;
        `}
      >
        {count}
      </p>
    </FloatButton>
  )
}

export default FavoriteButton
