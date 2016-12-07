/**
 * Imports
 */

import {Modal, ModalBody, ModalFooter, ModalHeader, Flex, Text} from 'vdux-ui'
import RoundedInput from 'components/RoundedInput'
import validate from '@weo-edu/validate'
import {component, element} from 'vdux'
import {email} from 'lib/schemas/user'
import {Button} from 'vdux-containers'
import Schema from '@weo-edu/schema'
import summon from 'vdux-summon'
import Form from 'vdux-form'

/**
 * <EmailModal/>
 */

export default summon(({user}) => ({
  changeEmail: body => ({
    changingEmail: {
      url: `/user/${user._id}/email`,
      method: 'PUT',
      body,
      invalidates: `/user/${user._id}`
    }
  })
}))(component({
  render ({props, context}) {
    const {user, changeEmail, changingEmail = {}} = props
    const {loading} = changingEmail

    return (
      <Modal onDismiss={context.closeModal}>
        <Form onSubmit={changeEmail} onSuccess={context.closeModal} validate={validateEmail}>
          <Flex ui={ModalBody} column align='center center' pb='l'>
            <ModalHeader>
              Email
            </ModalHeader>
            <RoundedInput
              defaultValue={user.email}
              name='email'
              placeholder='Please enter your email'
              w='250px'
              m
              autofocus
              inputProps={{textAlign: 'left'}} />
          </Flex>
          <ModalFooter bg='greydark'>
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

const validateEmail = validate(
  Schema()
    .prop('email', email)
    .required('email')
)
