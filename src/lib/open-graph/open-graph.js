/**
 * Imports
 */

const cloudFS = require('cloud-fs')

/**
 * Assets
 */

const image = cloudFS.url('./simple1200x620.png')

/**
 * OpenGraph Data
 */

export default {
  url: 'https://www.weo.io',
  app_id: '1662916197276541',
  title: 'Your assignments Simplified | WEO',
  image,
  site_name: 'Weo',
  type: 'website',
  description: 'Create and share educational activities with colleagues and students.'
}
