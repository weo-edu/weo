/**
 * Imports
 */

import StreamActivity from 'components/StreamActivity'
import summonChannels from 'lib/summon-channels'
import EmptyState from 'components/EmptyState'
import PageTitle from 'components/PageTitle'
import RowFeed from 'components/RowFeed'
import {component, element} from 'vdux'
import {Block} from 'vdux-ui'

/**
 * <NotificationsFeed/>
 */

export default summonChannels(
  ({currentUser}) => `user!${currentUser._id}.notifications`, {
    markRead: () => ({
      markingRead: {
        url: '/user/notifications',
        method: 'DELETE'
      }
    })
  })(component({
    onCreate ({props}) {
      return props.markRead()
    },

    render ({props}) {
      return (
        <Block>
          <PageTitle title='Notifications | Weo' />
          <RowFeed
            item={StreamActivity}
            w='col_xl'
            mt='l'
            mx='auto'
            {...props}
            search={false}
            emptyState={<EmptyState wide icon='cast' color='red_medium'>You have no notifications</EmptyState>}
           />
          }
        </Block>
    )
    }
  }))
