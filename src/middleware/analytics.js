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

  let hasIntercom = false
  let analyticsReady = false
  const readyQueue = []

  function getConfig (user) {
    return {
      integrations: {
        All: true,
        Intercom: hasIntercom
      }
    }
  }

  window.analytics.ready(() => {
    analyticsReady = true
    readyQueue.forEach(fn => fn())
    readyQueue.length = 0
  })

  return next => action => {
    if (action.type === identify.type || action.type === track.type || action.type === page.type) {
      if (analyticsReady) {
        return process(action)
      } else {
        readyQueue.push(() => process(action))
      }
    } else {
      return next(action)
    }
  }

  function process (action) {
    switch (action.type) {
      case identify.type: {
        const user = action.payload || {}

        hasIntercom = !!(user._id && user.userType === 'teacher')

        if (typeof Intercom !== 'undefined' && !hasIntercom) {
          window.Intercom('shutdown')
          window.analytics._integrations.Intercom.booted = false
        }

        window.analytics.identify(user._id, prep.user(user), getConfig(user))
        if (window.mixpanel) {
          window.mixpanel.set_config({persistence: 'localStorage'})
        }
        break
      }
      case track.type: {
        const {name, traits} = action.payload
        window.analytics.track(name, traits, getConfig())
        break
      }
      case page.type: {
        const {name, params} = action.payload
        window.analytics.page(name, params, getConfig())
        break
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
