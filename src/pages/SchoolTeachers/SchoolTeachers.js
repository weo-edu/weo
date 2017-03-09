/**
 * Imports
 */

import InviteTeacherModal from 'modals/InviteTeacherModal'
import InfiniteScroll from 'components/InfiniteScroll'
import EmptyState from 'components/EmptyState'
import PageTitle from 'components/PageTitle'
import UserTile from 'components/UserTile'
import {Block, Grid, Icon} from 'vdux-ui'
import Loading from 'components/Loading'
import {component, element} from 'vdux'
import {Button} from 'vdux-containers'
import summon from 'vdux-summon'
import map from '@f/map'

/**
 * <School Teachers/>
 */

export default summon(({userSearch: query, school}) => ({
  people: `/school/${school._id}/teachers`,
  more: pageToken => ({
    people: {
      params: pageToken && {pageToken}
    }
  })
}))(component({
  render ({props, actions}) {
  	const {people, currentUser, more, user} = props
	  const {value, loaded, loading} = people

  	if (!loaded && loading) return <Loading show h={200} />

    return (
    	<Block>
        <PageTitle title={props.school.name + ' | Teachers'} />
    		<InfiniteScroll more={more(value.nextPageToken)}>
          {
            loaded && renderItems(currentUser, user, value.items, actions.inviteTeacher)
          }
	      </InfiniteScroll>
    	</Block>
    )
  },

  controller: {
    * inviteTeacher ({context}) {
      yield context.openModal(() => <InviteTeacherModal />)
    },
  }
}))

/**
 * Helpers
 */

function renderItems (me, user, items, fn) {
  return (
    items && items.length > 1 // Don't show teachers if you're the only one
      ? <Grid mt={-8} itemsPerRow={3}>
          { map(user => <UserTile currentUser={me} user={user} />, items) }
        </Grid>
      : <EmptyState icon='school' color='blue' fill>
          No Teachers Have Joined Your School Yet
          <Button py mt='l' px='32px' boxShadow='z2' onClick={fn}>
            <Icon fs='s' name='local_activity' mr />
            Invite Colleagues
          </Button>
        </EmptyState>
  )
}