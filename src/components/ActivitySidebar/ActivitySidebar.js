/**
 * Imports
 */

import {questionIcon, totalPoints, totalScore, statusMap} from 'lib/activity-helpers'
import {t, component, element, decodeNode} from 'vdux'
import ActivityBadge from 'components/ActivityBadge'
import {Card, Block, Text, Icon} from 'vdux-ui'
import SidebarActions from './SidebarActions'
import Avatar from 'components/Avatar'
import {Input} from 'vdux-containers'
import {debounce} from 'redux-timing'
import Link from 'components/Link'
import summon from 'vdux-summon'
import sleep from '@f/sleep'
import moment from 'moment'

/**
 * <ActivitySidebar/>
 */

export default component({
  propTypes: {
    activity: t.Object,
    showScores: t.maybe(t.Boolean),
    setMax: t.maybe(t.Function),
    canGrade: t.maybe(t.Boolean),
    canSetMax: t.maybe(t.Boolean),
    isStudent: t.maybe(t.Boolean),
    isRedo: t.maybe(t.Boolean),
    selectObject: t.Function,
    selectedObject: t.maybe(t.String),
    hasInstanceNav: t.maybe(t.Boolean)
  },

  render ({props}) {
    const {activity, showScores, setMax, canGrade, canSetMax, isStudent, isRedo, selectObject, selectedObject, hasInstanceNav} = props
    const {actor, publishedAt, at = {}, _object, status, published} = activity
    const isInstance = activity.shareType === 'shareInstance'
    let count = 0
    const questions = _object[0].attachments
      .filter(att => {
        if (att.objectType === 'question') {
          const {response = []} = att
          count = response.length ? count + 1 : count
          return true
        }
      })

    const {descriptor} = activity.contexts[0]
    const classId = descriptor.id
    const max = totalPoints(activity)
    const score = showScores ? Math.round(activity.score * max * 10) / 10 : '-'

    return (
      <Block mt>
        <Card mb relative>
          <Block p align='start center'>
            <Avatar mr actor={actor} size={60} />
            <Block column align='start' fs='xs'>
              <Link
                hoverProps={{textDecoration: 'underline'}}
                href={`/${actor.username}`}
                mb='xs'>
                {actor.displayName}
              </Link>
              <Text my='xs' hide={classId === 'public' || isInstance || !published} color='blue'>
                {descriptor.displayName}
              </Text>
              <Text fs='12px' color='grey_medium' align='start center' hide={isInstance || !published}>
                <Icon fs='xs' name='schedule' mr='xs' />
                {moment(publishedAt || at.turnedIn).fromNow()}
              </Text>
              <Text hide={!isInstance || (activity.status < statusMap.turnedIn)} color='grey_medium' fs='12px'>
                {moment(at.turnedIn).format('M/D/YY LT')}
              </Text>
            </Block>
          </Block>
          <ActivityBadge hide={!isInstance} status={status} userType={isStudent ? 'student' : 'teacher'} text={false} absolute top right />
        </Card>
        <Card hide={!questions.length}>
          <Block p fs='l' borderBottom='1px solid grey_light' fw='lighter' align='center center' ellipsis boxShadow='0 1px 1px rgba(75,82,87,0.08)' relative z='2'>
            {score} / {max}
          </Block>
          <Block maxHeight={`calc(100vh - ${hasInstanceNav ? 420 : 326}px)`} overflow='auto' borderBottom='1px solid grey_light'>
            {
              questions.map((q, i) => <ScoreRow
                num={i + 1}
                question={q}
                setMax={setMax}
                isRedo={isRedo}
                activity={activity}
                canGrade={canGrade}
                isStudent={isStudent}
                canSetMax={canSetMax}
                selectObject={selectObject}
                isSelected={selectedObject === q._id}
                showScore={showScores} />)
            }
          </Block>
          <Block p boxShadow='0 -2px 1px rgba(grey,0.08)' relative z='2'>
            {
              isInstance &&
                <SidebarActions
                  questions={questions}
                  count={count}
                  activity={activity}
                  isStudent={isStudent} />
            }
          </Block>
        </Card>
      </Block>
    )
  }
})

/**
 * ScoreRow Constants
 */

const inputProps = {
  m: 0,
  inputProps: {
    textAlign: 'center',
    borderWidth: 0,
    bg: 'transparent'
  }
}

const focusProps = {
  borderLeftColor: 'blue',
  bg: 'off_white'
}

/**
 * <ScoreRow/>
 */

