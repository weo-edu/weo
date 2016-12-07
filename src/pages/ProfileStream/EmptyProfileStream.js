/**
 * Imports
 */

import EmptyState from 'components/EmptyState'
import {component, element} from 'vdux'
import {Block, Text} from 'vdux-ui'

/**
 * <EmptyProfileStream/>
 */

export default component({
  render ({props}) {
    const {me, user} = props
    const isMe = me._id === user._id
    return (
      <EmptyState icon='cast' color='grey_medium'>
        {
          isMe
            ? <Block>
              <Text bold>You </Text> don't have any events to show yet.
            </Block>
            : <Block>
              <Text bold>{user.displayName} </Text> doesn't have any events to show yet.
            </Block>
        }
      </EmptyState>
    )
  }
})
