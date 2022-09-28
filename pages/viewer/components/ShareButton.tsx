import { css } from '@emotion/react'
import Image from 'next/image'

interface ShareButtonProps {
  url?: string
}

const ShareButton = ({ url }: ShareButtonProps) => {
  return (
    <a
      href={url}
      target='_blank'
      rel='noreferrer'
      css={(theme) => css`
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background-color: ${theme.background.button};
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
        display: flex;
        justify-content: center;
        align-items: center;
        border: none;
        &:active {
          transform: translateY(2px);
          box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
        }
      `}
    >
      <Image src={'/icons/share.svg'} width={40} height={40} alt='' />
    </a>
  )
}

export default ShareButton
