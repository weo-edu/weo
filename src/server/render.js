/**
 * Imports
 */

import {setupStylePrefixer} from 'vdux-ui'
import middleware from './middleware'
import element from 'vdux/element'
import Boot from 'components/Boot'
import uiTheme from 'lib/theme'
import vdux from 'vdux/string'
import reducer from 'reducer/'

/**
 * initialState
 */

const initialState = {}

/**
 * Render to string
 */

function render (opts) {
  return new Promise((resolve, reject) => {
    let title

    setupStylePrefixer(opts.headers['user-agent'])
    const {subscribe, render} = vdux({
      middleware: middleware(opts, _title => title = _title),
      initialState,
      reducer
    })

    const stop = subscribe(state => {
      try {
        const html = render(<Boot state={state.app} />, {
          uiTheme,
          currentUrl: state.app.url,
          avatarUpdates: state.app.avatarUpdates
        })

        if (state.app.ready) {
          stop()
          resolve({html, state, title})
        }
      } catch (err) {
        console.log('caught err', err.stack)
        reject(err)
        stop()
      }
    })
  })
}

/**
 * Exports
 */

export default render
