/**
 * Imports
 */

import {Modal, ModalBody, ModalFooter, ModalHeader, Block} from 'vdux-ui'
import {setUrl} from 'redux-effects-location'
import {closeModal} from 'reducer/modal'
import {Button} from 'vdux-containers'
import element from 'vdux/element'
import Form from 'vdux-form'
import noop from '@f/noop'

/**
 * <Confirm/>
 */

function render ({props}) {
  const {onAccept = noop, onReject = noop, message, redirect} = props

  return (
    <Modal w='col_m'>
      <Form onSubmit={accept}>
        <ModalBody px='l' pb bgColor='off_white'>
          <ModalHeader>
            Confirm
          </ModalHeader>
          <Block textAlign='center' m='0 auto' pt pb='l'>
            {message}
          </Block>
        </ModalBody>
        <ModalFooter bg='white' borderTop='1px solid grey_light' mt={0}>
          <Button mr bgColor='grey_light' color='text' onClick={reject} hoverProps={{highlight: 0.03}} focusProps={{highlight: 0.03}}>
            Cancel
          </Button>
          <Button type='submit'>Ok</Button>
        </ModalFooter>
      </Form>
    </Modal>
  )

  function *accept() {
    yield onAccept()

    if (redirect) {
      yield setUrl(redirect)
    }

    yield closeModal()
  }

  function *reject() {
    yield onReject()
    yield closeModal()
  }
}

/**
 * Exports
 */

export default {
  render
}
