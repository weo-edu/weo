/**
 * Imports
 */

import EmptyState from 'components/EmptyState'
import {component, element} from 'vdux'
import {Block, Text} from 'vdux-ui'
import Link from 'components/Link'

/**
 * <EmptyProfileFollowing/>
 */

export default component({
  render ({props}) {
    const {me, user} = props
    const isMe = me._id === user._id

    return (
      <EmptyState icon='group_add' color='blue'>
        {
          isMe
            ? <Block>
              <Text bold>You </Text> aren't following anyone yet.
              <Block fs='xs' mt lh='20px' fw='normal'>
                <Link color='blue' href='/connect'>connect</Link> and start following people who pin and create things you like. This will make it easier to find more activies in the future!
              </Block>
            </Block>
            : <Block>
              <Text bold>{user.displayName} </Text> isn't following anyone yet.
            </Block>
        }
      </EmptyState>
    )
  }
})
