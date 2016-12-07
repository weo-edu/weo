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
const gplusIcon = cloudFS.url('./gplusIcon.png')

/**
 * <GoogleOAuthButton/>
 */

export default component({
  render ({props, children}) {
    return (
      <Button ui={IconButton} fs='12px' img={gplusIcon} bgColor='google_red' {...props}>
        {children}
      </Button>
    )
  }
})
