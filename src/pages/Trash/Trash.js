/**
 * Imports
 */

import RowFeed from 'components/RowFeed'
import element from 'vdux/element'
import summon from 'vdux-summon'
import {Block} from 'vdux-ui'

/**
 * <Trash/> page
 */

function render ({props}) {
  const {trash, more} = props
  const {loading, value} = trash

  return (
    <Block>
      {
        loading || <RowFeed items={value.items} more={() => more(value && value.nextPageToken)} />
      }
    </Block>
  )
}

/**
 * Exports
 */

export default summon(props => ({
  trash: `/share?channel=user!${props.currentUser._id}.trash&maxResults=20`,
  more: pageToken => ({
    trash: {
      fragment: pageToken && `&pageToken=${pageToken}`
    }
  })
}), {
  render
})
