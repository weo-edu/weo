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
 * <IdModal/>
 */

export default summon(({user, group}) => {
  const invalidates = ['/user', `/user/${user._id}`]

  if (group) {
    invalidates.push(`/group/students?group=${group._id}`)
  }

  return {
    changeId: body => ({
      changingId: {
        url: `/user/${user._id}/sis`,
        method: 'PUT',
        body,
        invalidates
      }
    })
  }
})(component({
  render ({props, context}) {
    const {user, changeId, changingId = {}} = props
    const {loading} = changingId

    return (
      <Modal onDismiss={context.closeModal}>
        <Form onSubmit={changeId} onSuccess={context.closeModal}>
          <Flex ui={ModalBody} column align='center center' pb='l'>
            <ModalHeader>
              Change Student ID
            </ModalHeader>
            <RoundedInput
              name='sisId'
              defaultValue={user.sisId}
              placeholder='Change ID'
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
