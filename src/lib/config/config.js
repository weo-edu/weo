/**
 * Modules
 */

require('envitro')(require('../../../package.json'))

import optstack, {env} from 'opt-stack'

/**
 * Config
 */

const config = optstack(env(), {
  apiServer: String,
  avatarServer: String,
  imageResize: String
})

if (process.env.NODE_ENV === 'production') {
  config.favicon = require('lib/favicon/favicon.ico')
} else {
  config.favicon = require('lib/favicon/favicon-dev.ico')
}


/**
 * Exports
 */

module.exports = config
