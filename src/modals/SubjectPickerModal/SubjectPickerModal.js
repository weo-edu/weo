/**
 * Imports
 */

import {Modal, ModalBody, ModalFooter, ModalHeader, Flex, Text} from 'vdux-ui'
import SubjectSelector from 'components/SubjectSelector'
import {component, element} from 'vdux'
import {Button} from 'vdux-containers'
import summon from 'vdux-summon'
import Form from 'vdux-form'

/**
 * <SubjectPickerModal/>
 */

export default summon(({user}) => ({
  changeSubjects: subjects => ({
    changingSubjects: {
      url: `/user/${user._id}/subjects`,
      method: 'PUT',
      body: {
        subjects
      }
    }
  })
}))(component({
  initialState: ({props}) => ({
    subjects: props.user.subjects || []
  }),

  render ({props, state, actions}) {
    const {changeSubjects, changingSubjects = {}} = props
    const {loading} = changingSubjects
    const {subjects} = state

    return (
      <Modal onDismiss={actions.close}>
        <Form onSubmit={changeSubjects(subjects)} onSuccess={actions.close}>
          <Flex ui={ModalBody} column align='center center' pb='l'>
            <ModalHeader>
              Subjects
            </ModalHeader>
            <SubjectSelector selected={subjects} toggle={actions.toggle} />
          </Flex>
          <ModalFooter bg='grey'>
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
    toggle: (state, subject) => ({
      subjects: state.subjects.indexOf(subject) === -1
        ? [...state.subjects, subject]
        : state.subjects.filter(s => s !== subject)
    })
  }
}))
