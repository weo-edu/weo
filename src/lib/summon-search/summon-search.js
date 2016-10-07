/**
 * Imports
 */

import summon from 'vdux-summon'

/**
 * Summon search
 */

function summonSearch (type, key) {
  return summon(({query}) => ({
    [key]: `/search/${type}?query=${encodeURIComponent(query)}&maxResults=12`,
    more: pageToken => ({
      [key]: {
        params: pageToken && {
          pageToken
        }
      }
    })
  }))
}

/**
 * Exports
 */

export default summonSearch
