/**
 * Imports
 */

import {Modal, ModalBody, ModalFooter, ModalHeader, Flex, Text} from 'vdux-ui'
import RoundedInput from 'components/RoundedInput'
import {component, element} from 'vdux'
import {Button} from 'vdux-containers'
import summon from 'vdux-summon'
import Form from 'vdux-form'

/**
 * <LocationModal/>
 */

export default summon(({user}) => ({
  changeLocation: ({location}) => ({
    changingLocation: {
      url: '/user',
      method: 'PUT',
      body: {
        ...user,
        location
      }
    }
  })
}))(component({
  render ({props, context}) {
    const {user, changeLocation, changingLocation = {}} = props
    const {loading} = changingLocation
    const {location} = user

    return (
      <Modal onDismiss={context.closeModal}>
        <Form onSubmit={changeLocation} onSuccess={context.closeModal}>
          <Flex ui={ModalBody} column align='center center' pb='l'>
            <ModalHeader>
              Location
            </ModalHeader>
            <RoundedInput defaultValue={location} name='location' placeholder='Where are you located?' w='250px' m autofocus inputProps={{textAlign: 'left'}} />
          </Flex>
          <ModalFooter bg='grey'>
            <Text fs='xxs'>
              <Text pointer underline onClick={context.closeModal}>cancel</Text>
              <Text mx>or</Text>
            </Text>
            <Button type='submit' busy={loading}>Update</Button>
          </ModalFooter>
        </Form>
      </Modal>
    )
  }
}))
