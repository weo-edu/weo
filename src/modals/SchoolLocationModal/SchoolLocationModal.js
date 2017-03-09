/**
 * Imports
 */

import {Block, Modal, ModalFooter, ModalBody, Flex, ModalHeader, Text} from 'vdux-ui'
import LineInput from 'components/LineInput'
import {component, element} from 'vdux'
import {Button} from 'vdux-containers'
import summon from 'vdux-summon'
import Form from 'vdux-form'

/**
 * <SchoolLocationModal/>
 */

export default summon(({school}) => ({
  changeLocation: body => ({
    changingLocation: {
      url: `/school/${school._id}/location`,
      method: 'PUT',
      body
    }
  })
}))(component({
  render ({props, context}) {
    const {changeLocation, changingLocation = {}, school} = props

    return (
      <Modal onDismiss={context.closeModal} opacity='1'>
        <Form onSubmit={changeLocation} onSuccess={context.closeModal} tall autocomplete='off'>
          <ModalBody>
            <Flex column align='space-around center'>
              <ModalHeader>
                Edit Location
              </ModalHeader>
              <Block align='space-between' flex>
                <LineInput name='city' value={school.city} placeholder='City' mb='l' w='70%' />
                <LineInput name='state' value={school.state} placeholder='State' mb='l' w='23%' />
              </Block>
            </Flex>
          </ModalBody>
          <ModalFooter bg='grey'>
            <Text fs='xxs'>
              <Text pointer underline onClick={context.closeModal}>cancel</Text>
              <Text mx>or</Text>
            </Text>
            <Button type='submit' busy={changingLocation.loading}>Change</Button>
          </ModalFooter>
        </Form>
      </Modal>
    )
  }
}))
