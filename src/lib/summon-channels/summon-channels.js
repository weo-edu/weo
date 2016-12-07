/**
 * Imports
 */

import summon from 'vdux-summon'
import live from 'lib/live'

/**
 * Summon channels
 */

function summonChannels (fn, extras = {}, sort) {
  return Component => summon(props => ({
    activities: {
      url: fn(props) && `/share?${
        normalizeChannels(fn(props))
          .map(ch => `channel=${ch}`)
          .join('&')
      }&maxResults=30${sort ? '&sort=' + sort : ''}`
    },
    more: pageToken => ({
      activities: {
        params: pageToken && {
          pageToken
        }
      }
    }),
    search: query => ({
      activities: {
        clear: true,
        params: {
          query
        }
      }
    }),
    ...(typeof extras === 'function' ? extras(props) : extras)
  }))(live(props => ({
    activities: {
      url: '/share',
      params: {
        channel: fn(props)
      }
    }
  }))(Component))
}

/**
 * Helpers
 */

function normalizeChannels (ch) {
  ch = [].concat(ch)

  if (ch.length === 0) {
    ch.push('')
  }

  return ch
}

/**
 * Exports
 */

export default summonChannels
