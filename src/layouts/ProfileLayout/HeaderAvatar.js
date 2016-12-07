/**
 * Imports
 */

import AvatarPickerModal from 'modals/AvatarPickerModal'
import {wrap, CSSContainer} from 'vdux-containers'
import {component, element} from 'vdux'
import Avatar from 'components/Avatar'
import * as colors from 'lib/colors'
import {Block, Flex} from 'vdux-ui'
import Color from 'color'

/**
 * <HeaderAvatar/>
 */

export default component({
  render ({props, actions}) {
    const {user, isMe} = props

    return (
      <AvatarPicker user={user}
        onClick={actions.openAvatarModal}
        hoverProps={{hover: isMe}}
        activeProps={{active: isMe}}
        pointer={isMe} />
    )
  },

  controller: {
    * openAvatarModal ({context, props}) {
      if (props.isMe) {
        yield context.openModal(() => <AvatarPickerModal user={props.user} />)
      }
    }
  }
})

/**
 * Avatar modal open
 */

const AvatarPicker = wrap(CSSContainer)({
  render ({props}) {
    const {blue} = colors
    const {user, hover, active, ...rest} = props
    const overlayBg = Color(blue).alpha(0.3).rgbaString()
    const overlayActive = Color(blue).alpha(0.4).rgbaString()
    const shadow = Color(blue).alpha(0.5).rgbaString()

    return (
      <Block w='15%' mr='m' relative {...rest}>
        <Block pb='100%' bgColor='grey_light' borderRadius='50%'>
          <Avatar actor={user} w='100%' h='auto' alignSelf='center' absolute />
          <Flex
            bg={active ? overlayActive : overlayBg}
            boxShadow={'0 0 1px 1px ' + shadow}
            transition='opacity .35s'
            opacity={hover ? 1 : 0}
            align='center center'
            circle='100%'
            color='white'
            absolute >
            Change Avatar
          </Flex>
        </Block>
      </Block>
    )
  }
})
