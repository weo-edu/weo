/**
 * Imports
 */

import {Block, Dropdown, MenuItem, Icon, Divider, CSSContainer} from 'vdux-containers'
import CreateClassModal from 'modals/CreateClassModal'
import JoinClassModal from 'modals/JoinClassModal'
import handleActions from '@f/handle-actions'
import LineInput from 'components/LineInput'
import createAction from '@f/create-action'
import {openModal} from 'reducer/modal'
import ClassItem from './ClassItem'
import element from 'vdux/element'
import summon from 'vdux-summon'

/**
 * <ClassNav/>
 */

function render ({props, state, local, children}) {
  const {classes, currentUser} = props
  const {value, loading} = classes
  const numClasses = !loading && value.items.length
  const isStudent = currentUser.userType === 'student'

  return (
    <Dropdown btn={<div>{children}</div>} bg='white' color='black' maxHeight={350} overflow='auto' mt='-6' w='200' left>
      <Block bg='transparent' pt='s' px onClick={e => e.stopPropagation()} hide={numClasses < 8}>
        <LineInput type='search' onInput={local(setFilter)} placeholder='Filter classes…' />
      </Block>
      <Block>
      {
        !loading &&
        value.items
          .filter(search(state.filter))
          .map(cls => <ClassItem cls={cls} isStudent={isStudent} />)
      }
      <Divider hide={!numClasses} />
      {
        isStudent
          ? <AddClassItem Modal={JoinClassModal} text='Join Class' />
          : <AddClassItem Modal={CreateClassModal} text='New Class' />
      }
      </Block>
    </Dropdown>
  )
}

function AddClassItem ({props}) {
  const {Modal, text} = props
  return (
    <MenuItem onClick={() => openModal(() => <Modal />)} py='m' color='text_color' display='flex' align='start center'>
      <Icon name='add' fs='s' mr='m' sq='25' textAlign='center' />
      {text}
    </MenuItem>
  )
}

/**
 * Actions
 */

const setFilter = createAction('<ClassNav/>: Set filter', e => e.target.value)

/**
 * Reducer
 */

const reducer = handleActions({
  [setFilter]: (state, filter) => ({
    ...state,
    filter
  })
})

/**
 * Helpers
 */

function search (text = '') {
  text = text.toUpperCase()
  return cls => !text
    ? true
    : cls.displayName.toUpperCase().indexOf(text) !== -1
}

/**
 * Exports
 */

export default summon(() => ({
  classes: '/user/classes'
}))({
  render,
  reducer
})
