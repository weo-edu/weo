/**
 * Imports
 */

import {stopPropagation, component, element} from 'vdux'
import {Flex, Text} from 'vdux-containers'
import Avatar from 'components/Avatar'
import Link from 'components/Link'

/**
 * Constants
 */

const underline = {underline: true}

/**
 * <ForkMeta/>
 */

export default component({
  render ({props, context}) {
    const {activity} = props
    const {pinnedFrom} = activity
    const actor = pinnedFrom ? pinnedFrom.actor : activity.actor
    const location = pinnedFrom ? pinnedFrom.board.displayName : actor.displayName
    const message = pinnedFrom ? 'Pinned from' : 'Created by'
    const href = pinnedFrom
      ? `/${actor.username}/boards/${pinnedFrom.board.id}`
      : `/${actor.username}`

    return (
      <Flex align='start center'>
        <Avatar pointer mr thumb actor={actor} onClick={[context.setUrl(`/${actor.username}`), stopPropagation]} />
        <Flex column fs='xxs' align='space-around'>
          <Text color='text' mb='xs'>{message}</Text>
          <Link href={href} pointer hoverProps={underline} fw='bold'>
            {location}
          </Link>
        </Flex>
      </Flex>
    )
  }
})
