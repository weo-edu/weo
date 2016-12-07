/**
 * Imports
 */

import {Modal, ModalBody, ModalFooter, ModalHeader, Flex, Text} from 'vdux-ui'
import RoundedInput from 'components/RoundedInput'
import {username} from 'lib/schemas/user'
import validate from '@weo-edu/validate'
import {component, element} from 'vdux'
import {Button} from 'vdux-containers'
import Schema from '@weo-edu/schema'
import summon from 'vdux-summon'
import Form from 'vdux-form'

/**
 * <UsernameModal/>
 */

export default summon(({user, group}) => {
  let invalidates = ['/user', `/user/${user._id}`]
  if (group) invalidates.push(`/group/students?group=${group._id}`)
  return {
    changeUsername: body => ({
      changingUsername: {
        url: `/user/${user._id}/username`,
        method: 'PUT',
        body,
        invalidates
      }
    })
  }
})(component({
  render ({props, context}) {
    const {user, changeUsername, changingUsername = {}} = props
    const {loading} = changingUsername

    return (
      <Modal onDismiss={context.closeModal}>
        <Form onSubmit={changeUsername} onSuccess={context.closeModal} validate={validateUsername}>
          <Flex ui={ModalBody} column align='center center' pb='l'>
            <ModalHeader>
              Change Username
            </ModalHeader>
            <RoundedInput
              name='username'
              defaultValue={user.username}
              placeholder='Change your username'
              w='250px'
              m
              autofocus
              inputProps={{textAlign: 'left'}} />
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
 * Validation
 */

const validateUsername = validate(
  Schema()
    .prop('username', username)
    .required('username')
)
