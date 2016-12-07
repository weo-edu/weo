/**
 * Imports
 */

import {Modal, ModalBody, ModalFooter, ModalHeader, Block} from 'vdux-ui'
import {component, element} from 'vdux'
import {Button} from 'vdux-containers'
import Form from 'vdux-form'

/**
 * <Confirm/>
 */

export default component({
  render ({props, context, actions}) {
    const {message, header = 'Confirm', accepting = {}} = props

    return (
      <Modal w='col_m'>
        <Form onSubmit={actions.accept}>
          <ModalBody px='l' pb>
            <ModalHeader>
              {header}
            </ModalHeader>
            <Block textAlign='center' m='0 auto' pt pb='l'>
              {message}
            </Block>
          </ModalBody>
          <ModalFooter bg='off_white' borderTop='1px solid grey_light' mt={0}>
            <Button mr bgColor='grey' onClick={actions.reject}>
              Cancel
            </Button>
            <Button type='submit' autofocus busy={accepting.loading}>Ok</Button>
          </ModalFooter>
        </Form>
      </Modal>
    )
  },

  controller: {
    * accept ({props, context}) {
      if (props.onAccept) yield props.onAccept()
      if (props.redirect) yield context.setUrl(props.redirect)

      yield context.closeModal()
    },

    * reject ({props, context}) {
      if (props.onReject) yield props.onReject()
      yield context.closeModal()
    }
  }
})
