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
import {Block} from 'vdux-ui'

/**
 * Constants
 */

const itemProps = {options: {edit: true, assign: 'Assign', pin: true}}

/**
 * <MyActivities/> Page
 */

export default summonChannels(({user}) =>
  user.groups
    .filter(group => group.groupType === 'board')
    .map(board => `group!${board.id}.board`), {}, 'updatedAt'
)(component({
  render ({props}) {
    return (
      <RowFeed {...props} item={ActivityRow} itemProps={itemProps} emptyState={<EmptyBoard currentUser={props.currentUser} user={props.user} />} />
    )
  }
}))

/**
 * <EmptyBoard/> - Board empty state
 */

const EmptyBoard = component({
  render ({props, actions}) {
    const {currentUser, user} = props
    const isMine = user._id === currentUser._id

    return (
      <EmptyState p='24px 12px 24px' bg='grey_light' border='1px solid #D4D4D4' icon='assignment' color='green' w='auto'>
        {
          isMine
            ? <Block>
                <Block fs='m' my='l'>This is a list of your pinned Activities</Block>
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
                    Create My First Activity
                </Button>
                <Block lh='30px' textAlign='center' m pb='l'>
                  Activities saved to boards will appear here.
                </Block>
              </Block>
            : <Block>
                <Block fs='m' my='l'>
                  {user.displayName} has no public Activites</Block>
                <Block lh='30px' textAlign='center' m pb='l'>
                  Saved activities saved will appear here.
                </Block>
              </Block>
        }
      </EmptyState>
    )
  },

  controller: {
    * createActivity ({props, context}) {
      yield context.openModal(() => <CreateActivityModal currentUser={props.currentUser} />)
    }
  }
})
