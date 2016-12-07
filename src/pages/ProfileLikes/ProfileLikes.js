/**
 * Imports
 */

import EmptyProfileLikes from './EmptyProfileLikes'
import TileFeed from 'components/TileFeed'
import {component, element} from 'vdux'
import summon from 'vdux-summon'

/**
 * <ProfileLikes/>
 */

export default summon(props => ({
  likes: `/user/${props.user._id}/likes`,
  more: pageToken => ({
    likes: {
      params: pageToken && {
        pageToken
      }
    }
  })
}))(component({
  render ({props}) {
    const {likes, more, currentUser, user} = props

    return (
      <TileFeed currentUser={currentUser} activities={likes} more={more} emptyState={<EmptyProfileLikes me={currentUser} user={user} />} />
    )
  }
}))
