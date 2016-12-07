/**
 * Imports
 */

import InviteTeacherModal from 'modals/InviteTeacherModal'
import InfiniteScroll from 'components/InfiniteScroll'
import EmptyState from 'components/EmptyState'
import summonSearch from 'lib/summon-search'
import UserTile from 'components/UserTile'
import {component, element} from 'vdux'
import {Text} from 'vdux-containers'
import {Grid} from 'vdux-ui'
import map from '@f/map'

/**
 * <SearchPeople/>
 */

export default summonSearch('people', 'people')(component({
  render ({props}) {
    const {people, currentUser, more, query} = props
    const {value, loaded, loading} = people

    return (
      <InfiniteScroll loading={loading} more={value && more(value.nextPageToken)}>
        {
          <Grid>
            {
              loaded && renderItems(currentUser, value.items, query)
            }
          </Grid>
        }
      </InfiniteScroll>
    )
  }
}))

/**
 * Helpers
 */

function renderItems (me, items, query) {
  return (
    items.length
      ? map(user => <UserTile currentUser={me} user={user} />, items)
      : <EmptySearch query={query} />
  )
}

/**
 * <EmptySearch/>
 */

const EmptySearch = component({
  render ({props, actions}) {
    return (
      <EmptyState icon='people' color='yellow'>
        Sorry, we couldn't find anybody by that name.<br />
        Try another search or invite&nbsp;
        <Text
          onClick={actions.inviteTeacher}
          hoverProps={{underline: true}}
          color='blue'
          pointer>
          {props.query}
        </Text>
        &nbsp;to join Weo.
      </EmptyState>
    )
  },

  controller: {
    * inviteTeacher ({context}) {
      yield context.openModal(() => <InviteTeacherModal />)
    }
  }
})
