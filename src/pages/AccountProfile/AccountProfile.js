/**
 * Imports
 */

import SubjectPickerModal from 'modals/SubjectPickerModal'
import AvatarPickerModal from 'modals/AvatarPickerModal'
import ColorPickerModal from 'modals/ColorPickerModal'
import GradePickerModal from 'modals/GradePickerModal'
import DescriptionModal from 'modals/DescriptionModal'
import LocationModal from 'modals/LocationModal'
import SettingsRow from 'components/SettingsRow'
import WebsiteModal from 'modals/WebsiteModal'
import {pickerColors} from 'lib/colors'
import {component, element} from 'vdux'
import Avatar from 'components/Avatar'
import {Block, Card} from 'vdux-ui'

/**
 * <AccountProfile/>
 */

export default component({
  render ({props}) {
    const {currentUser} = props
    const {
      color, gradeLevels = [], subjects = [],
      website, location, aboutMe, userType
    } = currentUser
    const isStudent = userType === 'student'

    return (
      <Card>
        <Block fs='m' color='blue' pt='l' pb px>
          Profile Details
        </Block>

        <SettingsRow name='Avatar' Modal={<AvatarPickerModal user={currentUser} />}>
          <Avatar sq='40px' actor={currentUser} display='block' />
        </SettingsRow>

        <SettingsRow name='Color' Modal={<ColorPickerModal user={currentUser} />} message='The color that appears in the top bar of your profile.'>
          <Block circle='40px' bgColor={color || pickerColors[0]} />
        </SettingsRow>

        <Block hide={isStudent}>
          <SettingsRow name='Grades' placeholder='Where grades do you teach?' Modal={<GradePickerModal user={currentUser} />} prop={gradeLevels} />
          <SettingsRow name='Subjects' placeholder='What subjects do you teach?' Modal={<SubjectPickerModal user={currentUser} />} prop={subjects} />
          <SettingsRow name='Website' placeholder='http://…' Modal={<WebsiteModal user={currentUser} />} prop={website && website.replace(/.*?:\/\//g, '')} />
          <SettingsRow name='Location' placeholder='Where are you located?' Modal={<LocationModal user={currentUser} />} prop={location} />
        </Block>

        <SettingsRow name='Description' placeholder='Share a few words about yourself!' Modal={<DescriptionModal user={currentUser} />} prop={aboutMe} borderBottomWidth='0' />
      </Card>
    )
  }
})
