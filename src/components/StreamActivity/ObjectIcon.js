/**
 * Imports
 */

import WeoIcon from 'components/WeoIcon'
import {component, element} from 'vdux'
import {Icon, Block} from 'vdux-ui'

/**
 * <ObjectIcon/>
 */

export default component({
  render ({props}) {
    const {object, ...rest} = props
    const {displayName, status} = object
    const {color, icon, type} = map[displayName || status] || {}
    const iconProps = {
      circle: 24,
      fs: 14,
      bgColor: color,
      color: 'white',
      name: icon,
      align: 'center center',
      ...rest
    }

    switch (type) {
      case 'weo-icon':
        return <WeoIcon {...iconProps} />
      case 'text':
        return <Block {...iconProps}>{icon}</Block>
      case 'color':
        return <Block {...iconProps} bgColor={object.content} borderWidth={0} />
      default:
        return <Icon {...iconProps} />
    }
  }
})

/**
 * Icon map
 */

const map = {
  // Profile objects
  avatar: {
    color: 'blue_medium',
    icon: 'person'
  },
  displayName: {
    color: 'yellow',
    icon: 'i',
    type: 'text'
  },
  aboutMe: {
    color: 'red_light',
    icon: 'mode_edit'
  },

  color: {
    type: 'color'
  },

  // Statuses
  assigned: {
    color: 'green',
    icon: 'send'
  },
  pinned: {
    color: 'blue',
    type: 'weo-icon',
    icon: 'pin'
  },
  liked: {
    color: 'red',
    icon: 'favorite'
  },
  'turned in': {
    color: 'yellow',
    icon: 'file_download'
  },
  followed_user: {
    color: 'green_medium',
    icon: 'person_add'
  },
  followed_board: {
    color: 'blue_medium',
    icon: 'dashboard'
  },
  commented: {
    color: 'grey_medium',
    icon: 'comment'
  },
  annotated: {
    color: 'grey_medium',
    icon: 'comment'
  },
  joined_class: {
    color: 'green_light',
    icon: 'group_add'
  },
  returned: {
    color: 'green',
    icon: 'done'
  }
}
