/**
 * Imports
 */

import ClassSettingsModal from 'modals/ClassSettingsModal'
import ClassCodeModal from 'modals/ClassCodeModal'
import {Text, Block, Icon} from 'vdux-ui'
import AppLayout from 'layouts/AppLayout'
import FourOhFour from 'pages/FourOhFour'
import NavTile from 'components/NavTile'
import {component, element} from 'vdux'
import {Button} from 'vdux-containers'
import maybeOver from '@f/maybe-over'
import getProp from '@f/get-prop'
import summon from 'vdux-summon'

/**
 * <ClassLayout/>
 */

export default summon(props => ({
  group: `/group/${props.groupId}`,
  students: `/group/students?group=${groupId}`,
  setPref: () => ({
    settingPref: {
      url: '/preference/lastClass',
      invalidates: '/user',
      method: 'PUT',
      body: {
        value: groupId
      }
    }
  })
}))(component({
  onCreate ({actions}) {
    return actions.setPref()
  },

  onUpdate ({actions}) {
    return actions.setPref()
  },

  render ({props, children}) {
    const {group, currentUser, students} = props
    const {value, loaded, error} = group
    const isStudent = currentUser.userType === 'student'

    if (!loaded || !students.loaded) return <span/>
    if (error || students.error) return <FourOhFour />

    return (
      <Block>
        <Header group={value} isStudent={isStudent} students={students.value} />
        <Block>
          {maybeOver(value, children)}
        </Block>
      </Block>
    )
  },

  events: {
    * updatePref ({props}) {
      const {currentUser, setPref, groupId, settingPref} = props
      const value = getProp('preferences.lastClass', currentUser)

      if (!settingPref.loading && value !== groupId) {
        yield setPref()
      }
    }
  }
}))

/**
 * <Header/>
 */

const Header = component({
  render ({props, actions}) {
    const {group, isStudent, students} = props
    const {_id: id, displayName, code, owners} = group

    return (
      <Block boxShadow='0 1px 2px 0 rgba(0,0,0,0.22)'>
        <Block p='m' fs='s' fw='lighter' capitalize bgColor='green' color='white' minHeight={107}>
          <Block align='space-between center'>
            <Block ellipsis fs='m' lighter align='start center'>
              {displayName}
              <Button
                onClick={actions.classSettingsModal}
                activeProps={{opacity: 1}}
                hoverProps={{opacity: 0.7}}
                hide={isStudent}
                icon='settings'
                opacity={1}
                fs='xs'
                ml='s'
                pr
                />
            </Block>
            <Button
              onClick={actions.classCodeModal}
              border='1px solid grey_medium'
              align='start center'
              bgColor='off_white'
              hoverProps={{highlight: .03}}
              focusProps={{highlight: .03}}
              hide={isStudent}
              color='text'
              fw='normal'
              fs='xs'
              px='m'
              h='30'>
              Class Code: &nbsp;
              <Text color='blue' fs='15px' fontFamily='monospace'>
                {code}
              </Text>
              <Icon ml='s' fs='xs' name='help' circle />
            </Button>
          </Block>
          <Block align='start center' my fs='xs'>
            <Block>
              {owners[0].displayName}
            </Block>
            <Block fs='s' mx='s'>
              &middot;
            </Block>
            <Block align='start center'>
              {students && students.items && students.items.length} &nbsp;
              Students
            </Block>
          </Block>
        </Block>

        <Block align='center center' h={46} bgColor='off_white'>
          <NavTile href={`/class/${id}/feed`} highlight='red'>
            Feed
          </NavTile>
          <NavTile href={`/class/${id}/students`} highlight='green'>
            Students
          </NavTile>
          <NavTile href={`/class/${id}/gradebook`} highlight='blue'>
            Gradebook
          </NavTile>
        </Block>
      </Block>
    )
  },

  events: {
    * classCodeModal ({context, props}) {
      yield context.openModal(() => <ClassCodeModal code={props.group.code} />)
    },

    * classSettings ({context, props}) {
      yield context.openModal(() => <ClassSetitngsModal group={props.group} />)
    }
  }
})
