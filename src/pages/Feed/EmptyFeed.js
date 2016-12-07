/**
 * Imports
 */

import EmptyState from 'components/EmptyState'
import {component, element} from 'vdux'
import {Button} from 'vdux-containers'
import {Block} from 'vdux-ui'

/**
 * <EmptyFeed/>
 */

export default component({
  render ({props, context}) {
    return (
      <EmptyState icon='explore' wide mt={8} mx='auto' p='24px 12px 80px' bg='grey_light' border='1px solid #D4D4D4'>
        <Block fs='m' m>Find People to Follow</Block>
        <Block fs='xs' my='l'>This is your home feed. Once you start following people, all their activities will show up here.</Block>
        <Button
          onClick={context.setUrl('/connect')}
          color='white'
          bgColor='green'
          boxShadow='z2'
          border='1px solid rgba(black, .1)'
          py='16px'
          px='40px'
          lighter
          fs='s'>
          Connect with Educators
        </Button>
      </EmptyState>
    )
  }
})
