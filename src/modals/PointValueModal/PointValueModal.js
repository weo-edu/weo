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
 * <PointValueModal/>
 */

export default summon(({user}) => ({
  setPointValue: body => ({
    changingPoints: {
      url: '/preference/max_points',
      method: 'PUT',
      body
    }
  })
}))(component({
  render ({props, context}) {
    const {user, setPointValue, changingPoints = {}} = props
    const {loading} = changingPoints
    const {preferences} = user
    const {max_points = 10} = preferences

    return (
      <Modal onDismiss={context.closeModal}>
        <Form onSubmit={setPointValue} onSuccess={context.closeModal}>
          <Flex ui={ModalBody} column align='center center' pb='l'>
            <ModalHeader>
              Point Value
            </ModalHeader>
            <RoundedInput name='value' defaultValue={max_points} placeholder='Enter a number' w='150px' m autofocus inputProps={{type: 'number', min: '1'}} />
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
