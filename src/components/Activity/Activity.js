/**
 * Imports
 */

import {statusMap, totalScore, totalPoints} from 'lib/activity-helpers'
import {getOverviewQuestions} from 'lib/activity-helpers'
import CommoncoreBadge from 'components/CommoncoreBadge'
import ActivityObject from 'components/ActivityObject'
import ActivityHeader from 'components/ActivityHeader'
import {setUrl} from 'redux-effects-location'
import handleActions from '@f/handle-actions'
import createAction from '@f/create-action'
import {Block, Text} from 'vdux-ui'
import element from 'vdux/element'
import sleep from '@f/sleep'
import map from '@f/map'

/**
 * initialState
 */

function initialState ({props}) {
  const {activity} = props

  return {
    limit: activity._object[0].attachments.length <= 10
      ? undefined
      : 10
  }
}

/**
 * onCreate
 */

function * onCreate ({props, local}) {
  yield sleep(16)
  yield local(setObjectLimit)(undefined)
}

/**
 * <Activity/>
 */

function getProps (props, context) {
  if (context.uiMedia === 'print') {
    return {...props, showAnswers: props.showAnswersOnPrint}
  }

  return props
}

function render ({props, state}) {
  const {activity, instances, clickableTags, currentUser, selectObject, selectedObject, ...rest} = props
  const {
    displayName, _object, originalDescription,
    tags, commonCore
  } = activity
  const attachments = _object[0].attachments
  let i = 0

  const renderedAttachments = state.limit === undefined
    ? attachments
    : attachments.slice(0, state.limit)

  const isInstance = activity.shareType === 'shareInstance'
  const showPollResults = activity.status >= statusMap.turnedIn
  const overviewQuestions = instances && showPollResults
    ? getOverviewQuestions(attachments, instances)
    : []

  return (
    <Block>
      {
        isInstance &&
        <Block fs='m' px='l' hide printProps={{display: 'block'}}>
          <Text bold>
            {activity.actor.displayName}
          </Text>
          <Text ml italic>
            Score:&nbsp;
            {totalScore(activity)} / {totalPoints(activity)}
          </Text>
        </Block>
      }
      <ActivityHeader
        activity={activity}
        clickableTags={clickableTags} />
      <Block>
        {
          map(object => <ActivityObject
            overviewQuestion={object.objectType === 'question' ? overviewQuestions[i] : null}
            isSelected={selectedObject === object._id}
            speechEnabled={activity.textToSpeech}
            selectObject={selectObject}
            showPollResults={showPollResults}
            currentUser={currentUser}
            activityId={activity._id}
            rootId={activity._root && activity._root[0] ? activity._root[0].id : activity._id}
            actor={activity.actor}
            object={object}
            idx={object.objectType === 'question' ? i++ : null}
            {...rest} />, renderedAttachments)
        }
      </Block>
    </Block>
  )
}

/**
 * Actions
 */

const setObjectLimit = createAction('<Activity/>: set object limit')

/**
 * Reducer
 */

const reducer = handleActions({
  [setObjectLimit]: (state, limit) => ({
    ...state,
    limit
  })
})

/**
 * Exports
 */

export default {
  initialState,
  onCreate,
  getProps,
  render,
  reducer
}
