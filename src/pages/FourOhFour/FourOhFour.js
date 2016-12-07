/**
 * Imports
 */

import {Text, Flex, Icon} from 'vdux-ui'
import {component, element} from 'vdux'

/**
 * <FourOhFour/>
 */

export default component({
  render ({props, context}) {
    return (
      <Flex column absolute h='90%' wide maxWidth='100%' top align='center center' pointer onClick={context.setUrl('/')} fw='200' capitalize {...props}>
        <Icon name='highlight_off' fs='160px' color='red' m />
        <Text fs='xl' mb fw='bold'>
          404.
          <Text fw='300'> Page not found.</Text>
        </Text>
        <Text fs='m'>Click to return home.</Text>
      </Flex>
    )
  }
})
