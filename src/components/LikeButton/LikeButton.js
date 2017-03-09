/**
 * Imports
 */

import OutlineButton from 'components/OutlineButton'
import SignUpModal from 'modals/SignUpModal'
import {component, element} from 'vdux'
import summon from 'vdux-summon'

/**
 * <LikeButton/>
 */

export default summon(({activity: {_id}}) => ({
  likeActivity: () => ({
    likeActivity: {
      url: `/share/${_id}/like`,
      method: 'PUT'
    }
  }),
  unlikeActivity: () => ({
    unlikeActivity: {
      url: `/share/${_id}/unlike`,
      method: 'PUT'
    }
  })
}))(component({
  render ({props, actions}) {
    const {
      localLike, liked, activity, likeActivity,
      unlikeActivity, user, onClick = [], text, ...rest
    } = props
    const {likers = []} = activity
    const hasLiked = liked === -1
      ? false
      : liked === 1 || likers.some(liker => liker.id === user._id)

    const click = user && user._id
      ? [hasLiked ? unlikeActivity : likeActivity, localLike && localLike(hasLiked ? -1 : 1)]
      : actions.openSignupModal

    return (
      <OutlineButton
        onClick={[].concat(onClick, click)}
        bgColor={hasLiked && 'red'}
        color='grey_medium'
        icon='favorite'
        {...rest}>
        { text }
      </OutlineButton>
    )
  },

  controller: {
    * openSignupModal ({context}) {
      yield context.openModal(() => <SignUpModal />)
    }
  }
}))
