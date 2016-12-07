/**
 * Imports
 */

import Schema from '@weo-edu/schema'

/**
 * Board schema
 */

const displayName = Schema('string')
  .max(20, 'Board names must be shorter than 20 characters long')
  .min(1, 'Board name is required')

const board = Schema()
  .prop('displayName', displayName)
  .required(['displayName'])

/**
 * Exports
 */

export default board
