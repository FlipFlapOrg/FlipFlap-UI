import { css, Global } from '@emotion/react'
import 'modern-normalize/modern-normalize.css'
import type { AppProps } from 'next/app'

const resetATag = css`
  a {
    color: inherit;
    text-decoration: none;
  }
`

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Global styles={resetATag} />
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
