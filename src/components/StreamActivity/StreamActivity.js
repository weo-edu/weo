/**
 * Imports
 */

import {component, element} from 'vdux'
import ObjectIcon from './ObjectIcon'
import {Card, Block} from 'vdux-ui'
import Link from 'components/Link'
import moment from 'moment'

/**
 * <StreamActivity/>
 */

export default component({
  render ({props}) {
    const {activity} = props
    const [object] = activity._object
    const actor = object.actor || activity.actor

    return (
      <Card wide align='space-between center' borderBottom='rgba(52, 52, 52, 0.05)'>
        <Block align='start center' ml my>
          <ObjectIcon object={object} my={-3} mr />
          <Link bold href={`/${actor.username}`}>
            {actor.displayName}
          </Link>
          &nbsp;
          {verb(object)}
          &nbsp;
          {target(object)}
        </Block>
        <Block mr color='grey_medium' fs='xxs'>
          {moment(activity.createdAt).fromNow()}
        </Block>
      </Card>
    )
  }
})

/**
 * Helpers
 */

function verb ({displayName, status}) {
  switch (displayName || status) {
    case 'followed_board': return 'followed'
    case 'followed_user': return 'followed'
    case 'joined_class': return 'joined'
    case 'commented': return 'commented on'
    case 'annotated': return 'left you a note on'
    default: return displayName
      ? 'changed'
      : status
  }
}

function target (object) {
  if (object.object) {
    return (
      <Link href={getHref(object)} color='blue' hoverProps={{underline: true}}>
        {object.object.displayName}
      </Link>
    )
  }

  return uncamel(object.displayName)
}

function getHref (object) {
  const baseLink = object.object.url

  if (isActivity(object)) {
    if (isInClass(object)) {
      return object.meta.student
        ? `${baseLink}instance/${object.meta.student.id}/`
        : `${baseLink}${object.meta.id}/`
    }

    return baseLink + 'preview'
  }

  return baseLink
}

function isActivity (object) {
  return object.object.url.indexOf('/activity') === 0
}

function isInClass (object) {
  if (!object.meta || typeof object.meta !== 'object' || typeof object.meta.url !== 'string') {
    return false
  }
  return object.meta.url.indexOf('/class/') >= 0 || object.meta.url.indexOf('/group/') >= 0
}

function uncamel (str) {
  return str && str.replace(/([A-Z])/g, ' $1').toLowerCase()
}
