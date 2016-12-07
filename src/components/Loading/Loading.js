/**
 * Imports
 */

import {component, element} from 'vdux'
import {Block, Spinner} from 'vdux-ui'

/**
 * <Loading/>
 */

export default component({
  render ({props}) {
    const {show, dark = true} = props
    return (
      <Block align='center center' hide={!show} {...props}>
        <Spinner circle='18' dark={dark} />
      </Block>
    )
  }
})
