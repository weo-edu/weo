/**
 * Imports
 */

import {imageLoaded} from 'vdux-containers'
import {component, element} from 'vdux'
import resize from 'lib/resize-image'
import {Avatar} from 'vdux-ui'
import theme from 'lib/theme'

/**
 * Config
 */

const {AVATAR_SERVER} = process.env

/**
 * <Avatar/>
 */

export default imageLoaded(({actor, thumb, avatarUpdates}) => avatarUrl(actor, thumb, avatarUpdates))(component({
  render ({props, state, context, actions}) {
    const {actor, thumb, link, isLoaded} = props

    return <Avatar
      hidden={!isLoaded}
      bgColor='grey_light'
      onClick={link && context.setUrl(`/${actor.username}`)}
      src={avatarUrl(state.loadFailed ? 'default' : actor, thumb, context.avatarUpdates)}
      onError={actions.loadFailed}
      pointer={link}
      {...props} />
  },

  reducer: {
    loadFailed: () => ({loadFailed: true})
  }
}))

/**
 * Helpers
 */

function avatarUrl (actor, thumb, avatarUpdates) {
  const {avatarScale} = theme
  const url = `${AVATAR_SERVER}/avatar/${actor.id || actor._id || actor}?updates=${avatarUpdates}`

  return thumb ? resize(url, avatarScale['s']) : url
}
