/**
 * Imports
 */

import {Modal, ModalBody, ModalFooter, ModalHeader, Flex, Text} from 'vdux-ui'
import RoundedInput from 'components/RoundedInput'
import {component, element} from 'vdux'
import {Button} from 'vdux-containers'
import validate from 'lib/validate'
import summon from 'vdux-summon'
import Form from 'vdux-form'

/**
 * <CreateClassModal/>
 */

export default summon(props => ({
  createClass: body => ({
    creatingClass: {
      url: '/group/',
      method: 'POST',
      invalidates: '/user/classes',
      body
    }
  })
}))(component({
  render ({props, context, actions}) {
    const {createClass, creatingClass = {}} = props
    const {loading} = creatingClass

    return (
      <Modal onDismiss={context.closeModal} opacity='1'>
        <Form onSubmit={createClass} onSuccess={actions.goToClass} tall validate={validate.group} autocomplete='off'>
          <ModalBody>
            <Flex column align='space-around center'>
              <ModalHeader>
                Create Class
              </ModalHeader>
              <RoundedInput my autofocus name='displayName' placeholder='Class name' />
            </Flex>
          </ModalBody>
          <ModalFooter bg='grey'>
            <Text fs='xxs'>
              <Text pointer underline onClick={context.closeModal}>cancel</Text>
              <Text mx>or</Text>
            </Text>
            <Button type='submit' busy={loading}>Create</Button>
          </ModalFooter>
        </Form>
      </Modal>
    )
  },

  controller: {
    * goToClass ({context}, {_id}) {
      yield context.setUrl(`/class/${_id}/feed`)
    }
  }
}))
