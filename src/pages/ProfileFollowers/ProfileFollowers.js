/**
 * Imports
 */

import EmptyProfileFollowers from './EmptyProfileFollowers'
import InfiniteScroll from 'components/InfiniteScroll'
import UserTile from 'components/UserTile'
import {component, element} from 'vdux'
import summon from 'vdux-summon'
import {Grid} from 'vdux-ui'
import map from '@f/map'

/**
 * <ProfileFollowers/>
 */

export default summon(({user}) => ({
  followers: `/user/${user._id}/followers?maxResults=20`,
  more: pageToken => ({
    followers: {
      params: pageToken && {
        pageToken
      }
    }
  })
}))(component({
  render ({props}) {
    const {followers, more, currentUser, user} = props
    const {value, loaded, loading} = followers

    return (
      <InfiniteScroll loading={loading} more={value && more(value.nextPageToken)} w='calc(100% + 12px)'>
        {
          <Grid rowAlign='start'>
            {
              loaded && renderItems(currentUser, user, value.items)
            }
          </Grid>
        }
      </InfiniteScroll>
    )
  }
}))

/**
 * Helpers
 */

function renderItems (me, profUser, items) {
  return (
    items && items.length
      ? map(user => <UserTile isCurrentUser={me._id === user._id} user={user} />, items)
      : <EmptyProfileFollowers me={me} user={profUser} />
  )
}
