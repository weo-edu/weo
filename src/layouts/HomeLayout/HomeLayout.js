/**
 * Imports
 */

import FloatingArrow from './FloatingArrow'
import Testimonials from './Testimonials'
import CallToAction from './CallToAction'
import {component, element} from 'vdux'
import InfoBlocks from './InfoBlocks'
import {Block, Flex} from 'vdux-ui'
import Header from './Header'
import Footer from './Footer'

/**
 * Assets
 */

const cloudFS = require('cloud-fs')
const desk = cloudFS.url('./files/desk.jpg')

/**
 * <HomeLayout/>
 */

export default component({
  render ({props, children}) {
    const {action} = props

    return (
      <Block bg='#FFF'>
        <Header action={action} />
        <Flex wide align='center center' bg={`url(${desk}) center /cover`} h='100vh'>
          <Block absolute top='0' bottom='0' right='0' left='0' bg='rgba(32,26,22,0.5)' z='0' />
          <Block z='1'>
            {children}
          </Block>
          <FloatingArrow z='1' />
        </Flex>
        <InfoBlocks />
        <Testimonials />
        <CallToAction />
        <Footer />
      </Block>
    )
  }
})
