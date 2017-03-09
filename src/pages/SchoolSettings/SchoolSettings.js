/**
 * Imports
 */

import {SchoolColorPickerModal} from 'modals/ColorPickerModal'
import SchoolLocationModal from 'modals/SchoolLocationModal'
import SchoolLogoModal from 'modals/SchoolLogoModal'
import SchoolNameModal from 'modals/SchoolNameModal'
import SettingsRow from 'components/SettingsRow'
import SchoolLogo from 'components/SchoolLogo'
import PageTitle from 'components/PageTitle'
import {component, element} from 'vdux'
import {pickerColors} from 'lib/colors'
import {Block, Card} from 'vdux-ui'

/**
 * <School Settings/>
 */

export default component({
  render ({props}) {
  	const {currentUser, school} = props

    return (
    	<Card>
        <PageTitle title={props.school.name + ' | Settings'} />
        <SettingsRow name='School' prop={school.name} placeholder='What is the name of your school?' Modal={<SchoolNameModal school={school} />} />
        <SettingsRow name='Location' prop={school.location} placeholder='Where is your school located?' Modal={<SchoolLocationModal school={school} />} />
        <SettingsRow name='Logo' Modal={<SchoolLogoModal school={school} />}>
          <SchoolLogo sq='40px' school={school} display='block' />
        </SettingsRow>
        <SettingsRow name='Color' Modal={<SchoolColorPickerModal school={school} selected={school.color} />} message="The color that appears in the top bar of your school's page.">
          <Block circle='40px' bgColor={school.color || 'blue'} />
        </SettingsRow>
    	</Card>
    )
  }
})
