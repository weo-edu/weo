/**
 * Imports
 */

import ActivityRowStudent from 'components/ActivityRowStudent'
import ClassActivityRow from 'components/ClassActivityRow'
import summonChannels from 'lib/summon-channels'
import EmptyClassFeed from './EmptyClassFeed'
import PageTitle from 'components/PageTitle'
import RowFeed from 'components/RowFeed'
import {component, element} from 'vdux'
import {Block} from 'vdux-ui'
import live from 'lib/live'

/**
 * <ClassFeed/> Page
 */

export default summonChannels(({group}) => `group!${group._id}.board`)(
  live(({group}) => ({
    activities: {
      url: '/share',
      params: {
        channel: `group!${group._id}.board`
      }
    }
  }))(component({
    render ({props}) {
      const {group, currentUser} = props
      const Item = currentUser.userType === 'student'
        ? ActivityRowStudent
        : ClassActivityRow

      return (
        <Block my pb mx='auto' relative>
          <PageTitle title={`${group.displayName} | Feed`} />
          {
            <RowFeed {...props} item={Item} emptyState={<EmptyClassFeed currentUser={currentUser} />} />
          }
        </Block>
    )
    }
  })))
