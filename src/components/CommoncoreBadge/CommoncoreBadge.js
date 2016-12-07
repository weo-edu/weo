/**
 * Imports
 */

import {Tooltip} from 'vdux-containers'
import {component, element} from 'vdux'

/**
 * Assets
 */

const cloudFS = require('cloud-fs')
const badge = cloudFS.url('./ccbadge30x30.png')

/**
 * <CommoncoreBadge/>
 */

export default component({
  render ({props}) {
    return (
      <Tooltip message='Common Core Aligned' {...props}>
        <img src={badge} />
      </Tooltip>
    )
  }
})
