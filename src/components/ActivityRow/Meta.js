/**
 * Imports
 */

import {t, stopPropagation, component, element} from 'vdux'
import {Flex, Text, Block} from 'vdux-containers'
import Avatar from 'components/Avatar'
import Link from 'components/Link'
import moment from 'moment'

/**
 * Constants
 */

const underline = {underline: true}

/**
 * <Meta/>
 */

export default component({
  propTypes: {
    activity: t.Object
  },

  render ({props, context}) {
    const {activity} = props
    const {pinnedFrom} = activity

    if (!isPublic(activity)) {
      return (
        <Block color='grey_medium' fs='xxs'>
          {`Edited ${moment(activity.updatedAt || activity.createdAt).fromNow()}`}
        </Block>
      )
    }

    const actor = pinnedFrom ? pinnedFrom.actor : activity.actor
    const location = pinnedFrom ? pinnedFrom.board.displayName : actor.displayName
    const message = pinnedFrom ? 'Pinned from' : 'Created by'
    const href = pinnedFrom
      ? `/${actor.username}/boards/${pinnedFrom.board.id}`
      : `/${actor.username}`

    return (
      <Flex align='start center'>
        <Avatar pointer mr thumb actor={actor} onClick={[context.setUrl(`/${actor.username}`), stopPropagation]} />
        <Flex column fs='xxs' align='space-around' onClick={stopPropagation}>
          <Text color='text' mb='xs'>{message}</Text>
          <Link href={href} pointer hoverProps={underline} fw='bold'>
            {location}
          </Link>
        </Flex>
      </Flex>
    )
  }
})

/**
 * Helpers
 */

function isPublic (activity) {
  return !!(activity.contexts.length && activity.contexts[0].descriptor.id === 'public')
}
