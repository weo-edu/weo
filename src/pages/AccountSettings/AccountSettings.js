/**
 * Imports
 */

import ReadingSpeedDropdown from 'components/ReadingSpeedDropdown'
import PointValueModal from 'modals/PointValueModal'
import PasswordModal from 'modals/PasswordModal'
import UsernameModal from 'modals/UsernameModal'
import SettingsRow from 'components/SettingsRow'
import EmailModal from 'modals/EmailModal'
import NameModal from 'modals/NameModal'
import {component, element} from 'vdux'
import {Block, Card} from 'vdux-ui'

/**
 * <AccountSettings/>
 */

export default component({
  render ({props}) {
    const {currentUser} = props
    const {displayName, email, username, preferences = {}, userType} = currentUser
    const isStudent = userType === 'student'
    const {max_points = 10} = preferences

    return (
      <Card>
        <Block fs='m' color='blue' pt='l' pb px>
          User Settings
        </Block>

        <SettingsRow name='Name' placeholder={'What\'s your name?'} Modal={<NameModal user={currentUser} />} prop={displayName} hide={isStudent} />
        <SettingsRow name='Username' placeholder='Get a username?' Modal={<UsernameModal user={currentUser} />} prop={username} hide={isStudent} />
        <SettingsRow name='Email' placeholder={'What\'s your email?'} Modal={<EmailModal user={currentUser} />} prop={email} />
        <SettingsRow name='Password' Modal={<PasswordModal isMe user={currentUser} />} prop='*******' />

        <Block fs='m' color='blue' pt='l' pb px>
          Activity Settings
        </Block>

        <SettingsRow name='Reading Speed' clickable={false} color='text'>
          <ReadingSpeedDropdown user={currentUser} />
        </SettingsRow>

        <SettingsRow name='Point Value' placeholder='What is your name?' Modal={<PointValueModal user={currentUser} />} prop={max_points} message='The default point value given to each question in an activity' borderBottomWidth='0' hide={isStudent} />
      </Card>
    )
  }
})
