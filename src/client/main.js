/**
 * Imports
 */

import {setupStylePrefixer} from 'vdux-ui'
import middleware from './middleware'
import domready from '@f/domready'
import element from 'vdux/element'
import Boot from 'components/Boot'
import fastclick from 'fastclick'
import theme from 'lib/theme'
import reducer from 'reducer'
import vdux from 'vdux/dom'
// import jss from './jss'

/**
 * Pre-rendered constants
 */

const prerendered = !! window.__initialState__
const initialState = window.__initialState__ || {}

/**
 * Initialize app
 */

const {subscribe, render, replaceReducer, dispatch, getState} = vdux({
  middleware,
  reducer,
  initialState,
  prerendered
})

// jss.attach()
window.dispatch = dispatch
setupStylePrefixer(window.navigator.userAgent)

/**
 * Render loop
 */

domready(() => {
  fastclick(document.body)
  subscribe(app)
})

function app (state, forceUpdate) {
  render(<Boot state={state.app} />, {
    uiTheme: theme,
    uiMedia: state.app.media,
    currentUrl: state.app.url,
    avatarUpdates: state.app.avatarUpdates
  }, forceUpdate)
}

/**
 * Hot module replacement
 */

if (module.hot) {
  module.hot.decline()
  module.hot.unaccepted(() => window.location.reload(true))
  module.hot.accept(['components/Boot', 'reducer'], (...args) => {
    try {
      // jss.detach()
      require('components/Boot')
      replaceReducer(require('reducer').default)
      // jss.attach()
      app(getState(), true)
    } catch (err) {
      console.log('hot update err', err)
      throw err
    }
  })
}

/**
 * Exports
 */

export default app
