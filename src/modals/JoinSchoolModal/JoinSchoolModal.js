/**
 * Imports
 */

import {Modal, ModalBody, ModalFooter, ModalHeader, Block, Text} from 'vdux-ui'
import CreateSchoolModal from 'modals/CreateSchoolModal'
import JoinSchool from 'components/JoinSchool'
import LineInput from 'components/LineInput'
import {component, element} from 'vdux'
import {Button} from 'vdux-containers'
import Form from 'vdux-form'

/**
 * <JoinSchoolModal/>
 */

export default component({
  render ({props, actions, context}) {
    const {joinSchool, joiningSchool = {}} = props

    return (
      <Modal onDismiss={context.closeModal}>
        <ModalBody pb='l' w='col_m' mx='auto'>
          <ModalHeader>
            Join a School
          </ModalHeader>
          <JoinSchool mt='l' mb fn={context.closeModal} noSchoolFn={context.openModal(() => <CreateSchoolModal />)} />
        </ModalBody>
        <ModalFooter bg='grey'>
          <Text fs='xxs'>
            <Text pointer underline onClick={context.closeModal}>Cancel</Text>
            <Text mx>or</Text>
          </Text>
          <Button type='submit' busy={joiningSchool.loading}>Join</Button>
        </ModalFooter>
      </Modal>
    )
  }
})
