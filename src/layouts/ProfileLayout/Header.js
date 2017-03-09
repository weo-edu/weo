/**
 * Imports
 */

import {UserColorPickerModal} from 'modals/ColorPickerModal'
import {Button, Tooltip, Text} from 'vdux-containers'
import DescriptionModal from 'modals/DescriptionModal'
import FollowButton from 'components/FollowButton'
import {Block, Icon, Card, Flex} from 'vdux-ui'
import HeaderAvatar from './HeaderAvatar'
import {component, element} from 'vdux'
import ProfileNav from './ProfileNav'
import * as colors from 'lib/colors'

/**
 * Profile Layout Header
 */

export default component({
  render ({context, props, actions}) {
    const {user, currentUser} = props
    const {
      displayName, username, website = '',
      aboutMe, gradeLevels = [], subjects = [],
      location, userType
    } = user
    const isMe = username === currentUser.username
    const displayUrl = website && website.replace(/.*?:\/\//g, '')
    const showNav = userType === 'teacher' && (!currentUser || currentUser.userType === 'teacher')

    return (
      <Card wide relative mb>
        <Flex p>
          <HeaderAvatar user={user} isMe={isMe} />
          <Flex column flex='60%'>
            <Flex p={4} fw='lighter' fs='m' align='start center'>
              <Text capitalize>{displayName}</Text>
              <Text px='s'>&middot;</Text>
              <Text fs='s' color='blue'>{username}</Text>
            </Flex>
            <Flex p={4} color='grey_medium' fs='xs' align='start center'>
              <ProfileItem message={displayUrl} icon='language' tag='a' href={website} pointer target='_blank' />
              <ProfileItem message={location} icon='place' />
              <ProfileItem message={gradeLevels.join(', ')} icon='school' />
              <ProfileItem message={subjects.join(', ')} icon='class' />
            </Flex>
            <Block color='text' ml='4' mt='m'>
              {
                aboutMe || (
                  <Text pointer hide={!isMe} color='grey_medium' hoverProps={{underline: true}} onClick={actions.openDescriptionModal}>
                      Add some information about yourself!
                  </Text>
                )
              }
            </Block>
          </Flex>
          <Flex hide={!isMe} absolute='top 12px right 12px'>
            <Button
              onClick={actions.openColorPicker}
              hoverProps={{text: <Icon fs='s' name='colorize' />}}
              align='center center'
              bgColor={user.color || colors.pickerColors[0]}
              circle='30'
              tag='div' />
            <Button uppercase ml='m' color='grey_medium' border='grey_medium' borderWidth='1px' bgColor='white' hoverProps={{highlight: 0.01}} focusProps={{highlight: 0.01}} onClick={context.setUrl('/account/profile')}>
              Edit Profile
            </Button>
          </Flex>
          <Flex hide={isMe} absolute='top 12px right 12px'>
            {
              currentUser.userType === 'teacher' &&
                user.userType === 'teacher' &&
                <FollowButton w={120} user={user} />
            }
          </Flex>
        </Flex>
        {
          showNav && <ProfileNav user={user} />
        }
      </Card>
    )
  },

  controller: {
    * openColorPicker ({context, props}) {
      yield context.openModal(() => <UserColorPickerModal user={props.user} selected={props.user.color} />)
    },

    * openDescriptionModal ({context, props}) {
      yield context.openModal(() => <DescriptionModal user={props.currentUser} />)
    }
  }
})

/**
 * <ProfileItem/>
 */

function ProfileItem ({props}) {
  const {icon, message, ...rest} = props

  return (
    <Tooltip mr align='start center' maxWidth='25%' message={message} hide={!message} tooltipProps={{whiteSpace: 'normal'}} placement='bottom' {...rest}>
      <Icon fs='inherit' name={icon} mr='s' />
      <Text ellipsis>{message}</Text>
    </Tooltip>
  )
}
