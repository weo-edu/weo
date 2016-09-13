/**
 * Imports
 */

import css from 'jss-simple'
import {Icon} from 'vdux-ui'
import element from 'vdux/element'
import {scrollTo} from 'middleware/scroll'

/**
 * Floating arrow
 */

function render () {
  return <Icon
    name='keyboard_arrow_down'
    class={arrow}
    onClick={e => scrollTo('#info', {easing: 'easeOutCubic', duration: 500})} />
}

/**
 * Styles
 */

// const {arrow} = css({
//   arrow: {
//     test: function () {},
//     cursor: 'pointer',
//     position: 'absolute',
//     left: '0',
//     right: '0',
//     bottom: '20px',
//     margin: 'auto',
//     width: '70px',
//     height: '70px',
//     fontSize: '70px',
//     lineHeight: '70px',
//     color: 'rgba(255,255,255,0.9)',
//     textShadow: '0 1px 2px rgba(52,52,52,0.3)',
//     transition: 'all 0.35s',
//     animation: '3.5s swing infinite'
//   },
//   '@keyframes swing': {
//     '0%': {transform: 'translateY(0)'},
//     '40%': {transform: 'translateY(25px)'},
//     '60%': {transform: 'translateY(25px)'},
//     '100%': {transform: 'translateY(0)'}
//   }
// })

/**
 * Exports
 */

export default render
