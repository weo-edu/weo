/**
 * Imports
 */

import {Modal, ModalBody, ModalHeader, ModalFooter, Flex, Block, Text} from 'vdux-ui'
import GradeSelector from 'components/GradeSelector'
import handleActions from '@f/handle-actions'
import createAction from '@f/create-action'
import {closeModal} from 'reducer/modal'
import {Button} from 'vdux-containers'
import element from 'vdux/element'
import summon from 'vdux-summon'
import Form from 'vdux-form'

/**
 * initialState
 */

function initialState ({props}) {
  const {user} = props

  return {
    gradeLevels: user.gradeLevels || []
  }
}

/**
 * <GradePickerModal/>
 */

function render ({props, state, local}) {
  const {changeGradeLevels, onClose = () => {}, changingGradeLevels = {}} = props
  const {loading} = changingGradeLevels
  const {gradeLevels} = state

  return (
    <Modal onDismiss={close}>
      <Form onSubmit={() => changeGradeLevels(gradeLevels)} onSuccess={close}>
        <Flex ui={ModalBody} column align='center center' pb='l'>
          <ModalHeader>
            Select Your Grades
          </ModalHeader>
          <GradeSelector selected={gradeLevels} toggle={local(toggle)} />
        </Flex>
        <ModalFooter bg='greydark'>
          <Text fs='xxs'>
            <Text pointer underline onClick={close}>cancel</Text>
            <Text mx>or</Text>
          </Text>
          <Button type='submit' busy={loading}>Update</Button>
        </ModalFooter>
      </Form>
    </Modal>
  )

  function * close () {
    yield closeModal()
    yield onClose()
  }
}

/**
 * Actions
 */

const toggle = createAction('<GradePickerModal/>: toggle grade level')

/**
 * Reducer
 */

const reducer = handleActions({
  [toggle]: (state, grade) => ({
    ...state,
    gradeLevels: state.gradeLevels.indexOf(grade) === -1
      ? [...state.gradeLevels, grade]
      : state.gradeLevels.filter(g => g !== grade)
  })
})

/**
 * Exports
 */

export default summon(({user}) => ({
  changeGradeLevels: gradeLevels => ({
    changingGradeLevels: {
      url: `/user/${user._id}/gradeLevels`,
      method: 'PUT',
      invalidates: '/user',
      body: {
        gradeLevels
      }
    }
  })
}))({
  initialState,
  render,
  reducer
})
