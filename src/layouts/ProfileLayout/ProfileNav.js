/**
 * Imports
 */

import NavTile from 'components/NavTile'
import {component, element} from 'vdux'
import {Text, Flex} from 'vdux-ui'

/**
 * <ProfileNav/>
 */

export default component({
  render ({props}) {
    const {user} = props
    const {username, following, followers} = user

    return (
      <Flex fs='xxs' align='center center' h='46px' bgColor='off_white' uppercase>
        <NavTile href={`/${username}/boards`} highlight='red'>Activities</NavTile>
        <NavTile href={`/${username}/likes`} highlight='green'>Likes</NavTile>
        <NavTile href={`/${username}/following`} highlight='blue'>
          <Text mr={3} weight='bolder' fs='xs'>{following}</Text>
          Following
        </NavTile>
        <NavTile href={`/${username}/followers`} highlight='yellow'>
          <Text mr={3} weight='bolder' fs='xs'>{followers}</Text>
          Followers
        </NavTile>
        <NavTile href={`/${username}/stream`} highlight='grey_medium'>Stream</NavTile>
      </Flex>
    )
  }
})
