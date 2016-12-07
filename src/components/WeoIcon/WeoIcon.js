/**
 * Imports
 */

import {component, element} from 'vdux'
import {Icon} from 'vdux-ui'

/**
 * WeoIcon
 */

export default component({
  render ({props}) {
    return <Icon
      fontFeatureSettings="'liga'"
      fontSmoothing='antialiased'
      letterSpacing='normal'
      fontFamily='weo-icons'
      display='inline-block'
      verticalAlign='middle'
      textTransform='none'
      whiteSpace='nowrap'
      wordWrap='normal'
      direction='ltr'
      fw='normal'
      lh={1}
      {...props} />
  }
})
