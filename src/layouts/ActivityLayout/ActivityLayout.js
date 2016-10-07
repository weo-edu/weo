/**
 * Imports
 */

import DiscardDraftModal from 'modals/DiscardDraftModal'
import {back, setUrl} from 'redux-effects-location'
import handleActions from '@f/handle-actions'
import PageTitle from 'components/PageTitle'
import createAction from '@f/create-action'
import FourOhFour from 'pages/FourOhFour'
import {openModal} from 'reducer/modal'
import {invalidate} from 'vdux-summon'
import maybeOver from '@f/maybe-over'
import element from 'vdux/element'
import summon from 'vdux-summon'
import {Block} from 'vdux-ui'
import live from 'lib/live'
import Nav from  './Nav'

/**
 * initialState
 */

function initialState ({local}) {
  return {
    selectObject: local(selectObject),
    setIndicator: local(setIndicator),
    setSpeaking: local(setSpeaking)
  }
}

/**
 * Activity Layout
 */

function render ({props, children, local, state}) {
  return (
    <Block class='app' pb='60vh' printProps={{pb: 0}}>
      { internal(props, children, local, state) }
    </Block>
  )
}

function * onUpdate (prev, next) {
  const {activity, instances, students, getInstance, gettingInstance} = next.props

  if (!gettingInstance && instances.value && students.value && instances.value.items.length < students.value.items.length) {
    const filtered = students.value.items.filter(({_id}) => instances.value.items.every(inst => inst._id !== _id))
    yield filtered.map(student => getInstance(student._id))
    yield invalidate(`/share?channel=share!${activity.value._id}.instances`)
  }
}

function internal (props, children, local, state) {
  const {activity, students, instances, settingStatus, redirect, currentUser, userId, instance, setStatus, isEdit, intent} = props
  const {value, loaded, error} = activity
  const isInstance = !!userId

  if (error || students.error ||  (isInstance && instance.error)) {
    return <FourOhFour />
  }

  if (!loaded || !students.loaded || !instances.loaded || (isInstance && !instance.value)) {
    return ''
  }

  if (instances.value.items.length < students.value.items.length) {
    return ''
  }

  const classId = value.contexts[0].descriptor.id
  const {shareType, discussion} = value
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
    redirect || <Nav activity={value} isInstance={isInstance} savingIndicator={state.savingIndicator} user={currentUser} isPublic={isPublic} isEdit={isEdit} back={backBtn} exit={exit} isOwner={isOwner} intent={intent} {...nav} />,
    <PageTitle title={`${value.displayName}`} />,
    maybeOver({
      activity: value,
      instance: instance.value,
      students: students.value.items, classId,
      instances: instances.value.items,
      savingIndicator: state.savingIndicator,
      setIndicator: state.setIndicator,
      selectObject: state.selectObject,
      selectedObject: state.selectedObject,
      setSpeaking: state.setSpeaking,
      speakingId: state.speakingId,
      speechRate: currentUser.preferences.speech_speed || 1,
      setStatus,
      settingStatus
    }, children)
  ]

  function backBtn () {
    const {canExit} = props

    if (intent === 'new') {
      return openModal(() => <DiscardDraftModal onAccept={() =>canExit ? back() : setUrl('/feed')} activity={value} />)
    } else {
      return canExit ? back() : setUrl(escapeUrl())
    }
  }

  function exit () {
    const {canExit, exitDepth} = props

    if (canExit) {
      return exitDepth === 2 ? [back(), back()] : back()
    } else {
      return setUrl(escapeUrl())
    }
  }

  function escapeUrl () {
    if (value.channels[0] === 'user!' + value.actor.id + '.drafts') {
      return '/activities/drafts'
    }

    if (value.channels[0] === 'user!' + value.actor.id + '.trash') {
      return '/activities/trash'
    }

    return value.contexts[0].descriptor.id !== 'public'
      ? '/class/' + value.contexts[0].descriptor.id
      : value.actor.id === currentUser._id
        ? '/activities/' + value.contexts[1].descriptor.id
        : `/${value.actor.username}/board/${value.contexts[1].descriptor.id}/activities`
  }
}

/**
 * Actions
 */

const setSpeaking = createAction('<ActivityLayout/>: set speaking')
const setSpeechText = createAction('<ActivityLayout/>: set speech text')
const setPlayState = createAction('<ActivityLayout/>: set play state')

const setIndicator = createAction('<ActivityLayout/>: set indicator')
const selectObject = createAction('<ActivityLayout/>: select object')

/**
 * Reducer
 */

const reducer = handleActions({
  [setSpeaking]: (state, speakingId) => ({
    ...state,
    speakingId
  }),
  [setPlayState]: (state, playState) => ({
    ...state,
    playState
  }),
  [setSpeechText]: (state, speechText) => ({
    ...state,
    speechText
  }),
  [setIndicator]: (state, savingIndicator) => ({
    ...state,
    savingIndicator
  }),
  [selectObject]: (state, selectedObject) => ({
    ...state,
    selectedObject
  })
})

/**
 * Exports
 */

export default summon(({userId, activityId}) => ({
  activity: {
    url: `/share/${activityId}`,
    subscribe: 'refresh_activity'
  },
  instance: {
    url: userId
      ? `/share/${activityId}/instance/${userId}`
      : null,
    clear: false
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
  instances: {
    url: activity.value
      ? `/share?channel=share!${activity.value._id}.instances`
      : null
  },
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
  instance: {
    url: '/share',
    params: {
      id: instance.value && instance.value._id
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
}))({
  initialState,
  render,
  reducer,
  onUpdate
})))
