/**
 * Imports
 */

import {Modal, ModalBody, ModalFooter, ModalHeader, Flex, Block, Text} from 'vdux-ui'
import {Button, Input, Dropdown, MenuItem} from 'vdux-containers'
import handleActions from '@f/handle-actions'
import LineInput from 'components/LineInput'
import createAction from '@f/create-action'
import {closeModal} from 'reducer/modal'
import validate from '@weo-edu/validate'
import {name} from 'lib/schemas/user'
import element from 'vdux/element'
import summon from 'vdux-summon'
import Form from 'vdux-form'

/**
 * Constants
 */

const prefixes = ['Mrs.', 'Ms.', 'Mr.', 'Dr.']

/**
 * initialState
 */

function initialState ({props}) {
  const {user} = props

  return {
    honorificPrefix: user.name.honorificPrefix
  }
}

/**
 * <NameModal/>
 */

function render ({props, state, local}) {
  const {user, changeName, changingName = {}} = props
  const {loading} = changingName
  const {name, userType} = user
  const isStudent = userType === 'student'
  const {familyName, givenName} = name
  const {honorificPrefix} = state

  return (
    <Modal onDismiss={closeModal}>
      <Form onSubmit={changeName} onSuccess={closeModal} validate={validateName}>
        <Flex ui={ModalBody} column align='center center' pb='l'>
          <ModalHeader>
            Name
          </ModalHeader>
          <Flex align='center center' py>
            <Block flex='20%' hide={isStudent}>
              <input type='hidden' name='honorificPrefix' value={honorificPrefix} />
              <Dropdown w='100%' mt='-1' btn={<Block borderBottom='1px solid grey_light' pb='7'>{honorificPrefix || 'Title'}</Block>}>
                <MenuItem onClick={local(setHonorificPrefix, '')}>None</MenuItem>
                {
                  prefixes.map((prefix) => <MenuItem onClick={local(setHonorificPrefix, prefix)}>{prefix}</MenuItem>)
                }
              </Dropdown>
            </Block>
            <LineInput name='givenName' placeholder='First Name' value={givenName} flex='30%' mx='l' />
            <LineInput name='familyName' placeholder='Last Name' value={familyName} flex='30%' />
          </Flex>
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
 * Validations
 */

const validateName = validate(name)

/**
 * Actions
 */

const setHonorificPrefix = createAction('<NameModal/>: set honorific prefix')

/**
 * Reducer
 */

const reducer = handleActions({
  [setHonorificPrefix]: (state, honorificPrefix) => ({
    ...state,
    honorificPrefix
  })
})

/**
 * Exports
 */

export default summon(({user, group}) => {
  let invalidates = ['/user', `/user/${user._id}`]
  if(group)
    invalidates.push(`/group/students?group=${group._id}`)
  return {
      changeName: name => ({
        changingName: {
          url: `/user/${user._id}/name`,
          method: 'PUT',
          body: {name},
          invalidates
        }
      })
    }
})({
  initialState,
  render,
  reducer
})
