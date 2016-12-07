/**
 * Imports
 */

import {component, element} from 'vdux'
import {Icon} from 'vdux-ui'

/**
 * Floating arrow
 */

export default component({
  render ({context}) {
    return <Icon
      name='keyboard_arrow_down'
      pointer
      absolute
      left={0}
      right={0}
      bottom='20px'
      m='auto'
      sq='70px'
      fs='70px'
      lh='70px'
      color='rgba(255,255,255,0.9)'
      textShadow='0 1px 2px rgba(52,52,52,0.3)'
      animation='3.5s swing infinite'
      transition='all 0.35s'
      onClick={context.scrollTo('#info', {easing: 'easeOutCubic', duration: 500})} />
  }
})
