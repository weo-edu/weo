/**
 * Imports
 */

import {Modal, ModalFooter, ModalBody, Flex, ModalHeader, Text} from 'vdux-ui'
import RoundedInput from 'components/RoundedInput'
import {component, element} from 'vdux'
import {Button} from 'vdux-containers'
import summon from 'vdux-summon'
import Form from 'vdux-form'

/**
 * <SchoolNameModal/>
 */

export default summon(({school}) => ({
  changeName: model => ({
    changingName: {
      url: `/school/${school._id}/name`,
      method: 'PUT',
      body: {
        value: model.name
      }
    }
  })
}))(component({
  render ({props, context}) {
    const {changeName, changingName = {}, school} = props

    return (
      <Modal onDismiss={context.closeModal} opacity='1'>
        <Form onSubmit={changeName} onSuccess={context.closeModal} tall autocomplete='off'>
          <ModalBody>
            <Flex column align='space-around center'>
              <ModalHeader>
                Edit Name
              </ModalHeader>
              <RoundedInput mb='xl' mt w='250' autofocus name='name' value={school.name} placeholder='What is the name of your school?' />
            </Flex>
          </ModalBody>
          <ModalFooter bg='grey'>
            <Text fs='xxs'>
              <Text pointer underline onClick={context.closeModal}>cancel</Text>
              <Text mx>or</Text>
            </Text>
            <Button type='submit' busy={changingName.loading}>Change</Button>
          </ModalFooter>
        </Form>
      </Modal>
    )
  }
}))
