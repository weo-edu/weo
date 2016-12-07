/**
 * Imports
 */

import {Flex, Block, Text} from 'vdux-ui'
import {component, element} from 'vdux'
import Link from 'components/Link'
import map from '@f/map'

/**
 * Home Header
 */

export default component({
  render () {
    return (
      <Flex tag='footer' align='center center' bg='grey' color='white' p='l' relative>
        <Text color='gray'>© 2015 WEO All rights reserved</Text>
        { map(link, links) }
        <Link href='https://mixpanel.com/f/partner' rel='nofollow' absolute right='12px' top bottom h='36' m='auto' target='_blank'>
          <img src='https://cdn.mxpnl.com/site_media/images/partner/badge_light.png' alt='Mobile Analytics' />
        </Link>
      </Flex>
    )
  }
})

function link (a) {
  return (
    <Block>
      <Text px='m'>|</Text>
      <Link href={a.url} target='_blank'>{a.displayName}</Link>
    </Block>
  )
}

const links = [
  {
    displayName: 'About',
    url: 'http://about.weo.io/'
  },
  {
    displayName: 'Privacy Policy',
    url: 'http://about.weo.io/privacy'
  },
  {
    displayName: 'Terms of Service',
    url: 'http://about.weo.io/terms'
  }
]
