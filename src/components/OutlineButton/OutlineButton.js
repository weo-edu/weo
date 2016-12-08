/**
 * Imports
 */

import WeoIcon from 'components/WeoIcon'
import {component, element} from 'vdux'
import {Button} from 'vdux-containers'
import {Icon} from 'vdux-ui'

/**
 * Constants
 */

const highlight = {highlight: 0.02}

/**
 * <OutlineButton/>
 */

export default component({
  render ({props, children}) {
    const { icon, weoIcon, color = 'text', bgColor, ...rest } = props
    const m = children.length ? 's' : 0

    return (
      <Button
        border={'1px solid ' + (bgColor ? 'rgba(0,0,0, .2)' : color)}
        color={bgColor ? 'white' : color}
        hoverProps={highlight}
        focusProps={highlight}
        bgColor={bgColor || 'white'}
        h='32px'
        px='8px'
        mr='s'
        {...rest}>
        { icon && <Icon name={icon} fs='s' mr={m} /> }
        { weoIcon && <WeoIcon name={weoIcon} fs='s' mr={m} /> }
        { children }
      </Button>
    )
  }
})
