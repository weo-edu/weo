/**
 * Imports
 */

import createAction from '@f/create-action'
import segment from 'lib/segment'
import prep from 'track-prep'

/**
 * Constants
 */

const writeKey = process.env.SEGMENT_IO_KEY

/**
 * Analytics middleware
 */

function analytics () {
  segment(writeKey)

  const config = {
    integrations: {
      All: true,
      Intercom: false
    }
  }

  function hasIntercom (user) {
    return !!(user._id && user.userType === 'teacher')
  }

  return next => action => {
    switch (action.type) {
      case identify.type: {
        const user = action.payload || {}

        if (typeof Intercom !== 'undefined' && !hasIntercom(user)) {
          window.Intercom('shutdown')
          window.analytics._integrations.Intercom.booted = false
        }

        config.integrations.Intercom = hasIntercom(user)
        window.analytics.identify(user._id, prep.user(user), config)
        break
      }
      case track.type: {
        const {name, traits} = action.payload
        window.analytics.track(name, traits)
        break
      }
      case page.type: {
        const {name, params} = action.payload
        window.analytics.page(name, params)
        break
      }
      default: {
        return next(action)
      }
    }
  }
}

/**
 * Actions
 */

const identify = createAction('analytics: identify')
const track = createAction('analytics: track')
const page = createAction('analytics: page')

/**
 * Exports
 */

export default analytics
export {
  identify,
  track,
  page
}
