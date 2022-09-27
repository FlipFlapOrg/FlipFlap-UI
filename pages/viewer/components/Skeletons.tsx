import { css, keyframes } from '@emotion/react'
import { PropsWithCss } from 'lib/types'

export const skeltonKeyframes = keyframes`
  from {
    transform: translateX(-100%) skew(-15deg);
  }
  to {
    transform: translateX(100%) skew(-15deg);
  }
`

export const skelton = css`
  background: #d9d9d9;
  position: relative;
  overflow: hidden;
  &::before {
    content: '';
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
    animation: ${skeltonKeyframes} 1.2s linear infinite;
  }
`

export interface SkeltonCircleProps {
  size: number | string
}
export const SkeltonCircle: React.FC<PropsWithCss<SkeltonCircleProps>> = ({
  size,
  cssProp,
}) => {
  const sizeStyle = typeof size === 'number' ? `${size}px` : size

  return (
    <div
      css={css`
        width: ${sizeStyle};
        height: ${sizeStyle};
        border-radius: 50%;
        ${skelton}
        ${cssProp}
      `}
    />
  )
}

export interface SkeltonRectProps {
  width: number | string
  height: number | string
}
export const SkeltonRect: React.FC<PropsWithCss<SkeltonRectProps>> = ({
  width,
  height,
  cssProp,
}) => {
  const widthStyle = typeof width === 'number' ? `${width}px` : width
  const heightStyle = typeof height === 'number' ? `${height}px` : height

  return (
    <div
      css={css`
        width: ${widthStyle};
        height: ${heightStyle};
        ${skelton}
        ${cssProp}
      `}
    />
  )
}
