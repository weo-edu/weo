/**
 * Imports
 */

import Schema from '@weo-edu/schema'

/**
 * School schema
 */

const name = Schema('string')
  .min(3, 'Name must be at least 3 characters long')


const school = Schema()
  .prop('name', name)
  .prop('city', 'string')
  .prop('state', 'string')
  .required(['name'])

/**
 * Exports
 */

export default school
