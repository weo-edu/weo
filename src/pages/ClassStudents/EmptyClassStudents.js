/**
 * Imports
 */

import AddStudentModal from 'modals/AddStudentModal'
import {Button, Tooltip} from 'vdux-containers'
import {Icon, Block, Text} from 'vdux-ui'
import {component, element} from 'vdux'

/**
 * <EmptyClassStudents/>
 */

export default component({
  render ({props, actions}) {
    const {group} = props
    const btnProps = {py: '12px', boxShadow: 'z2'}
    return (
      <Block p textAlign='center'>
        <Icon name='people' fs='xxl' color='green' />
        <Block my fs='m' lighter>
          Your class has no students
        </Block>
        <Block align='center center' my='l'>
          <Button {...btnProps} onClick={actions.addStudentModal}>
            <Icon name='group_add' bolder mr fs='s' />
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
      yield context.openModal(() => <AddStudentModal group={props.group} />)
    }
    
  }
})
