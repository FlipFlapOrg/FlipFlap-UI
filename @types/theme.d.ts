import '@emotion/react'
import { CustomTheme } from 'components/theme'

declare module '@emotion/react' {
  export interface Theme extends CustomTheme {}
}
