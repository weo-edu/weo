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
 * <CreateBoardModal/>
 */

export default summon(props => ({
  createBoard: body => ({
    creatingBoard: {
      url: '/board/',
      method: 'POST',
      invalidates: '/user/boards',
      body
    }
  })
}))(component({
  render ({props, context}) {
    const {createBoard, creatingBoard = {}} = props
    const {loading} = creatingBoard

    return (
      <Modal onDismiss={context.closeModal}>
        <Form onSubmit={createBoard} onSuccess={context.closeModal} tall validate={validate.board} autocomplete='off'>
          <ModalBody>
            <Flex column align='space-around center'>
              <ModalHeader>
                Create Board
              </ModalHeader>
              <RoundedInput my autofocus name='displayName' placeholder='Board name' />
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
  }
}))
