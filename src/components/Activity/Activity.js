/**
 * Imports
 */

import {getOverviewQuestions, statusMap, totalScore, totalPoints} from 'lib/activity-helpers'
import ActivityObject from 'components/ActivityObject'
import ActivityHeader from 'components/ActivityHeader'
import {t, component, element} from 'vdux'
import {Block, Text} from 'vdux-ui'
import sleep from '@f/sleep'
import map from '@f/map'

/**
 * <Activity/>
 */

export default component({
  propTypes: {
    activity: t.Object,
    instances: t.maybe(t.Array),
    clickableTags: t.Boolean,
    currentUser: t.maybe(t.Object),
    selectObject: t.Function,
    selectedObject: t.maybe(t.String),
    showAnswersOnPrint: t.maybe(t.Boolean),
  },

  stateTypes: {
    limit: t.maybe(t.Integer)
  },

  initialState: ({props}) => ({
    limit: props.activity._object[0].attachments.length <= 10
      ? undefined
      : 10
  }),

  * onCreate ({props, actions}) {
    yield sleep(16)
    yield actions.setObjectLimit(undefined)
  },

  render ({props, state, context}) {
    const {activity, instances, clickableTags, currentUser, selectObject, selectedObject, showAnswersOnPrint, ...rest} = props
    const attachments = activity._object[0].attachments
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
        <ActivityHeader activity={activity} clickableTags={clickableTags} />
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
              showAnswers={context.uiMedia === 'print' && showAnswersOnPrint}
              {...rest} />, renderedAttachments)
          }
        </Block>
      </Block>
    )
  },

  reducer: {
    setObjectLimit: (state, limit) => ({limit})
  }
})
