import { css, Global } from '@emotion/react'
import type { AppProps } from 'next/app'
import { ThemeProvider } from 'components/theme'
import 'modern-normalize/modern-normalize.css'
import 'styles/globals.css'
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
      <ThemeProvider>
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  )
}

export default MyApp
