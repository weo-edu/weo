/**
 * Imports
 */

import {Dropdown, Button, MenuItem} from 'vdux-containers'
import {component, element} from 'vdux'
import summon from 'vdux-summon'
import {Block} from 'vdux-ui'

/**
 * Constants
 */

const speeds = [
  {
    displayName: 'Slowest',
    val: 0.7
  },
  {
    displayName: 'Slower',
    val: 0.8
  },
  {
    displayName: 'Normal',
    val: 1.0
  },
  {
    displayName: 'Faster',
    val: 1.5
  },
  {
    displayName: 'Fastest',
    val: 2.0
  }
]

const highlight = {highlight: 0.01}

/**
 * <ReadingSpeedDropdown/>
 */

export default summon(({currentUser}) => ({
  setSpeed: (val) => ({
    savingPreference: {
      url: '/preference/speech_speed',
      method: 'PUT',
      body: {
        value: val
      }
    }
  })
}))(component({
  render ({props}) {
    const {user, setSpeed} = props
    const {preferences = {}} = user
    const {speech_speed: speed = 1} = preferences

    return (
      <Block display='inline-block' fw='normal'>
        <Dropdown mb='l' wide btn={
          <Button
            focusProps={highlight}
            hoverProps={highlight}
            border='1px solid text'
            bgColor='white'
            color='text'
            px>
              Reading Speed:
            <Block fontFamily='monoSpace' ml='s'>
              {speed.toFixed(1) || '1.0'}
            </Block>
          </Button>
          }>
          {
            speeds.map(({displayName, val}) => <MenuItem
              onClick={setSpeed(val)}
              align='start space-between'
              fs='xs'
              py>
              <Block flex>
                {displayName}
              </Block>
              <Block fontFamily='monospace'>
                {val.toFixed(1)}
              </Block>
            </MenuItem>)
          }
        </Dropdown>
      </Block>
    )
  }
}))
