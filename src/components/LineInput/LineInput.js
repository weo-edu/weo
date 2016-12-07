/**
 * Imports
 */

import {component, element} from 'vdux'
import {Input} from 'vdux-containers'

/**
 * Input styling
 */

const inputProps = {
  borderWidth: 0,
  p: '6px 0 7px',
  color: '#666',
  fs: 'inherit',
  outline: 0,
  bgColor: 'transparent',
  appearance: 'none'
}

/**
 * <LineInput/>
 */

export default component({
  render ({props}) {
    const {disabled} = props

    return <Input
      wide
      fs='xs'
      inputProps={inputProps}
      borderStyle='solid'
      borderWidth='0 0 1px 0'
      pb='1px'
      borderColor={disabled ? 'rgba(grey_light, .6)' : 'grey_light'}
      focusProps={{
        borderBottomWidth: '2px',
        borderColor: 'blue',
        pb: 0
      }}
      {...props} />
  }
})
