/**
 * Imports
 */

import {component, element} from 'vdux'
import {Block} from 'vdux-ui'
import Nav from './Nav'

/**
 * App
 */

export default component({
  render ({props, children}) {
    return (
      <Block class='app'>
        <Nav {...props} />
        {children}
      </Block>
    )
  }
})
