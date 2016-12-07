/**
 * Imports
 */

import InfiniteScroll from 'components/InfiniteScroll'
import EmptyState from 'components/EmptyState'
import summonSearch from 'lib/summon-search'
import BoardTile from 'components/BoardTile'
import {component, element} from 'vdux'
import Link from 'components/Link'
import {Grid, Text} from 'vdux-ui'
import map from '@f/map'

/**
 * <SearchBoards/>
 */

export default summonSearch('boards', 'boards')(component({
  render ({props}) {
    const {boards, currentUser, more, query} = props
    const {value, loaded, loading} = boards

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

function renderItems (user, items, query) {
  return (
    items.length
      ? map(board => <BoardTile currentUser={user} board={board} />, items)
      : <EmptySearch query={query} currentUser={user} />
  )
}

/**
 * <EmptySearch/>
 */

function EmptySearch ({props}) {
  const {currentUser, query} = props
  return (
    <EmptyState icon='dashboard' color='blue'>
      Sorry, we couldn't find any boards for <Text bold>{query}</Text>
      <br />
      Be the first to&nbsp;
      <Link
        href={`/${currentUser.username}/boards`}
        hoverProps={{underline: true}}
        color='blue'
        pointer>
        create your own!
      </Link>
    </EmptyState>
  )
}
