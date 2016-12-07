/**
 * Imports
 */

import InfiniteScroll from 'components/InfiniteScroll'
import ActivityTile from 'components/ActivityTile'
import {component, element} from 'vdux'
import times from '@f/times'
import {Flex} from 'vdux-ui'
import map from '@f/map'

/**
 * <TileFeed/>
 */

export default component({
  render ({children, props}) {
    const {activities, more, emptyState, currentUser, skip, activityProps = {}, columns = 4, ...rest} = props
    const {value, loaded, loading} = activities

    return (
      <InfiniteScroll w='calc(100% + 12px)' loading={loading} more={value && more(value.nextPageToken)} {...rest}>
        {
            loaded && renderItems(value.items, emptyState, children, currentUser, skip, activityProps, columns)
          }
      </InfiniteScroll>
    )
  }
})

/**
 * Helpers
 */

function renderItems (items, emptyState, children, user, skip, activityProps, cols) {
  const columns = toColumns(items, cols, skip)

  return (
    items.length
      ? <Flex>
        {
            map((items, i) => (
              <Flex column>
                {i === 0 && children}
                {
                  map(activity => <ActivityTile user={user} activity={activity} options={getOptions(activity)} {...activityProps} />, items)
                }
              </Flex>
            ), columns)
          }
      </Flex>
      : emptyState
  )

  function getOptions (activity) {
    const isOwner = activity.actor.id === user._id
    return {
      edit: isOwner,
      like: !isOwner,
      assign: 'Assign',
      pin: true
    }
  }
}

function toColumns (items, n, skip) {
  const columns = times(n, () => [])
  const columnHeights = times(n, idx => ({idx, height: 0}))

  if (skip) columnHeights[0].height += skip

  for (let i = 0; i < items.length; i += n) {
    let heights

    // Start a new column
    if (i % n === 0) {
      heights = []
    }

    const k = Math.min(n, items.length - i)

    // Calculate the heights for each item
    for (let j = 0; j < k; j++) {
      const item = items[i + j]
      heights[j] = {item, height: estimateHeight(item)}
    }

    // Sort the heights of the columns thus far and the heights of this
    // row in opposite orders
    let ch = columnHeights.slice().sort((a, b) => a.height - b.height)
    heights.sort((a, b) => b.height - a.height)

    // Add the items into each column in opposing orders
    // of height, and then update the column heights
    for (let j = 0; j < k; j++) {
      columns[ch[j].idx].push(heights[j].item)
      ch[j].height += heights[j].height
    }
  }

  return columns
}

function estimateHeight ({image, repinCount, replies, displayName, description = '', likersLength}) {
  let height = imageHeight(image)

  if (displayName) {
    // Height of the actual displayName
    height += 23
    // Margin around the displayName/description
    height += 24
    // Margin around the displayName
    height += 12
  } else {
    // If there is no displayName, the height is 30
    height += 30
  }

  // Row height is 30 px, roughly 40 characters per row
  if (description) height += Math.ceil(description.length / 40) * 13
  if (likersLength || repinCount || replies.canonicalTotal.items) height += 14

  return height
    + 12 // Padding between bottom segment and description/title
    + 49 // Bottom segment
    + 16  // Margin top/bottom
}

function imageHeight (image = {}) {
  const {width, height} = image

  return !width || !height
    ? 0
    : Math.min((230 * height) / width, 350)
}
