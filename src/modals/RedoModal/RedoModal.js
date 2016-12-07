/**
 * Imports
 */

import {Modal, ModalHeader, ModalBody, ModalFooter, Text, Icon} from 'vdux-ui'
import {form, Button, Toggle, Tooltip} from 'vdux-containers'
import {component, element} from 'vdux'
import summon from 'vdux-summon'

/**
 * <RedoModal/>
 */

export default summon(() => ({
  redo: (id, body) => ({
    redoing: {
      url: `/instance/${id}/redo`,
      method: 'PUT',
      body
    }
  })
}))(form(({instanceIds, redo, onAccept = () => {}}, context) => ({
  fields: ['showIncorrect'],
  onSubmit: function * (body) {
    instanceIds = [].concat(instanceIds)
    yield instanceIds.map(id => redo(id, body))
    yield onAccept()
    yield context.closeModal()
  }
}))(component({
  render ({props, context}) {
    const {fields, redoing = {}} = props

    return (
      <Modal onDismiss={context.closeModal}>
        <ModalHeader w='col_s' m='auto'>
          Redo
        </ModalHeader>
        <ModalBody pb={40} pt={12} align='space-between center'>
          <Toggle checked={fields.showIncorrect.value} value name='showIncorrect' fs='s' lighter label='Mark incorrect questions for students.' flex />
          <Tooltip message='This toggles whether or not you want students to be able to see which questions they got right or wrong when they redo their Activity.' cursor='default' immediate tooltipProps={{whiteSpace: 'normal', textAlign: 'center', lh: '16px'}}>
            <Icon name='info' fs='s' />
          </Tooltip>
        </ModalBody>
        <ModalFooter m='0'>
          <Text fs='xxs'>
            <Text pointer underline onClick={context.closeModal}>cancel</Text>
            <Text mx>or</Text>
          </Text>
          <Button type='submit' busy={redoing.loading}>Redo</Button>
        </ModalFooter>
      </Modal>
    )
  }
})))
