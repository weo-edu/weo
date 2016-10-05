/**
 * Imports
 */

import {questionIcon, totalPoints, totalScore, statusMap} from 'lib/activity-helpers'
import {Block as ContainerBlock, debounceAction} from 'vdux-containers'
import ActivityBadge from 'components/ActivityBadge'
import {Card, Block, Text, Icon} from 'vdux-ui'
import BlockInput from 'components/BlockInput'
import SidebarActions from './SidebarActions'
import {scrollTo} from 'middleware/scroll'
import Avatar from 'components/Avatar'
import {Input} from 'vdux-containers'
import Link from 'components/Link'
import element from 'vdux/element'
import summon from 'vdux-summon'
import moment from 'moment'

/**
 * <ActivitySidebar/>
 */

function render ({props}) {
  const {activity, showScores, setMax, canGrade, canSetMax, isStudent, isRedo, selectObject, selectedObject, hasInstanceNav} = props
  const {actor, publishedAt, at = {}, _object, status, published} = activity
  const isInstance = activity.shareType === 'shareInstance'
  let count = 0
  const questions = _object[0].attachments
    .filter(att => {
      if(att.objectType === 'question') {
        const {response = []} = att
        count = response.length ? count + 1 : count
        return true
      }
    })

  const {descriptor} = activity.contexts[0]
  const classId = descriptor.id
  const score = showScores ? totalScore(activity) : '-'

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
          {score} / {totalPoints(activity)}
        </Block>
        <Block maxHeight={`calc(100vh - ${hasInstanceNav ?  420 : 326}px)`} overflow='auto' borderBottom='1px solid grey_light'>
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
        <Block p boxShadow='0 -2px 1px rgba(75,82,87,0.08)' relative z='2'>
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

/**
 * ScoreRow Constants
 */

const inputProps = {
  m: 0,
  onFocus: e => e.target.select(),
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

const ScoreRow = summon(({activity, question}) => ({
  setPoints: scaled => ({
    settingPoints: {
      url: `/instance/${activity._id}/score/${question._id}`,
      method: 'PUT',
      body: {
        scaled
      }
    }
  })
}))({
  initialState ({props}) {
    return {
      debouncedSetPoints: debounceAction(props.setPoints, 500)
    }
  },

  render ({props, state}) {
    const {
      question, selectObject, isSelected, showScore, canGrade, isRedo,
      canSetMax, num, activity, isStudent, showIncorrect, setMax
    } = props
    const {debouncedSetPoints} = state
    const {points} = question
    const {scaled, max} = points
    const curPoints = scaled === undefined || !showScore
      ? undefined
      : max * scaled


    const color = getColor(activity, question, canGrade, isStudent, isRedo && showIncorrect)
    const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStreams

    return (
      <Block
        onFocus={isIos || (() => selectObject(question._id))}
        onClick={[
          isIos && (() => selectObject(question._id)),
          () => dispatch => setTimeout(() => dispatch(scrollTo(document.getElementById(question._id), {
            easing: 'easeInOutSine',
            offsetY: -100,
            duration: 100
          })))
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
                onInput={setPoints}
                disabled={!canGrade}
                color='text'
                defaultValue={curPoints}
                placeholder={canGrade ? curPoints : '-'} />
              <Text bgColor='transparent' color='black'>/</Text>
              <Input
                {...inputProps}
                onInput={trySetMax}
                disabled={!canSetMax}
                color='text'
                defaultValue={max} />
            </Block>
          )
        }
      </Block>
    )

    function * setPoints (e) {
      e.target.value = normalize(e.target.value)
      const points = Number(e.target.value)
      if (isNaN(points)) return
      yield debouncedSetPoints(points / max)
    }

    function * trySetMax (e) {
      e.target.value = normalize(e.target.value)

      const max = Number(e.target.value)

      if (isNaN(max)) return
      yield setMax(question._id, max)
    }

    function normalize (str = '') {
      return str.replace(/[^0-9\.]/g, '').replace(/\.+/g, '.')
    }
  }
})

/**
 * Helpers
 */

function getColor (activity, question, canGrade, isStudent, isRedo) {
  const {status} = activity
  const {points, poll, response} = question

  if(canGrade) {
    return poll
      ? 'grey_medium'
      : points.scaled !== undefined ? 'green' : 'yellow'
  } else if(isStudent) {
    if(status === statusMap.turnedIn || status === statusMap.graded) {
      return 'grey_medium'
    } else if (isRedo || status === statusMap.returned) {
      if(poll) return 'grey_medium'

      if(!points.scaled || points.scaled < .6)
        return 'red'
      else if(points.scaled < 1)
        return 'yellow'

      return 'green'
    } else {
      return response.length ? 'green' : 'yellow'
    }
  }
}

/**
 * Exports
 */

export default {
  render
}
