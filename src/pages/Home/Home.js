/**
 * Imports
 */

import {component, element} from 'vdux'
import {Flex, Box, Text} from 'vdux-ui'
import {Button} from 'vdux-containers'
import Content from './Content'

/**
 * Constants
 */

const btnProps = {
  pill: true,
  my: 's',
  wide: true,
  boxShadow: 'z3'
}

/**
 * <Home/>
 */

export default component({
  render ({props, context}) {
    return (
      <Flex column align='center center' color='white' maxWidth={714} textAlign='center'>
        <Content />
        <Flex align='center center' my='m' mx='s' pt='m' wide>
          <Box flex='35%' mx='s'>
            <Button {...btnProps} bgColor='green' onClick={context.setUrl('/teacher')}>
              <Text lh='47px' fs='14px' fw='bolder'>
                Teachers, Sign Up
              </Text>
            </Button>
          </Box>
          <Box flex='35%' mx='s'>
            <Button {...btnProps} onClick={context.setUrl('/student')}>
              <Text lh='47px' fs='14px' fw='bolder'>
                Students, Join Class
              </Text>
            </Button>
          </Box>
        </Flex>
      </Flex>
    )
  }
})
