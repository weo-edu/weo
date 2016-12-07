/**
 * Imports
 */

import {Dropdown, MenuItem, Divider, Icon, Flex, Text, Block} from 'vdux-containers'
import WeoIcon from 'components/WeoIcon'
import {component, element} from 'vdux'
import Avatar from 'components/Avatar'
import Link from 'components/Link'

/**
 * Constants
 */

const iconProps = {lh: '23px', fs: 's', mr: 's'}
const itemProps = {
   ui: MenuItem,
  currentProps: {highlight: true},
  align: 'start center'
}

/**
 * <AccountMenu/>
 */

export default component({
  render ({props, context}) {
    const {currentUser} = props
    const {username, userType} = currentUser
    const isStudent = userType === 'student'

    return (
      <Dropdown w='180px' mr='s' btn={<DropdownToggle {...props} />}>
        <Link {...itemProps} href={`/${username}/${isStudent ? 'stream' : 'boards/all'}`}>
          <Icon name='person' {...iconProps} />
          My Profile
        </Link>
        <Link {...itemProps} href={`/${username}/boards/drafts`} hide={isStudent}>
          <WeoIcon name='draft' {...iconProps} />
          My Drafts
          <Text color='grey_medium' ml='s'>{currentUser.drafts.canonicalTotal.items}</Text>
        </Link>
        <Divider />
        <Link {...itemProps} href='/connect' hide={isStudent}>
          <Icon name='people' {...iconProps} />
          Connect
        </Link>
        <Link {...itemProps} href='/notifications' hide={isStudent}>
          <Icon name='notifications' {...iconProps} />
          Notifications
        </Link>
        <Divider hide={isStudent} />
        <Link {...itemProps} href='/account/settings'>
          <Icon name='settings' {...iconProps} />
          Settings
        </Link>
        <Block {...itemProps} tag='a' href='http://about.weo.io/help' target='_blank' hide={isStudent}>
          <Icon name='help' {...iconProps} />
          Help Center
          <Icon name='open_in_new' fs='11' ml='s' />
        </Block>
        <MenuItem onClick={context.logoutUser} align='start center'>
          <Icon name='exit_to_app' {...iconProps} />
          Log Out
        </MenuItem>
      </Dropdown>
    )
  }
})

/**
 * <DropdownToggle/>
 */

function DropdownToggle ({props}) {
  const {currentUser, ...rest} = props
  const {userType, displayName} = currentUser

  return (
    <Flex {...rest} align='center center'>
      <Avatar actor={currentUser} />
      <Flex align='start center' ml hide={userType === 'teacher'}>
        <Block maxWidth={125} ellipsis>
          {displayName}
        </Block>
      </Flex>
      <Icon name='arrow_drop_down' fs='s' mr />
    </Flex>
  )
}
