/**
 * Imports
 */

import {Modal, ModalBody, ModalFooter, ModalHeader, Flex, Block, Text} from 'vdux-ui'
import RoundedInput from 'components/RoundedInput'
import {Button, Input} from 'vdux-containers'
import {closeModal} from 'reducer/modal'
import {website} from 'lib/schemas/user'
import Schema from '@weo-edu/schema'
import element from 'vdux/element'
import summon from 'vdux-summon'
import Form from 'vdux-form'

/**
 * <WebsiteModal/>
 */

function render ({props}) {
  const {user, changeWebsite, changingWebsite = {}} = props
  const {loading} = changingWebsite
  const {website} = user

  return (
    <Modal onDismiss={closeModal}>
      <Form onSubmit={changeWebsite} onSuccess={closeModal}>
        <Flex ui={ModalBody} column align='center center' pb='l'>
          <ModalHeader>
            Website
          </ModalHeader>
          <RoundedInput name='website' defaultValue={website} placeholder='http://…' w='250px' m autofocus inputProps={{textAlign: 'left'}}/>
        </Flex>
        <ModalFooter bg='grey'>
          <Text fs='xxs'>
            <Text pointer underline onClick={closeModal}>cancel</Text>
            <Text mx>or</Text>
          </Text>
          <Button type='submit' busy={loading}>Update</Button>
        </ModalFooter>
      </Form>
    </Modal>
  )
}

/**
 * Exports
 */

export default summon(({user}) => ({
  changeWebsite: ({website}) => ({
    changingWebsite: {
      url: `/user`,
      method: 'PUT',
      invalidates: `/user/${user._id}`,
      body: {
        ...user,
        website: /^https?\:\/\//.test(website)
          ? website
          : website ? 'http://' + website : ''
      }
    }
  })
}))({
  render
})
