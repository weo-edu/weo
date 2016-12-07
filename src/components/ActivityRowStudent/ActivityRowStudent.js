/**
 * Imports
 */

import ActivityBadge from 'components/ActivityBadge'
import ActivityRow from 'components/ActivityRow'
import {t, component, element} from 'vdux'
import getProp from '@f/get-prop'
import {Text} from 'vdux-ui'
import moment from 'moment'

/**
 * <ClassActivityRow/>
 */

export default component({
  propTypes: {
    activity: t.Object,
    currentUser: t.Object
  },

  render ({props}) {
    return (
      <ActivityRow badgeUi={StudentBadge} metaUi={StudentMeta} {...props} />
    )
  }
})

/**
 * <StudentBadge/>
 */

function StudentBadge ({props}) {
  const {activity, currentUser} = props
  const {_id, userType} = currentUser
  const status = getProp(`instances.total.0.actors.${_id}.status`, activity)

  return (
    <ActivityBadge status={status} userType={userType} mr={-1} />
  )
}

/**
 * <StudentMeta/>
 */

function StudentMeta ({props}) {
  const {activity, showClass} = props
  const {publishedAt, contexts} = activity
  const text = showClass
    ? contexts[0].descriptor.displayName
    : 'Assigned' + moment(publishedAt).fromNow()

  return (
    <Text fs='xxs' color='grey_medium'>
      {text}
    </Text>
  )
}
