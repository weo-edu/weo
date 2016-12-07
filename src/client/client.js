/**
 * Imports
 */

import 'regenerator-runtime/runtime'
import Boot from 'components/Boot'
import {element} from 'vdux'
import vdux from 'vdux/dom'

/**
 * Render loop
 */

const {forceRerender} = vdux(() => <Boot />, {
  prerendered: !!window.__initialState__,
  initialState: window.__initialState__
})

/**
 * Hot module replacement
 */

if (module.hot) {
  module.hot.decline()
  module.hot.unaccepted(() => window.location.reload(true))
  module.hot.accept(['components/Boot'], (...args) => {
    try {
      require('components/Boot')
      forceRerender()
    } catch (err) {
      console.log('hot update err', err)
      throw err
    }
  })
}
