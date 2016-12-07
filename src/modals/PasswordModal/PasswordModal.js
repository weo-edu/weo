/**
 * Imports
 */

import {Modal, ModalBody, ModalFooter, ModalHeader, Flex, Block, Text} from 'vdux-ui'
import RoundedInput from 'components/RoundedInput'
import {Button, Tooltip} from 'vdux-containers'
import {password} from 'lib/schemas/user'
import validate from '@weo-edu/validate'
import {component, element} from 'vdux'
import Schema from '@weo-edu/schema'
import summon from 'vdux-summon'
import Form from 'vdux-form'

/**
 * <PasswordModal/>
 */

export default summon(() => ({
  changePassword: (user, body) => ({
    [`changingPassword_${user._id || user.id}`]: {
      url: `/user/${user._id || user.id}/password`,
      method: 'PUT',
      body
    }
  })
}))(component({
  render ({props, actions, context, state}) {
    const {isMe} = props
    const users = [].concat(props.user)
    const names = users.map(user => user.displayName)
    const {loading} = state

    return (
      <Modal onDismiss={context.closeModal}>
        <Form onSubmit={actions.handleSubmit} onSuccess={context.closeModal} validate={validatePassword}>
          <Flex ui={ModalBody} column align='center center' pb='l'>
            <ModalHeader>
              New Password
            </ModalHeader>
            <Block hide={users.length > 1 || isMe} mb>
              Change password for <Text bold color='blue'>{names[0]}</Text>?
            </Block>
            <Block hide={users.length <= 1} mb>
              Change password for these
              <Tooltip
                tooltipProps={{whiteSpace: 'pre-line'}}
                placement='bottom'
                cursor='default'
                display='inline'
                message={names.join('\n')}
                color='blue'
                bold> {users.length} </Tooltip>
                users.
            </Block>
            <RoundedInput type='password' name='password' placeholder='Enter a new password' w='250' m autofocus inputProps={{textAlign: 'left'}} />
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
  },

  controller: {
    * handleSubmit ({props, actions}, body) {
      const {group} = props
      const users = [].concat(props.user)

      yield actions.beginLoading()
      yield users.map(user => props.changePassword(user, body))
      if (group) {
        yield props.summonInvalidate(`/group/students?group=${group._id}`)
      }
      yield actions.endLoading()
    }
  },

  reducer: {
    beginLoading: () => ({loading: true}),
    endLoading: () => ({loading: false})
  }
}))

/**
 * Validation
 */

const validatePassword = validate(
  Schema()
    .prop('password', password)
    .required('password')
)
