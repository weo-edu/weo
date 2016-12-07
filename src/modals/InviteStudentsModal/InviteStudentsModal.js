/**
 * Imports
 */

import {Modal, ModalBody, ModalFooter, ModalHeader, Block, Text} from 'vdux-ui'
import LineInput from 'components/LineInput'
import {component, element} from 'vdux'
import {Button} from 'vdux-containers'
import summon from 'vdux-summon'
import Form from 'vdux-form'

/**
 * <InviteStudentsModal/>
 */

export default summon(({group}) => ({
  sendInvite: emails => ({
    sendingInvites: {
      url: `/group/${group._id}/invite`,
      method: 'POST',
      body: {
        emails
      }
    }
  })
}))(component({
  render ({props, context, actions}) {
    const {sendingInvites = {}} = props
    const {loading} = sendingInvites

    return (
      <Modal onDismiss={context.closeModal}>
        <Form onSubmit={actions.submit} onSuccess={context.closeModal}>
          <ModalBody textAlign='center'>
            <ModalHeader>
              Invite Students
            </ModalHeader>
            <LineInput name='emails' w='88%' mx='auto' autofocus />
            <Block mb='s' mt>
              Enter a list of emails separated by commas
            </Block>
            <Block color='grey_medium' fontStyle='italic' mb='xl'>
              john.doe@gmail.com, jane.doe@gmail.com
            </Block>
          </ModalBody>
          <ModalFooter bg='grey'>
            <Text fs='xxs'>
              <Text pointer underline onClick={context.closeModal}>cancel</Text>
              <Text mx>or</Text>
            </Text>
            <Button type='submit' busy={loading}>Send!</Button>
          </ModalFooter>
        </Form>
      </Modal>
    )
  },

  controller: {
    * submit ({props}, {emails}) {
      yield props.sendInvite(emails.split(',').map(email => email.replace(/\s/g, '')))
    }
  }
}))
