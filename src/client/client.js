/**
 * Imports
 */

import jss from './jss'
import 'regenerator-runtime/runtime'
import promise from 'es6-promise'
import favicon from 'lib/favicon'

Error.stackTraceLimit = 100

/**
 * Polyfills
 */

promise.polyfill()

/**
 * Boot app
 */

require('./main')
