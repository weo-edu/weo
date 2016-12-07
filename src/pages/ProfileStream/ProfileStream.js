/**
 * Imports
 */

import StreamActivity from 'components/StreamActivity'
import EmptyProfileStream from './EmptyProfileStream'
import summonChannels from 'lib/summon-channels'
import RowFeed from 'components/RowFeed'
import {component, element} from 'vdux'

/**
 * <ProfileStream/>
 */

export default summonChannels(
  ({user}) => `user!${user._id}.activities`
)(component({
  render ({props}) {
    const {currentUser, user} = props
    return (
      <RowFeed {...props} search={false} item={StreamActivity} wide emptyState={<EmptyProfileStream me={currentUser} user={user} />} />
    )
  }
}))
