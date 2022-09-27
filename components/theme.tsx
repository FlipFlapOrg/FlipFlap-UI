import { ThemeProvider as ThemeProviderBase } from '@emotion/react'
import { PropsWithChildren } from 'react'

const theme = {
  background: {
    primary: '#FFFFFF',
    secondary: '#E4E4F8',
    tertiary: '#D9E8F6',
  },
  ui: {
    fav_red: '#E84444',
    bookmark_blue: '#55ABFA',
    blue: '#3B8EDB',
    gray: '#C1C9D0',
  },
  text: {
    primary: '#000000',
  },
}

export const ThemeProvider: React.FC<PropsWithChildren<{}>> = ({
  children,
}) => {
  return <ThemeProviderBase theme={theme}>{children}</ThemeProviderBase>
}
