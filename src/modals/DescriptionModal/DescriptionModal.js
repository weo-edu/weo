/**
 * Imports
 */

import {Modal, ModalBody, ModalFooter, ModalHeader, Flex, Block, Text} from 'vdux-ui'
import handleActions from '@f/handle-actions'
import createAction from '@f/create-action'
import {Textarea} from 'vdux-containers'
import {closeModal} from 'reducer/modal'
import {Button} from 'vdux-containers'
import element from 'vdux/element'
import summon from 'vdux-summon'
import Form from 'vdux-form'

/**
 * <DescriptionModal/>
 */

function render ({props, local, state}) {
  const {user, changeDescription, fields, changingDescription = {}} = props
  const {loading} = changingDescription
  const {aboutMe = ''} = user
  const {text = aboutMe} = state

  return (
    <Modal onDismiss={closeModal}>
      <Form onSubmit={changeDescription} onSuccess={closeModal}>
        <Flex ui={ModalBody} column align='center center' pb='l'>
          <ModalHeader>
            Description
          </ModalHeader>
          <Textarea
            placeholder='A few words about yourself...'
            focusProps={{border: 'rgba(blue, .35)'}}
            border='rgba(grey, 0.15)'
            onInput={local(setText)}
            defaultValue={aboutMe}
            maxlength='300'
            name='aboutMe'
            autofocus
            w='300px'
            px='10px'
            rows={5}
            py='8px'
            m/>
            <Block w='300px'>
              <Text color='grey_medium' float='right'>{text.length}/300</Text>
            </Block>
        </Flex>
        <ModalFooter bg='greydark'>
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
 * Actions
 */

const setText = createAction('<DescriptionModal/>: set text', e => e.target.value)

/**
 * Reducer
 */

const reducer = handleActions({
  [setText]: (state, text) => ({
    ...state,
    text
  })
})

/**
 * Exports
 */

export default summon(({user}) => ({
  changeDescription: ({aboutMe}) => ({
    changingDescription: {
      url: '/user',
      method: 'PUT',
      invalidates: `/user/${user._id}`,
      body: {
        ...user,
        aboutMe
      }
    }
  })
}))({
  render,
  reducer
})
