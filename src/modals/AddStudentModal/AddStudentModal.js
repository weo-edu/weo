/**
 * Imports
 */

import {Modal, ModalBody, ModalFooter, ModalHeader, Block, Text} from 'vdux-ui'
import LineInput from 'components/LineInput'
import {component, element} from 'vdux'
import {Button} from 'vdux-containers'
import validate from 'lib/validate'
import summon from 'vdux-summon'
import Form from 'vdux-form'

/**
 * <UsernameModal/>
 */

export default summon(({groupId}) => ({
  createStudent: body => ({
    creatingStudent: {
      url: '/auth/user',
      method: 'POST',
      body
    }
  }),
  joinClass: userId => ({
    joiningClass: {
      url: `/group/${groupId}/members/${userId}`,
      method: 'PUT',
      invalidates: [`/group/students?group=${groupId}`]
    }
  })
}))(component({
  render ({props, actions, context}) {
    const {creatingStudent = {}, joiningClass = {}} = props
    const loading = creatingStudent.loading || joiningClass.loading

    return (
      <Modal onDismiss={context.closeModal}>
        <Form onSubmit={actions.studentJoin} onSuccess={context.closeModal} validate={validateStudent}>
          <ModalBody pb='l' w='col_m' mx='auto'>
            <ModalHeader>
              Add New Student
            </ModalHeader>
            <input type='hidden' name='userType' value='student' />
            <Block align='start center'>
              <LineInput autofocus name='name[givenName]' mr='l' placeholder='First Name' />
              <LineInput name='name[familyName]' placeholder='Last Name' />
            </Block>
            <Block align='start center' my='l'>
              <LineInput name='username' mr='l' placeholder='Username' />
              <LineInput name='sisId' placeholder='ID (Optional)' />
            </Block>
            <Block>
              <LineInput name='password' mr placeholder='Password' type='password' />
            </Block>
          </ModalBody>
          <ModalFooter bg='grey'>
            <Text fs='xxs'>
              <Text pointer underline onClick={context.closeModal}>cancel</Text>
              <Text mx>or</Text>
            </Text>
            <Button type='submit' busy={loading}>Add</Button>
          </ModalFooter>
        </Form>
      </Modal>
    )
  },

  controller: {
    * studentJoin ({props}, model) {
      const user = yield props.createStudent(model)
      yield props.joinClass(user.id)
    }
  }
}))

/**
 * validateStudent
 */

function validateStudent (model) {
  const result = validate.student(model)
  model.tmpPassword = model.password

  return result
}
