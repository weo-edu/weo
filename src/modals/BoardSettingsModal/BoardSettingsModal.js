/**
 * Imports
 */

import {Modal, ModalBody, ModalFooter, ModalHeader, Flex, Block, Text} from 'vdux-ui'
import RoundedInput from 'components/RoundedInput'
import {component, element} from 'vdux'
import {Button} from 'vdux-containers'
import Confirm from 'modals/Confirm'
import validate from 'lib/validate'
import summon from 'vdux-summon'
import Form from 'vdux-form'

/**
 * <BoardSettingsModal/>
 */

export default summon(({board}) => ({
  renameBoard: body => ({
    renaming: {
      url: `/board/${board._id}`,
      method: 'PUT',
      invalidates: ['/user/boards', `/group/${board._id}`],
      body
    }
  })
}))(component({
  render ({props, context, actions}) {
    const {renameBoard, board, renaming = {}} = props

    return (
      <Modal onDismiss={context.closeModal} opacity='1'>
        <Form onSubmit={renameBoard} onSuccess={context.closeModal} cast={changes => ({...board, ...changes})} tall validate={validate.board} autocomplete='off'>
          <ModalBody>
            <Flex column align='space-around center'>
              <ModalHeader>
                Board Settings
              </ModalHeader>
              <RoundedInput my autofocus name='displayName' placeholder='Board name' defaultValue={board.displayName} />
            </Flex>
          </ModalBody>
          <ModalFooter bg='grey' align='space-between center'>
            <Button bgColor='danger' onClick={actions.deleteBoard}>
              Delete
            </Button>
            <Block>
              <Text fs='xxs'>
                <Text pointer underline onClick={context.closeModal}>cancel</Text>
                <Text mx>or</Text>
              </Text>
              <Button type='submit' busy={renaming.loading}>Update</Button>
            </Block>
          </ModalFooter>
        </Form>
      </Modal>
    )
  },

  controller: {
    * deleteBoard ({props, context}) {
      const {board, exitPath = '/'} = props
      const isCurrentBoard = context.currentUrl.indexOf(board._id) !== -1

      yield context.openModal(() => (
        <ConfirmDeleteBoard
          boardId={board._id}
          redirect={isCurrentBoard && exitPath}
          message={'Are you sure you want to delete your board "' + board.displayName + '?"'} />
      ))
    }
  }
}))

/**
 * <ConfirmDeleteBoard/>
 */

const ConfirmDeleteBoard = summon(({boardId}) => ({
  onAccept: () => ({
    accepting: {
      url: `/board/${boardId}`,
      method: 'DELETE',
      invalidates: '/user/boards'
    }
  })
}))(Confirm)
