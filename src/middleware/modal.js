/**
 * Imports
 */

import applyClasses from '@f/apply-classes'

/**
 * Apply classes to the body when modals are opened
 */

function middleware ({dispatch, getState}) {
  return next => action => {
    const prevState = getState()
    const result = next(action)
    const nextState = getState()

    if (!prevState.modal && nextState.modal) {
      applyClasses({modal: true}, document.body)
    } else if (prevState.modal && !nextState.modal) {
      applyClasses({modal: false}, document.body)
    }

    return result
  }
}

/**
 * Exports
 */

export default middleware
