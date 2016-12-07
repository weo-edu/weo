/**
 * Imports
 */

import InviteTeacherModal from 'modals/InviteTeacherModal'
import {decodeValue, component, element, t} from 'vdux'
import InfiniteScroll from 'components/InfiniteScroll'
import RoundedInput from 'components/RoundedInput'
import {Block, Flex, Icon, Grid} from 'vdux-ui'
import UserTile from 'components/UserTile'
import EmptyConnect from './EmptyConnect'
import Loading from 'components/Loading'
import {Button} from 'vdux-containers'
import summon from 'vdux-summon'
import map from '@f/map'

/**
 * Constants
 */

const inputProps = {
  textAlign: 'left'
}

/**
 * <Connect/>
 */

export default summon(({userSearch: query}) => ({
  people: {
    subscribe: 'connect_people',
    url: query
      ? `/search/people?query=${query}&maxResults=12`
      : '/user/similar?maxResults=12'
  },
  more: pageToken => ({
    people: {
      params: pageToken && {pageToken}
    }
  })
}))(component({
  propTypes: {
    currentUser: t.Object,
    userSearch: t.maybe(t.String)
  },

  render ({props, actions}) {
    const {currentUser, userSearch} = props
    const {gradeLevels = [], subjects = []} = currentUser

    return (
      <Block w='col_main' mx='auto' mt='l' py>
        <Flex align='space-between center' mb='l'>
          <RoundedInput onKeypress={{enter: decodeValue(actions.submitSearch)}} m='0' icon='search' defaultValue={userSearch} inputProps={inputProps} flex='35%' placeholder='Find teachers to follow…' />
          <Button bgColor='green' py='m' px='xl' fs='s' fw='lighter' boxShadow='z2' onClick={actions.inviteTeacher}>
            <Flex align='center center'>
              <Icon name='local_attraction' fs='l' mr='s' />
              Invite a Friend
            </Flex>
          </Button>
        </Flex>
        {
          (gradeLevels.length && subjects.length) || userSearch
            ? renderFeed(props)
            : <EmptyConnect currentUser={currentUser} refresh={props.summonInvalidate('connect_people')} />
        }
      </Block>
    )
  },

  controller: {
    * inviteTeacher ({context}) {
      yield context.openModal(() => <InviteTeacherModal />)
    },

    * submitSearch ({context, props}, value) {
      const parts = props.currentUrl.split('/').filter(Boolean)
      parts[1] = value
      yield context.setUrl('/' + parts.join('/'))
    }
  }
}))

/**
 * Helpers
 */

function renderFeed (props) {
  const {people, currentUser, more, userSearch: query} = props
  const {value, loaded, loading} = people

  if (!loaded && loading) return <Loading show h={200} />

  return (
    <Block>
      <Block hide={query} fw='200' fs='m' color='blue' p>
        Recommended Teachers
      </Block>
      <InfiniteScroll more={more(value.nextPageToken)}>
        <Grid>
          {
            loaded && value.items.length
              ? map(user =>
                <UserTile currentUser={currentUser} user={user} />, value.items)
              : <EmptyConnect search {...props} />
          }
        </Grid>
      </InfiniteScroll>
    </Block>
  )
}
