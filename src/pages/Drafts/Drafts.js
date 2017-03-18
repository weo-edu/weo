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
 * Constants
 */

const itemProps = {
  options: {
    pin: true,
    archive: true
  }
}

/**
 * <Drafts/> Page
 */

export default summonChannels(props =>
  `user!${props.currentUser._id}.drafts`, {}, 'updatedAt'
)(component({
  render ({props}) {
    return (
      <RowFeed {...props} item={ActivityRow} emptyState={<EmptyDrafts />} itemProps={itemProps} />
    )
  }
}))

/**
 * <EmptyDrafts/> - Drafts empty state
 */

function EmptyDrafts () {
  return (
    <EmptyState ui={Flex} column fill align='center center' weoIcon='draft' color='yellow' p={0} minHeight='400px'>
      <Block fs='m' my='l'>You have no drafts.</Block>
    </EmptyState>
  )
}
