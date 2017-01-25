/**
 * Imports
 */

import {Modal, ModalBody, ModalFooter, ModalHeader, Flex, Text} from 'vdux-ui'
import {component, element, decodeNode} from 'vdux'
import RoundedInput from 'components/RoundedInput'
import validate from '@weo-edu/validate'
import {Button} from 'vdux-containers'
import Schema from '@weo-edu/schema'
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
        <Form onSubmit={setPointValue} validate={validator} cast={cast} onSuccess={context.closeModal}>
          <Flex ui={ModalBody} column align='center center' pb='l'>
            <ModalHeader>
              Point Value
            </ModalHeader>
            <RoundedInput name='value' onInput={decodeNode(normalize)} required defaultValue={max_points} placeholder='Enter a number' w='150px' m autofocus />
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

/**
 * Helpers
 */

function normalize (node) {
  node.value = (node.value || '').replace(/[^0-9\.]/g, '').replace(/\.+/g, '.')
}

function cast (model) {
  return {
    value: Number(model.value)
  }
}

const schema = Schema()
  .prop('value', Schema('number').min(0, 'Negative numbers not allowed'))
  .required(['value'], 'Required')

const validator = validate(schema)
