import { css } from '@emotion/react'
import { PropsWithCss } from 'lib/types'

interface ButtonProps {
  size: number
  children: React.ReactNode
  onClick?: () => void
}

const FloatButton: React.FC<PropsWithCss<ButtonProps>> = ({
  size,
  children,
  onClick,
}) => {
  return (
    <button
      css={(theme) => css`
        background-color: ${theme.background.button};
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border: none;
        &:active {
          transform: translateY(2px);
          box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
        }
      `}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default FloatButton
