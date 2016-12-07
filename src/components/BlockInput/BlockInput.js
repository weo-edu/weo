/**
 * Imports
 */

import {component, element} from 'vdux'
import {Input} from 'vdux-containers'

/**
 * <BlockInput/>
 */

export default component({
  render ({props}) {
    const {inputProps, ...rest} = props

    return <Input
      activeProps={{border: '1px solid rgba(37, 168, 224, 0.35)'}}
      focusProps={{border: '1px solid rgba(37, 168, 224, 0.35)'}}
      border='1px solid rgba(75, 82, 87, 0.15)'
      cursor='text'
      mb='s'
      wide
      inputProps={{
        activeProps: {border: '1px solid rgba(37, 168, 224, 0.35)'},
        focusProps: {border: '1px solid rgba(37, 168, 224, 0.35)'},
        inputProps: {bgColor: 'white', p: true, borderWidth: 0},
        border: '1px solid rgba(75, 82, 87, 0.15)',
        borderWidth: 0,
        color: '#666',
        fs: '13px',
        outline: 0,
        py: 12,
        px: 14,
        ...(inputProps || {})
      }}
      {...rest} />
  }
})
