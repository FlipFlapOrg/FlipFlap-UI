import { css } from '@emotion/react'
import Image from 'next/image'
import { PropsWithCss } from 'lib/types'
import Link from 'next/link'

export interface ToggleProps {
  state: 'viewer' | 'bookmark'
}
export const Toggle: React.FC<PropsWithCss<ToggleProps>> = ({
  state,
  cssProp,
}) => {
  const primaryColor = state === 'viewer' ? '#3B8EDB' : '#F8BC24'
  const secondaryColor = state === 'viewer' ? '#F5CE42' : '#93CBFF'
  const primaryBgColor = state === 'viewer' ? '#80C2FF' : '#FBDA67'

  return (
    <div
      css={(theme) => css`
        background-color: ${theme.background.primary};
        border-radius: 9999px;
        border: 4px solid ${primaryColor};
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
        overflow: hidden;
        height: 54px;
        width: 106px;
        ${cssProp}
      `}
    >
      <div
        css={css`
          position: relative;
          height: 100%;
          width: 100%;
        `}
      >
        {state === 'viewer' ? (
          <>
            <div
              css={css`
                position: absolute;
                top: 0;
                left: 0;
                bottom: 0;
                margin: auto 2px auto;
                width: 42px;
                height: 42px;
                border-radius: 9999px;
                background-color: ${primaryColor};
                display: grid;
                place-items: center;
              `}
            >
              <Image
                src='/icons/book_black.svg'
                width={28}
                height={28}
                alt=''
              />
            </div>
            <div
              css={css`
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                margin: auto 2px auto;
                width: 42px;
                height: 42px;
                display: grid;
                place-items: center;
                cursor: pointer;
              `}
            >
              <Link href='/bookmark'>
                <Image
                  src='/icons/bookmark_yellow.svg'
                  width={28}
                  height={28}
                  alt=''
                />
              </Link>
            </div>
          </>
        ) : (
          <>
            <div
              css={css`
                position: absolute;
                top: 0;
                left: 0;
                bottom: 0;
                margin: auto 2px auto;
                width: 42px;
                height: 42px;
                display: grid;
                place-items: center;
                cursor: pointer;
              `}
            >
              <Link href='/viewer'>
                <Image
                  src='/icons/book_blue.svg'
                  width={28}
                  height={28}
                  alt=''
                />
              </Link>
            </div>
            <div
              css={css`
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                margin: auto 2px auto;
                width: 42px;
                height: 42px;
                border-radius: 9999px;
                background-color: ${primaryColor};
                display: grid;
                place-items: center;
              `}
            >
              <Image
                src='/icons/bookmark_black.svg'
                width={28}
                height={28}
                alt=''
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
