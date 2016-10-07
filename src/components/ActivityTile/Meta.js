/**
 * Imports
 */

import CommoncoreBadge from 'components/CommoncoreBadge'
import {Flex, Box, Text, Block} from 'vdux-containers'
import Avatar from 'components/Avatar'
import element from 'vdux/element'
import Link from 'components/Link'
import {setUrl} from 'redux-effects-location'

/**
 * Meta bar
 */

function render ({props}) {
  const {activity} = props
  const {commonCore, actor} = activity
  const board = getBoard(activity) || {}

  return (
    <Flex align='start center'>
      <Avatar link mr='s' thumb actor={actor} />
      <Box flex ellipsis lh='18px'>
        <Flex column align='space-around' h={18 * 2}>
          <Link flex='0%' hoverProps={{underline: true}} bold href={`/${actor.username}`}>
            {actor.displayName}
          </Link>
          <Link flex='0%' hoverProps={{underline: true}} href={`/${actor.username}/board/${board.id || board._id}/activities`} color='grey'>
            {board.displayName}
          </Link>
        </Flex>
      </Box>
      <CommoncoreBadge hide={commonCore} />
    </Flex>
  )
}

/**
 * Helpers
 */

function getBoard (activity) {
  const ctx = activity.contexts[1]
  return ctx && ctx.descriptor.id !== 'me' && ctx.descriptor
}

/**
 * Exports
 */

export default {
  render
}
