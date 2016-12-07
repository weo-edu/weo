/**
 * Imports
 */

import DiscardDraftModal from 'modals/DiscardDraftModal'
import PageTitle from 'components/PageTitle'
import Redirect from 'components/Redirect'
import FourOhFour from 'pages/FourOhFour'
import {component, element} from 'vdux'
import maybeOver from '@f/maybe-over'
import summon from 'vdux-summon'
import {Block} from 'vdux-ui'
import index from '@f/index'
import live from 'lib/live'
import find from '@f/find'
import Nav from './Nav'

/**
 * Constants
 */

const printProps = {pb: 0}

/**
 * <ActivityLayout/>
 */

export default summon(({userId, activityId}) => ({
  activity: {
    url: `/share/${activityId}`,
    subscribe: 'refresh_activity'
  }
}))(summon(({activity, activityId}) => ({
  setStatus: (id, status) => ({
    settingStatus: {
      url: `/instance/${id}/${status}`,
      invalidates: false,
      method: 'PUT'
    }
  }),
  students: activity.value
    ? `/group/students?group=${activity.value.contexts[0].descriptor.id}`
    : null,
  instances: activity.value
    ? `/share?channel=share!${activity.value._id}.instances`
    : null,
  getInstance: userId => ({
    gettingInstance: {
      url: `/share/${activity.value._id}/instance/${userId}`
    }
  })
}))(live(({activityId, activity, instance}) => ({
  activity: {
    url: '/share',
    params: {
      id: activityId
    }
  },
  instances: {
    url: '/share',
    params: {
      channel: `share!${activityId}.instances`
    }
  },
  students: activity.value && {
    url: '/share',
    params: {
      channel: `share!${activity.value.contexts[0].descriptor.id}`
    }
  }
}))(component({
  render (model) {
    return (
      <Block class='app' pb='60vh' printProps={printProps}>
        { internal(model) }
      </Block>
    )
  },

  * onUpdate (prev, next) {
    const {instances, students, getInstance, gettingInstance, userId} = next.props

    if (!gettingInstance && instances.value && students.value) {
      const studentMap = index(student => student._id, students.value.items)
      const insts = instances.value.items.filter(inst => studentMap[inst.actor.id])

      if (insts.length < students.value.items.length) {
        const filtered = students.value.items.filter(({_id}) => instances.value.items.every(inst => inst.actor.id !== _id))
        yield filtered.map(student => getInstance(student._id))
      } else if (userId && !instances.value.items.some(inst => inst.actor.id === userId)) {
        yield getInstance(userId)
      }
    }
  },

  controller: {
    * backBtn ({props, actions, context}) {
      const {intent, canExit, activity} = props

      if (intent === 'new') {
        yield context.openModal(() => <DiscardDraftModal onAccept={actions.discardDraftAccept} activity={activity.value} />)
      } else {
        yield canExit ? context.back() : context.setUrl(escapeUrl(props))
      }
    },

    * discardDraftAccept ({props, actions, context}) {
      yield props.canExit ? context.back() : context.setUrl('/')
    },

    * exit ({props, actions, context}, action, stay) {
      const {activity, canExit, exitDepth} = props

      if (action === 'pin' && stay) {
        yield context.setUrl(`/activity/${activity.value._id}/preview`, true)
      } else if (canExit) {
        yield exitDepth === 2 ? [context.back(), context.back()] : context.back()
      } else {
        yield context.setUrl(escapeUrl(props))
      }
    }
  },

  reducer: {
    setSpeaking: (state, speakingId) => ({speakingId}),
    setPlayState: (state, playState) => ({playState}),
    setSpeechText: (state, speechText) => ({speechText}),
    setIndicator: (state, savingIndicator) => ({savingIndicator}),
    selectObject: (state, selectedObject) => ({selectedObject})
  }
}))))

/**
 * Internal rendering method
 */

function internal ({props, children, actions, context, state}) {
  const {activity, students, instances, settingStatus, redirect, currentUser, activityId, userId, setStatus, isEdit, intent} = props
  const {value, loaded, error} = activity
  const isInstance = !!userId

  if (error || students.error) {
    return <FourOhFour />
  }

  if (!loaded || !students.loaded || !instances.loaded) {
    return ''
  }

  // Make sure we're only looking at instances of students who are
  // currently enrolled in the class
  const studentMap = index(student => student._id, students.value.items)
  const filteredInstances = instances.value.items.filter(inst => studentMap[inst.actor.id])

  if (filteredInstances.length < students.value.items.length) {
    return ''
  }

  if (isInstance && currentUser.userType === 'student' && userId !== currentUser._id) {
    return <Redirect to={`/activity/${activityId}`} />
  }

  const instance = userId
    ? find(filteredInstances, inst => inst.actor.id === userId)
    : null

  const classId = value.contexts[0].descriptor.id
  const {discussion} = value
  const isPublic = classId === 'public'
  const isClass = !isInstance && !isPublic
  const isOwner = currentUser._id === value.actor.id

  const nav = currentUser.userType === 'student'
    ? {instance: discussion, discussion}
    : {
      progress: isClass,
      overview: isClass,
      preview: !isInstance,
      discussion: (isClass && discussion) || isPublic
    }

  return [
    redirect || <Nav activity={value} isInstance={isInstance} savingIndicator={state.savingIndicator} user={currentUser} isPublic={isPublic} isEdit={isEdit} back={actions.backBtn} exit={actions.exit} isOwner={isOwner} intent={intent} {...nav} />,
    <PageTitle title={`${value.displayName}`} />,
    maybeOver({
      instance,
      activity: value,
      students: students.value.items,
      classId,
      instances: filteredInstances,
      savingIndicator: state.savingIndicator,
      setIndicator: actions.setIndicator,
      selectObject: actions.selectObject,
      selectedObject: state.selectedObject,
      setSpeaking: actions.setSpeaking,
      speakingId: state.speakingId,
      speechRate: (currentUser.preferences || {}).speech_speed || 1,
      setStatus,
      settingStatus
    }, children)
  ]
}

/**
 * Helpers
 */

function escapeUrl ({activity, currentUser}) {
  const {value} = activity

  if (value.channels[0] === 'user!' + value.actor.id + '.drafts') {
    return '/' + value.actor.username + '/boards/all'
  }

  if (value.channels[0] === 'user!' + value.actor.id + '.trash') {
    return '/' + value.actor.username + '/boards/trash'
  }

  return value.contexts[0].descriptor.id !== 'public'
    ? '/class/' + value.contexts[0].descriptor.id
    : value.actor.id === currentUser._id
      ? `/${value.actor.username}/boards/${value.contexts[1].descriptor.id}`
      : '/class/all'
}
