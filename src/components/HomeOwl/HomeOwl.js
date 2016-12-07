/**
 * Imports
 */

import {component, element} from 'vdux'
import {Flex} from 'vdux-ui'

/**
 * Assets
 */

const cloudFS = require('cloud-fs')
const logo120 = cloudFS.url('./logo120x120.png')

/**
 * <HomeOwl/>
 */

export default component({
  render ({props}) {
    const {link = true, width = 28, ...rest} = props
    const owlProps = link ? {tag: 'a', href: '/'} : {}

    return (
      <Flex align='start center' w={width} {...owlProps} {...rest}>
        <img src={logo120} width={width} />
      </Flex>
    )
  }
})
