/**
 * Imports
 */

import {component, element} from 'vdux'
import {Button} from 'vdux-containers'
import {IconButton} from 'vdux-ui'

/**
 * Assets
 */

const cloudFS = require('cloud-fs')
const msIcon = cloudFS.url('./office365.png')

/**
 * <FacebookOAuthButton/>
 */

export default component({
  render ({props, children}) {
    return (
      <Button ui={IconButton} fs='12px' img={msIcon} iconSize='18px' pl='8px' bgColor='white' color='microsoft_red' {...props}>
        {children}
      </Button>
    )
  }
})
