/**
 * Imports
 */

import AppLayout from 'layouts/AppLayout'
import maybeOver from '@f/maybe-over'
import element from 'vdux/element'
import summon from 'vdux-summon'
import Header from './Header'

/**
 * <BoardLayout/>
 */

function render ({props, children}) {
  const {user, currentUser, board} = props
  const {value, loading, error} = board


  return (
    <AppLayout {...props}>
      { internal(board, currentUser, children) }
    </AppLayout>
  )
}

function internal({value, loading, error}, currentUser, children) {
  if (loading) return ''
  if (error) return <FourOhFour />

  return [
    <Header value={value} currentUser={currentUser}/>,
    maybeOver(value, children)
  ]
}

/**
 * Exports
 */

export default summon(({boardId}) => ({
  board: `/group/${boardId}`
}))({
  render
})