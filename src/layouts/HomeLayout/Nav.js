/**
 * Imports
 */

import {CSSContainer, Flex, Block, Text} from 'vdux-containers'
import HomeOwl from 'components/HomeOwl'
import {component, element} from 'vdux'

/**
 * Menu
 */

const links = {
  About: 'http://about.weo.io',
  Training: 'http://about.weo.io/training/',
  Blog: 'http://about.weo.io/blog/',
  Help: 'http://about.weo.io/help/'
}

/**
 * <Nav/>
 */

export default component({
  render () {
    return (
      <Flex align='start center' flex color='white' py={2} id='home-nav'>
        <HomeOwl mr='m' />
        {
          Object
            .keys(links)
            .map(item)
        }
      </Flex>
    )
  }
})

function item (text) {
  return (
    <CSSContainer ui={Block} tag='a' target='_blank' href={links[text]} p={13} color='white' transition='color 0.1s 0s ease-in-out' hoverProps={{color: '#CCC'}} >
      <Text uppercase fw='400' lh='1em' letterSpacing='2px' antialiased>
        {text}
      </Text>
    </CSSContainer>
  )
}
