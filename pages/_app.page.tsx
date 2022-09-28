import { css, Global } from '@emotion/react'
import type { AppProps } from 'next/app'
import Head from 'next/head'
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
      <Head>
        <title>FlipFlap</title>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta
          name='description'
          content='携帯端末やパソコンからたくさんの漫画を読むことができます。さらさら読める、気づけば読んでる FlipFlap'
        />
        <meta property='og:url' content='https://flipflap.vercel.app' />
        <meta property='og:title' content='あなたの漫画を見つけよう FlipFlap' />
        <meta property='og:site_name' content='FlipFlap' />
        <meta
          property='og:image'
          content='https://flipflap.vercel.app/ogp.png'
        />
        <meta property='og:type' content='website' />
        <meta name='twitter:card' content='summary_large_image' />
        <link rel='icon' href='/favicon.ico' />
        <link rel='apple-touch-icon' href='/favicon/apple-touch-icon.png' />
        <link rel='manifest' href='/favicon/site.webmanifest' />
      </Head>
      <Global styles={resetATag} />
      <ThemeProvider>
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  )
}

export default MyApp
