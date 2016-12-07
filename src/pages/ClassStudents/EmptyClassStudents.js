/**
 * Imports
 */

import InviteStudentsModal from 'modals/InviteStudentsModal'
import AddStudentModal from 'modals/AddStudentModal'
import {Icon, Block, Text} from 'vdux-ui'
import {component, element} from 'vdux'
import {Button} from 'vdux-containers'

/**
 * <EmptyClassStudents/>
 */

export default component({
  render ({props, actions}) {
    const {group} = props

    return (
      <Block p textAlign='center'>
        <Icon name='people' fs='xxl' color='green' />
        <Block my fs='m' lighter>
          Your class has no students
        </Block>
        <Block align='center center' my='l'>
          <Button fs='s' lighter py boxShadow='z2' bgColor='green' mr onClick={actions.inviteStudentsModal}>
            <Icon name='send' mr='s' fs='s' />
            Invite Students
          </Button>
          <Button fs='s' lighter py boxShadow='z2' onClick={actions.addStudentModal}>
            <Icon name='person_add' mr='s' fs='s' />
            Add Students
          </Button>
        </Block>
        <Block fs='s' lighter mx='auto' w='col_m'>
          Or instruct them to sign up at <Text bold>weo.io/student</Text> and
          join your class using the following code:
          <Text fontFamily='monospace' color='blue' ml='s'>
            {group.code}
          </Text>
        </Block>
      </Block>
    )
  },

  controller: {
    * addStudentModal ({props, context}) {
      yield context.openModal(() => <AddStudentModal groupId={props.group._id} />)
    },

    * inviteStudentsModal ({props, context}) {
      yield context.openModal(() => <InviteStudentsModal group={props.group} />)
    }
  }
})
