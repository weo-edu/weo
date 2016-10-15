/**
 * Imports
 */

import QuestionAttachment from 'components/QuestionAttachment'
import QuestionComments from 'components/QuestionComments'
import {debounceAction, Button} from 'vdux-containers'
import TextToSpeech from 'components/TextToSpeech'
import EditableQuestion from './EditableQuestion'
import handleActions from '@f/handle-actions'
import createAction from '@f/create-action'
import {Block, Badge, Icon} from 'vdux-ui'
import element from 'vdux/element'
import getProp from '@f/get-prop'
import summon from 'vdux-summon'
import map from '@f/map'

/**
 * initialState
 */

function initialState ({props}) {
  const {object, submitAnswer} = props

  return {
    answer: object.response,
    debouncedSubmit: debounceAction(submitAnswer, 500)
  }
}

/**
 * <ActivityQuestion/>
 */

function render ({props, local, state}) {
  if (props.editing) return <EditableQuestion {...props} />

  const {
    actor, activityId, overview, object, idx, answerable, showAnswers, isSelected, selectObject,
    comments, showIncorrect, showComments, commentsId, currentUser, onEdit, editable, setSpeaking,
    speechRate, speakingId, speechEnabled, overviewQuestion, showPollResults, ...rest
  } = props
  const {poll, attachments = [], points, _id, content, responses, numAnswered, total} = showPollResults && object.poll
    ? overviewQuestion
    : object

  const commentList = comments && comments
    .filter(comment => getId(getProp('_object.0.location.path', comment)) === getId(_id))
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))

  const isStudent = currentUser && currentUser.userType === 'student'
  const type = getProp('0.objectType', attachments)

  return (
    <Block fw='lighter' relative class='question' onClick={!overview && (() => selectObject(object._id))} {...rest}>
      <Block id={object._id} />
      {
        !poll && comments && (!isStudent || commentList.length > 0) &&
        <QuestionComments
          absolute={{right: 0, top: 0}}
          showComments={showComments}
          currentUser={currentUser}
          commentsId={commentsId}
          comments={commentList}
          actor={actor}
          activityId={activityId}
          question={object}
          z='2'/>
      }
      {
        !poll && showIncorrect && (!points.scaled || points.scaled <= .5) &&
          <IncorrectX />
      }
      <Block align='start' py mb>
        {
          !overview &&
          <Badge bgColor={isSelected ? 'blue' : 'grey_medium'} mr='l' pt={3} size={25}>{idx + 1}</Badge>
        }
        <Block flex>
          {
            speechEnabled && object.displayName &&
            <TextToSpeech
              onStart={() => setSpeaking(object._id)}
              onEnd={() => setSpeaking()}
              rate={speechRate}
              text={object.displayName}
              current={speakingId === object._id}
              float='left'/>
          }
          {content && <Block key='a' fs='s' innerHTML={content} class='markdown' mb='l' />}
          <Block align='start' mx={overview ? 40 : 0} column={!poll && type === 'choice'}>
            {
              map(
                (att, i) => <QuestionAttachment
                  hidePollNames={showPollResults}
                  showAnswers={showAnswers}
                  speechEnabled={speechEnabled}
                  setSpeaking={setSpeaking}
                  numAnswered={numAnswered}
                  speechRate={speechRate}
                  speakingId={speakingId}
                  answerable={answerable}
                  responses={responses}
                  answer={answerable ? state.answer : object.response}
                  overview={overview || (showPollResults && object.poll)}
                  editable={editable}
                  submit={answer => [
                    state.debouncedSubmit(answer),
                    local(setAnswer)(answer)
                  ]}
                  total={total}
                  actor={actor}
                  object={att}
                  poll={poll}
                  idx={i} />,
                attachments
              )
            }
          </Block>
        </Block>
      </Block>
    </Block>
  )
}

function IncorrectX () {
  return (
    <Block
      printProps={{bgColor: 'transparent', left: -25, boxShadow: '0 0 0', borderRadius: 0}}
      absolute={{left: -40, top: 8}}
      align='center center'
      bgColor='red'
      boxShadow='0 1px 3px 0 rgba(0,0,0,0.5)'
      color='white'
      circle={32}
      m='auto'>
        <Icon
          printProps={{fs: 'l', color: 'red'}}
          name='close'
          fs='s' />
    </Block>
  )
}

function onUpdate (prev, next) {
  if (!prev.props.activityId) return
  if (prev.props.activityId !== next.props.activityId) {
    return next.local(setAnswer)(next.props.object.response)
  }
}

/**
 * Actions
 */

const setAnswer = createAction('<ActivityQuestion/>: set answer')

/**
 * Reducer
 */

const reducer = handleActions({
  [setAnswer]: (state, answer) => ({
    ...state,
    answer
  })
})

/**
 * Helpers
 */

function getId (str) {
  if (typeof str !== 'string') return
  const arr = str.split('.')
  return arr[arr.length - 1]
}

/**
 * Exports
 */

export default summon(({activityId, rootId, actor, object}) => ({
  submitAnswer: answer => ({
    answering: {
      serialize: true,
      autoretry: true,
      url: `/instance/${activityId}/question/${object._id}/response`,
      method: 'PUT',
      body: {
        answer
      }
    }
  })
}))({
  initialState,
  render,
  reducer,
  onUpdate
})
