/**
 * Imports
 */

import 'regenerator-runtime/runtime'
import Boot from 'components/Boot'
import logger from 'weo-logger'
import vdux from 'vdux/string'
import {element} from 'vdux'
import page from './page'

/**
 * Logging service
 */

logger(process.env.APP_NAME || 'weo')

/**
 * Render to string
 */

function render (opts) {
  return vdux(() => <Boot req={opts} />, {awaitReady: true})
    .then(page, handleError)
}

/**
 * Helpers
 */

function handleError (err) {
  console.log('caught err', err)
  throw err
}

/**
 * Exports
 */

export default render
