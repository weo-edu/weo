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
const fbIcon = cloudFS.url('./fbIcon.png')

/**
 * <FacebookOauthButton/>
 */

export default component({
  render ({props, children}) {
    return (
      <Button ui={IconButton} fs='12px' img={fbIcon} iconSize='18px' pl='8px' bgColor='facebook_blue' {...props}>
        {children}
      </Button>
    )
  }
})
