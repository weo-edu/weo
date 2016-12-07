/**
 * Imports
 */

import EmptyProfileFollowing from './EmptyProfileFollowing'
import InfiniteScroll from 'components/InfiniteScroll'
import UserTile from 'components/UserTile'
import {component, element} from 'vdux'
import summon from 'vdux-summon'
import {Grid} from 'vdux-ui'
import map from '@f/map'

/**
 * <ProfileFollowing/>
 */

export default summon(({user}) => ({
  following: `/user/${user._id}/following?maxResults=20`,
  more: pageToken => ({
    following: {
      params: pageToken && {
        pageToken
      }
    }
  })
}))(component({
  render ({props}) {
    const {following, more, currentUser, user} = props
    const {value, loaded, loading} = following

    return (
      <InfiniteScroll loading={loading} more={value && more(value.nextPageToken)} w='calc(100% + 12px)'>
        {
          <Grid>
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
      ? map(user => <UserTile currentUser={me} user={user} />, items)
      : <EmptyProfileFollowing me={me} user={profUser} />
  )
}
