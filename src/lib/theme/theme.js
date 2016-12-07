/**
 * Imports
 */

import * as colors from 'lib/colors'
import {defaultTheme} from 'vdux-ui'

/**
 * Theme
 */

const theme = {
  colors: {
    ...defaultTheme.colors,
    ...colors
  },
  scale: {
    z: 0,
    xs: 3,
    s: 6,
    m: 12,
    l: 24,
    xl: 32,
    xxl: 64,
    col_xs: 200,
    col_s: 360,
    col_m: 440,
    col_l: 520,
    col_xl: 714,
    col_main: 968
  },
  fontScale: {
    xxs: 11,
    xs: 13,
    s: 17,
    m: 22,
    l: 30,
    xl: 45,
    xxl: 120
  },
  shadow: {
    ...defaultTheme.shadow,
    inner: 'inset 0px 2px 2px 0px rgba(0,0,0,0.22)',
    menu: 'rgba(52, 52, 52, 0.3) 0px 0px 15px 0px, rgba(52, 52, 52, 0.09) 0px 0px 0px 1px',
    'z1': '0px 1px 2px rgba(0, 0, 0, 0.2)',
    'z2': '0 1px 4px 0 rgba(0, 0, 0, 0.25)',
    'z3': '0 1px 7px 0 rgba(0, 0, 0, 0.3)'
  },
  avatarScale: {
    s: 32,
    m: 75,
    l: 175
  },
  spinnerAnimation: {
    light: 'pulse .8s ease infinite',
    dark: 'pulse-blue .8s ease infinite'
  }
}

/**
 * Exports
 */

export default theme
