/**
 * Print Middleware
 *
 * This is moderately janks. Why is this necessary? Because when the print
 * media query updates, we *must* re-render the page in the current event
 * loop if we want the new page to be represented in the print preview.
 *
 * This means that vdux's normal debounced re-render is insufficient for our
 * needs in this one, highly unusual case. So, instead, we simply do an
 * explicit rerender here on our own just to support this use case.
 */

function middleware ({getState, dispatch, forceRerender}) {
  // This middleware is a noop for non-browser environments
  if (typeof window === 'undefined') {
    return next => action => next(action)
  }

  return next => action => {
    const prevState = getState()
    const result = next(action)
    const nextState = getState()

    if (prevState.media !== 'print' && nextState.media === 'print') {
      forceRerender()
    }

    return result
  }
}

/**
 * Exports
 */

export default middleware
