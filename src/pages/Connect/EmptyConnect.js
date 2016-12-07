/**
 * Imports
 */

import InviteTeacherModal from 'modals/InviteTeacherModal'
import SubjectPickerModal from 'modals/SubjectPickerModal'
import GradePickerModal from 'modals/GradePickerModal'
import EmptyState from 'components/EmptyState'
import {Button, Text} from 'vdux-containers'
import {t, component, element} from 'vdux'
import {Block, Icon} from 'vdux-ui'

/**
 * <EmptyConnect />
 */

export default component({
  propTypes: {
    search: t.maybe(t.Boolean),
    currentUser: t.Object,
    refresh: t.maybe(t.Function)
  },

  render ({props}) {
    const {search, currentUser} = props

    return (
      search
        ? <EmptySearch {...props} />
        : <FillOutProfile {...props} />
    )
  }
})

/**
 * <FillOutProfile/>
 */

const FillOutProfile = component({
  name: 'FillOutProfile',

  propTypes: {
    currentUser: t.Object,
    refresh: t.Function
  },

  render ({props, actions}) {
    return (
      <EmptyState>
        <Block lh='30px'>
          Tell us what you teach<br />
          We'll recommend teachers for you to <Text bold>follow</Text>.
        </Block>
        <Button
          onClick={actions.completeProfile(1)}
          boxShadow='z2'
          px='35px'
          lighter
          h='3em'
          fs='s'
          my='l'>
          <Block align='center center'>
            <Icon name='info_outline' fs='m' mr='s' mt='-1' />
            <Block>
                Complete My Profile
            </Block>
          </Block>
        </Button>
      </EmptyState>
    )
  },

  controller: {
    * completeProfile ({props, actions, context}, step) {
      const {currentUser} = props

      switch (step) {
        case 1:
          if (!currentUser.gradeLevels || !currentUser.gradeLevels.length) {
            yield context.openModal(() => <GradePickerModal user={currentUser} onClose={actions.completeProfile(2)} />)
            break
          }
        case 2:
          if (!currentUser.subjects || !currentUser.subjects.length) {
            yield context.openModal(() => <SubjectPickerModal user={currentUser} onClose={actions.completeProfile(3)} />)
            break
          }
        case 3:
          yield props.refresh()
          break
      }
    }
  }
})

/**
 * Constants
 */

const hoverProps = {underline: true}

/**
 * <EmptySearch/>
 */

const EmptySearch = component({
  render ({props, actions}) {
    return (
      <EmptyState icon='people' color='yellow'>
        Sorry, we couldn't find anybody by that name.<br />
        Try another search or invite&nbsp;
        <Text
          onClick={actions.inviteTeacher}
          hoverProps={hoverProps}
          color='blue'
          pointer>
          {props.connectQuery}
        </Text>
        &nbsp;to join Weo.
      </EmptyState>
    )
  },

  controller: {
    * inviteTeacher ({context}) {
      yield context.openModal(() => <InviteTeacherModal />)
    }
  }
})
