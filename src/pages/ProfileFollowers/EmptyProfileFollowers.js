/**
 * Imports
 */

import FollowButton from 'components/FollowButton'
import EmptyState from 'components/EmptyState'
import {component, element} from 'vdux'
import {Block, Text} from 'vdux-ui'
import Link from 'components/Link'

/**
 * <EmptyProfileLikes/>
 */

export default component({
  render ({props}) {
    const {me, user} = props
    const isMe = me._id === user._id

    return (
      <EmptyState icon='person_outline' color='yellow'>
        {
          isMe
            ? <Block>
                No one has followed <Text bold> you </Text> yet.
              <Block fs='xs' mt lh='20px' fw='normal'>
                <Link color='blue' href='/connect'>connect</Link> and start following people who pin and create things you like.
              </Block>
            </Block>
            : <Block>
              <FollowButton mx='auto' py w={175} fs='s' lighter showName user={user} boxShadow='z1' bgColor='blue' color='white' />
              <Block mt='l'>
                Be the first t<Text bold>{user.displayName}</Text>.
              </Block>
            </Block>
        }
      </EmptyState>
    )
  }
})
