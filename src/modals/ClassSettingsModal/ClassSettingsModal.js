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
 * <ClassSettingsModal/>
 */

export default summon(({group}) => ({
  renameClass: body => ({
    renaming: {
      url: `/group/${group._id}`,
      method: 'PUT',
      invalidates: '/user/classes',
      body
    }
  })
}))(component({
  render ({props, context, actions}) {
    const {renameClass, renaming = {}, group} = props

    return (
      <Modal onDismiss={context.closeModal}>
        <Form onSubmit={renameClass} onSuccess={context.closeModal} cast={changes => ({...group, ...changes})} tall validate={validate.group} autocomplete='off'>
          <ModalBody>
            <Flex column align='space-around center'>
              <ModalHeader>
                Class Settings
              </ModalHeader>
              <RoundedInput my autofocus name='displayName' placeholder='Class name' defaultValue={group.displayName} />
            </Flex>
          </ModalBody>
          <ModalFooter bg='grey' align='space-between center'>
            <Button bgColor='danger' onClick={actions.deleteClass}>
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
    * deleteClass ({props, context}) {
      const {group} = props
      const isCurrentClass = context.currentUrl.indexOf(group._id) !== -1

      yield context.openModal(() =>
        <ConfirmDeleteClass
          redirect={isCurrentClass && '/class/all'}
          classId={group._id}
          message={'Are you sure you want to delete your class "' + group.displayName + '?"'} />
      )
    }
  }
}))

/**
 * <ConfirmDeleteClass/>
 */

const ConfirmDeleteClass = summon(({classId}) => ({
  onAccept: () => ({
    accepting: {
      url: `/group/${classId}`,
      method: 'DELETE',
      invalidates: '/user/classes',
    }
  })
}))(Confirm)
