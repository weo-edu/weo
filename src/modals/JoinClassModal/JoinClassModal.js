/**
 * Imports
 */

import {Modal, ModalBody, ModalFooter, ModalHeader, Flex, Text} from 'vdux-ui'
import RoundedInput from 'components/RoundedInput'
import {component, element} from 'vdux'
import {Button} from 'vdux-containers'
import summon from 'vdux-summon'
import Form from 'vdux-form'

/**
 * <JoinClassModal/>
 */

export default summon(props => ({
  joinClass: ({code}) => ({
    joiningClass: {
      url: `/group/join/${code}`,
      method: 'PUT',
      invalidates: '/user/classes',
    }
  })
}))(component({
  render ({props, context, actions}) {
    const {joinClass, joiningClass = {}} = props
    const {loading} = joiningClass

    return (
      <Modal onDismiss={context.closeModal} opacity='1'>
        <Form onSubmit={joinClass} onSuccess={actions.goToClass} tall autocomplete='off'>
          <ModalBody>
            <Flex column align='space-around center'>
              <ModalHeader>
                Join Class
              </ModalHeader>
              <RoundedInput my autofocus name='code' placeholder='Enter Class code' />
            </Flex>
          </ModalBody>
          <ModalFooter bg='grey'>
            <Text fs='xxs'>
              <Text pointer underline onClick={context.closeModal}>cancel</Text>
              <Text mx>or</Text>
            </Text>
            <Button type='submit' busy={loading}>Join</Button>
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
