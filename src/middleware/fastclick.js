/**
 * Fastclick middleware
 */

function middleware () {
  return next => action => {
    if (typeof window !== 'undefined' && action.type === 'INIT_FASTCLICK') {
      require('fastclick')(action.payload || document.body)
      return
    }

    return next(action)
  }
}

function initFastclick (node) {
  return {
    type: 'INIT_FASTCLICK',
    payload: node
  }
}

/**
 * Exports
 */

export default middleware
export {
  initFastclick
}
