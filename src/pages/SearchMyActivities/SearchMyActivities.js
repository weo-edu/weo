/**
 * Imports
 */

import CreateActivityModal from 'modals/CreateActivityModal'
import EmptyState from 'components/EmptyState'
import summonSearch from 'lib/summon-search'
import {Text, Block} from 'vdux-containers'
import TileFeed from 'components/TileFeed'
import {component, element} from 'vdux'

/**
 * <SearchActivities/>
 */

export default summonSearch('myShares', 'activities')(component({
  render ({props}) {
    const {query, currentUser} = props

    return (
      <TileFeed emptyState={<EmptySearch query={query} currentUser={currentUser} />} {...props} />
    )
  }
}))

/**
 * <EmptySearch/>
 */

const EmptySearch = component({
  render ({props, actions}) {
    const {query} = props

    return (
      <EmptyState icon='assignment_ind' color='green'>
        You haven't created any activities for <Text bold>{query}</Text>
        <Block
          onClick={actions.createActivity}
          hoverProps={{underline: true}}
          color='blue'
          pointer>
          Create one now!
        </Block>
      </EmptyState>
    )
  },

  controller: {
    * createActivity ({props, context}) {
      yield context.openModal(() => <CreateActivityModal currentUser={props.currentUser} />)
    }
  }
})
