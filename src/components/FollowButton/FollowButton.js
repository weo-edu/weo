/**
 * Imports
 */

import {component, element} from 'vdux'
import {Button} from 'vdux-containers'
import summon from 'vdux-summon'

/**
 * Constants
 */

const highlight = {highlight: 0.03}

/**
 * <FollowButton/>
 */

export default summon((props) => {
  const {board, user} = props
  const id = board ? (board._id || board.id) : (user.id || user._id)
  const type = board ? 'board' : 'user'

  const url = `/${type}/${id}/follow`
  const subscribe = type === 'board'
    ? 'follow:user'
    : undefined

  const invalidates = type === 'user'
    ? 'follow:user'
    : undefined

  return {
    isFollowing: {
      url,
      xf: body => body.value,
      subscribe
    },
    follow: () => ({
      followResponse: {
        url,
        method: 'PUT',
        invalidates
      }
    }),
    unfollow: () => ({
      followResponse: {
        url,
        method: 'DELETE',
        // Explicitly also invalidate the url for deletes
        // because they are excluded from the auto-invalidate
        // normally
        invalidates: [invalidates, url]
      }
    })
  }
})(component({
  render ({props}) {
    const {isFollowing, follow, unfollow, followResponse = {}, board, ...rest} = props
    const {value, reload} = isFollowing
    const loading = isFollowing.loading || followResponse.loading
    const noun = board ? 'Board' : ''
    const verb = loading && !reload
      ? 'Follow '
      : value ? 'Unfollow ' : 'Follow '

    return (
      <Button
        darkSpinner
        onClick={(value ? unfollow : follow)}
        busy={loading}
        color={value ? 'text' : 'blue'}
        px={25}
        rounded
        bgColor='off_white'
        hoverProps={highlight}
        focusProps={highlight}
        border='1px solid rgba(0,0,0,0.15)'
        {...rest}>
        {verb} {noun}
      </Button>
    )
  }
}))
