/**
 * Imports
 */

import ActionButton from './ActionButton'
import {component, element} from 'vdux'
import {Flex, Text} from 'vdux-ui'
import Nav from './Nav'

/**
 * Constants
 */

const buttons = {
  login: <ActionButton link='/login/'>LOG IN</ActionButton>,
  signup: <ActionButton link='/'>SIGN UP</ActionButton>
}

/**
 * <HomeHeader/>
 */

export default component({
  render ({props}) {
    const {action} = props
    const button = buttons[action]

    return (
      <Flex tag='header' align='start center' wide py='4px' px='30px' z={1} flex absolute h='53px' bgColor='rgba(255, 255, 255, 0.2)'>
        <Nav />
        <Text tag='a' href='/' ml='m' color='white' fs='m' bold letterSpacing={1}>
          WEO
        </Text>
        <Flex flex align='end center'>
          {button}
        </Flex>
      </Flex>
    )
  }
})
