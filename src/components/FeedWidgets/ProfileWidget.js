/**
 * Imports
 */

import {component, element} from 'vdux'
import Avatar from 'components/Avatar'
import {Block} from 'vdux-containers'
import * as colors from 'lib/colors'
import {Flex, Card} from 'vdux-ui'
import Link from 'components/Link'

/**
 * Constants
 */

const underline = {underline: true}
const opacity = {opacity: 0.9}

/**
 * <ProfileWidget/>
 */

export default component({
  render ({props, context}) {
    const {user} = props
    const {displayName, username, color, pinCount, followers, following} = user

    return (
      <Card {...props}>
        <Block bg={color || colors.pickerColors[0]} h='60' />
        <Flex p='s'>
          <Avatar circle='75px' link actor={user} m='-37.5px 6px 0 0' boxShadow='z1' border='2px solid white' />
          <Block overflow='hidden'>
            <Link ellipsis fw='bolder' href={`/${username}/boards`} hoverProps={underline}>
              {displayName}
            </Link>
            <br />
            <Link ellsipis fs='xxs' href={`/${username}/boards`} hoverProps={underline}>
              {username}
            </Link>
          </Block>
        </Flex>
        {
          // <Flex py='s' px color='blue' fw='bolder' hide={user.userType === 'student'}>
          //   <Block flex='30%' pointer onClick={context.setUrl(`/${username}/boards`)} hoverProps={opacity}>
          //     <Block>Pins</Block>
          //     <Block>{pinCount}</Block>
          //   </Block>
          //   <Block flex='40%' pointer onClick={context.setUrl(`/${username}/following`)} hoverProps={opacity}>
          //     <Block>Following</Block>
          //     <Block>{following}</Block>
          //   </Block>
          //   <Block flex='40%' pointer onClick={context.setUrl(`/${username}/followers`)} hoverProps={opacity}>
          //     <Block>Followers</Block>
          //     <Block>{followers}</Block>
          //   </Block>
          // </Flex>
        }
      </Card>
    )
  }
})
