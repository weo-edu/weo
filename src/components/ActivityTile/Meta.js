/**
 * Imports
 */

import CommoncoreBadge from 'components/CommoncoreBadge'
import {Flex, Box} from 'vdux-containers'
import {component, element} from 'vdux'
import Avatar from 'components/Avatar'
import Link from 'components/Link'

/**
 * Constants
 */

const underline = {underline: true}

/**
 * <Meta/>
 */

export default component({
  render ({props}) {
    const {activity} = props
    const {commonCore, actor} = activity
    const board = getBoard(activity) || {}

    return (
      <Flex align='start center'>
        <Avatar link mr='s' thumb actor={actor} />
        <Box flex ellipsis lh='18px'>
          <Flex column align='space-around' h={18 * 2}>
            <Link flex='0%' hoverProps={underline} bold href={`/${actor.username}`}>
              {actor.displayName}
            </Link>
            <Link flex='0%' hoverProps={underline} href={`/${actor.username}/boards/${board.id || board._id}`} color='grey'>
              {board.displayName}
            </Link>
          </Flex>
        </Box>
        <CommoncoreBadge hide={commonCore} />
      </Flex>
    )
  }
})

/**
 * Helpers
 */

function getBoard (activity) {
  const ctx = activity.contexts[1]
  return ctx && ctx.descriptor.id !== 'me' && ctx.descriptor
}