const ScoreRow = summon(() => ({
  // Note: These arguments *must* be passed into this function and
  // not taken from props, because we are going to store this
  // function in state. Which means that if/when the instance
  // changes, we need to be passing a new activityId, which
  // will not happen properly if this function takes its arguments
  // from the initial props and gets stored in state.
  setPoints: (activityId, questionId, scaled) => ({
    settingPoints: {
      url: `/instance/${activityId}/score/${questionId}`,
      method: 'PUT',
      body: {
        scaled
      }
    }
  })
}))(component({
  render ({props, actions}) {
    const {
      question, selectObject, isSelected, showScore, canGrade, isRedo,
      canSetMax, num, activity, isStudent, showIncorrect
    } = props
    const {points} = question
    const {scaled, max} = points
    const curPoints = scaled === undefined || !showScore
      ? undefined
      : max * scaled

    const color = getColor(activity, question, canGrade, isStudent, isRedo && showIncorrect)
    const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStreams

    return (
      <Block
        onFocus={isIos ? selectObject(question._id) : null}
        onClick={[
          isIos && selectObject(question._id),
          actions.scrollTo(question._id)
        ]}
        tabindex='-1'
        focusProps={{borderLeftColor: 'blue', bg: 'off_white'}}
        tag='label'
        borderLeft='3px solid transparent'
        align='space-between center'
        p='6px 12px 6px 9px'
        relative
        cursor='pointer'
        color='grey_medium'
        fw='lighter'
        fs='s'
        {...(isSelected ? focusProps : {})}>
        {num !== 1 && <Block w='calc(100% + 3px)' absolute left='-3' top borderTop='1px solid grey_light' />}
        <Text align='start center' color={color}>
          {num}. <Icon pl='s' fs='xs' name={questionIcon(question)} />
        </Text>
        {
          !question.poll && (
            <Block
              border={'1px solid transparent'}
              borderColor={canGrade || canSetMax ? 'grey_light' : 'transparent'}
              bg={canGrade || canSetMax ? 'white' : 'transparent'}
              align='start center'
              key={activity._id}
              w='50%'>
              <Input
                {...inputProps}
                onFocus={{selectTarget: true}}
                onInput={decodeNode(actions.trySetPoints)}
                disabled={!canGrade}
                color='text'
                defaultValue={curPoints}
                placeholder={canGrade ? curPoints : '-'} />
              <Text bgColor='transparent' color='black'>/</Text>
              <Input
                {...inputProps}
                onFocus={{selectTarget: true}}
                onInput={decodeNode(actions.trySetMax)}
                disabled={!canSetMax}
                color='text'
                defaultValue={max} />
            </Block>
          )
        }
      </Block>
    )
  },

  middleware: [
    debounce('debouncedSetPoints', 500)
  ],

  controller: {
    * scrollTo ({context}, id) {
      yield sleep(0)
      const node = document.getElementById(id)
      yield context.scrollTo(node, {
        easing: 'easeInOutSine',
        offsetY: -100,
        duration: 100
      })
    },

    * trySetPoints ({actions}, node) {
      node.value = normalize(node.value)
      yield actions.debouncedSetPoints(Number(node.value))
    },

    * debouncedSetPoints ({props}, points) {
      const {activity, question, setPoints} = props

      if (!isNaN(points)) {
        yield setPoints(activity._id, question._id, points / question.points.max)
      }
    },

    * trySetMax ({props}, node) {
      node.value = normalize(node.value)

      const max = Number(node.value)
      const {setMax, question} = props

      if (!isNaN(max)) {
        yield setMax(question._id, max)
      }
    }
  }
}))

/**
 * Helpers
 */

function normalize (str = '') {
  return str.replace(/[^0-9\.]/g, '').replace(/\.+/g, '.')
}

function getColor (activity, question, canGrade, isStudent, isRedo) {
  const {status} = activity
  const {points, poll, response = []} = question

  if (canGrade) {
    return poll
      ? 'grey_medium'
      : points.scaled !== undefined ? 'green' : 'yellow'
  } else if (isStudent) {
    if (status === statusMap.turnedIn || status === statusMap.graded) {
      return 'grey_medium'
    } else if (isRedo || status === statusMap.returned) {
      if (poll) return 'grey_medium'

      if (!points.scaled || points.scaled < 0.6) {
        return 'red'
      } else if (points.scaled < 1) {
        return 'yellow'
      }

      return 'green'
    } else {
      return response.length ? 'green' : 'yellow'
    }
  }
}
