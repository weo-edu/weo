/**
 * Imports
 */

import element from 'vdux/element'
import {Icon} from 'vdux-ui'
// import css from 'jss-simple'

const cloudFS = require('cloud-fs')
const woff = cloudFS.url('./weo-icons.woff')
const ttf = cloudFS.url('./weo-icons.ttf')
const svg = cloudFS.url('./weo-icons.svg')
const eot = cloudFS.url('./weo-icons.eot')

/**
 * WeoIcon
 */

function render ({props}) {
  return <Icon iconClass={weoIcon} {...props} />
}

/**
 * Style
 */

const weoIcon = 'weo-icon'

// css({
//   '@font-face': {
//     fontFamily: "'weo-icons'",
//     fontWeight: 'normal',
//     fontStyle: 'normal',
//     src: [
//       `url('${eot}')`,
//       `url('${eot}?#iefix') format('embedded-opentype')`,
//       `url('${woff}') format('woff')`,
//       `url('${ttf}') format('truetype')`,
//       `url('${svg}') format('svg')`,
//     ].join(',')
//   }
// }, {named: false})

// const {weoIcon} = css({
//   weoIcon: {
//     fontFamily: 'weo-icons',
//     lineHeight: 1,
//     letterSpacing: 'normal',
//     textTransform: 'none',
//     display: 'inline-block',
//     whiteSpace: 'nowrap',
//     wordWrap: 'normal',
//     direction: 'ltr',
//     verticalAlign: 'middle',
//     fontFeatureSettings: "'liga'",
//     '-webkit-font-feature-settings': "'liga'",
//     '-webkit-font-smoothing': 'antialiased'
//   }
// })

/**
 * Exports
 */

export default {
  render
}
