/**
 * Imports
 */

import ActivityRow from 'components/ActivityRow'
import summonChannels from 'lib/summon-channels'
import EmptyState from 'components/EmptyState'
import RowFeed from 'components/RowFeed'
import {component, element} from 'vdux'
import {Block, Flex} from 'vdux-ui'

/**
 * <Trash/> page
 */

export default summonChannels(
  props => `user!${props.currentUser._id}.trash`, {}, 'updatedAt'
)(component({
  render ({props}) {
    return (
      <RowFeed {...props} item={ActivityRow} emptyState={<EmptyTrash />} />
    )
  }
}))

/**
 * <EmptyTrash/> - Trash empty state
 */

function EmptyTrash () {
  return (
    <EmptyState ui={Flex} column align='center center' bg='#E4E5E7' border='1px solid #D8DADD' icon='delete' color='red' w='auto' minHeight='400px'>
      <Block fs='m' my='l'>Your trash is empty.</Block>
    </EmptyState>
  )
}
