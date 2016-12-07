/**
 * Imports
 */

import {Modal, ModalBody, ModalHeader, ModalFooter, Flex, Text} from 'vdux-ui'
import GradeSelector from 'components/GradeSelector'
import {component, element} from 'vdux'
import {Button} from 'vdux-containers'
import summon from 'vdux-summon'
import Form from 'vdux-form'

/**
 * <GradePickerModal/>
 */

export default summon(({user}) => ({
  changeGradeLevels: gradeLevels => ({
    changingGradeLevels: {
      url: `/user/${user._id}/gradeLevels`,
      method: 'PUT',
      body: {
        gradeLevels
      }
    }
  })
}))(component({
  initialState: ({props}) => ({
    gradeLevels: props.user.gradeLevels || []
  }),

  render ({props, state, context, actions}) {
    const {changeGradeLevels, changingGradeLevels = {}} = props
    const {loading} = changingGradeLevels
    const {gradeLevels} = state

    return (
      <Modal onDismiss={actions.close}>
        <Form onSubmit={changeGradeLevels(gradeLevels)} onSuccess={actions.close}>
          <Flex ui={ModalBody} column align='center center' pb='l'>
            <ModalHeader>
              Select Your Grades
            </ModalHeader>
            <GradeSelector selected={gradeLevels} toggle={actions.toggle} />
          </Flex>
          <ModalFooter bg='greydark'>
            <Text fs='xxs'>
              <Text pointer underline onClick={actions.close}>cancel</Text>
              <Text mx>or</Text>
            </Text>
            <Button type='submit' busy={loading}>Update</Button>
          </ModalFooter>
        </Form>
      </Modal>
    )
  },

  controller: {
    * close ({context, props}) {
      yield context.closeModal()
      if (props.onClose) yield props.onClose()
    }
  },

  reducer: {
    toggle: (state, grade) => ({
      gradeLevels: state.gradeLevels.indexOf(grade) === -1
        ? [...state.gradeLevels, grade]
        : state.gradeLevels.filter(g => g !== grade)
    })
  }
}))
