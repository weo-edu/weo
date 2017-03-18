/**
 * Imports
 */

import CreateActivityModal from 'modals/CreateActivityModal'
import ActivityRow from 'components/ActivityRow'
import summonChannels from 'lib/summon-channels'
import EmptyState from 'components/EmptyState'
import RowFeed from 'components/RowFeed'
import {component, element} from 'vdux'
import {Button} from 'vdux-containers'
import {Text, Block} from 'vdux-ui'

/**
 * Constants
 */

const itemProps = {
  options: {
    edit: true,
    assign: 'Assign',
    pin: true
  }
}

/**
 * <ActivitiesBoard/> Page
 */

export default summonChannels(
  props => `group!${props.boardId}.board`, {}, 'createdAt'
)(component({
  render ({props}) {
    const {currentUser, username} = props
    const isMe = currentUser.username === username

    return (
      <RowFeed {...props} emptyState={<EmptyBoard isMe={isMe} currentUser={currentUser} />} item={ActivityRow} itemProps={itemProps} />
    )
  }
}))

/**
 * <EmptyBoard/> - Board empty state
 */

const EmptyBoard = component({
  render ({props, actions}) {
    const {isMe, currentUser} = props

    return (
      <EmptyState fill icon='dashboard' color='green' w='auto'>
        {
          isMe
            ? <Block>
                <Block fs='m' my='l'>This is your Board</Block>
                <Button
                  onClick={actions.createActivity}
                  bgColor='blue'
                  boxShadow='z2'
                  color='white'
                  px='35px'
                  lh='3em'
                  lighter
                  fs='s'
                  my>
                    Add My First Activity
                </Button>
                <Block lh='30px' textAlign='center' m pt pb='l'>
                  <Text fw='bold'>Boards </Text>
                  are collections of Activities. Save Activities to Boards to keep them organized and easy to find.
                </Block>
              </Block>
            : <Block>
                <Block fs='m' mt='l'>This Board is empty</Block>
                <Block lh='30px' textAlign='center' m pb='l'>
                  Once <Text bold>{currentUser.displayName}</Text> saves an Activity to this Board it will show up here.
                </Block>
              </Block>
          }
      </EmptyState>
    )
  },

  controller: {
    * createActivity ({context, props}) {
      yield context.openModal(() => <CreateActivityModal currentUser={props.currentUser} />)
    }
  }
})
