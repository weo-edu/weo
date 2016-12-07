/**
 * Imports
 */

import {component, element} from 'vdux'
import {Button} from 'vdux-containers'
import {Block, Text} from 'vdux-ui'

/**
 * Assets
 */

const cloudFS = require('cloud-fs')
const schoolPattern = cloudFS.url('./files/pattern.png')

/**
 * <CallToAction/>
 */

export default component({
  render ({context}) {
    return (
      <Block bg={`url(${schoolPattern}) blue`} p='100px' textAlign='center' color='white'>
        <Text fs='xl' fw='bolder' display='block'>
          Free for Teachers and Students!
        </Text>
        <Text fs='m' fw='lighter' maxWidth='700px' display='block' m='24px auto' lh='40px'>
          Save time with auto-graded assignments. Join our community and start creating and sharing activities today.
        </Text>
        <Button
          bgColor='yellow'
          boxShadow='z2'
          hoverProps={{boxShadow: 'z3', highlight: true}}
          transition='all .15s'
          p='s'
          fs='18px'
          w='200'
          onClick={context.scrollTo('header', {easing: 'easeOutCubic', duration: 500})}>Sign Up Free!</Button>
      </Block>
    )
  }
})
