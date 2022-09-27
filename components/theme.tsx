import { ThemeProvider as ThemeProviderBase } from '@emotion/react'
import { PropsWithChildren } from 'react'

export interface CustomTheme {
  background: {
    primary: string
    secondary: string
    tertiary: string
    button: string
  }
  ui: {
    fav_red: string
    bookmark_blue: string
    blue: string
    gray: string
  }
  text: {
    primary: string
  }
}

const theme: CustomTheme = {
  background: {
    primary: '#FFFFFF',
    secondary: '#E4E4F8',
    tertiary: '#D9E8F6',
    button: '#E9F3FC',
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
