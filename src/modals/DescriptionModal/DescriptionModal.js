/**
 * Imports
 */

import {Modal, ModalBody, ModalFooter, ModalHeader, Flex, Block, Text} from 'vdux-ui'
import {Button, Textarea} from 'vdux-containers'
import {component, element} from 'vdux'
import summon from 'vdux-summon'
import Form from 'vdux-form'

/**
 * <DescriptionModal/>
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
}))(component({
  render ({props, actions, context, state}) {
    const {user, changeDescription, changingDescription = {}} = props
    const {loading} = changingDescription
    const {aboutMe = ''} = user
    const {text = aboutMe} = state

    return (
      <Modal onDismiss={context.closeModal}>
        <Form onSubmit={changeDescription} onSuccess={context.closeModal}>
          <Flex ui={ModalBody} column align='center center' pb='l'>
            <ModalHeader>
              Description
            </ModalHeader>
            <Textarea
              placeholder='A few words about yourself...'
              focusProps={{border: 'rgba(blue, .35)'}}
              border='rgba(grey, 0.15)'
              onInput={actions.setText}
              defaultValue={aboutMe}
              maxlength='300'
              name='aboutMe'
              autofocus
              w='300px'
              px='10px'
              rows={5}
              py='8px'
              m />
            <Block w='300px'>
              <Text color='grey_medium' float='right'>{text.length}/300</Text>
            </Block>
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
  },

  reducer: {
    setText: (state, text) => ({text})
  }
}))
