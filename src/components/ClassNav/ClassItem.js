/**
 * Imports
 */

import {Text, Button, CSSContainer} from 'vdux-containers'
import {MenuItem} from 'vdux-ui'
import element from 'vdux/element'

function render ({props}) {
  const {showIcon, cls} = props

  return (
    <MenuItem py='m' px='0' capitalize color='text_color' display='flex' align='start center' {...props}>
      <Text inlineBlock circle mx='m' bg='green' color='white' lh='25px' sq='25' textAlign='center'>
        {cls.displayName[0]}
      </Text>
      <Text ellipsis capitalize inlineBlock flex>
        {cls.displayName}
      </Text>
      <Button icon='settings' fs='xs' color='midgray' px='m' h='25' hide={!showIcon} opacity={1} hoverProps={{opacity: 0.8}} activeProps={{opacity: 1}}/>
    </MenuItem>
  )
}

/**
 * Exports
 */

export default {
  render
}