/**
 * Imports
 */

import ActivitySidebar from 'components/ActivitySidebar'
import summonChannels from 'lib/summon-channels'
import {statusMap} from 'lib/activity-helpers'
import EmptyState from 'components/EmptyState'
import Activity from 'components/Activity'
import InstanceNav from './InstanceNav'
import {component, element} from 'vdux'
import {Button} from 'vdux-containers'
import {Block, Card} from 'vdux-ui'

/**
 * <ActivityInstance/>
 */

export default summonChannels(
  ({instance}) => `share!${instance._id}.annotations`,
  ({instance}) => ({
    setOpened: () => ({
      settingOpened: {
        url: `/instance/${instance._id}/opened`,
        method: 'PUT'
      }
    })
  })
)(component({
  * onCreate ({props}) {
    const {currentUser, instance, setOpened} = props

    if (currentUser._id === instance.actor.id && instance.status === statusMap.unopened) {
      yield setOpened()
    }
  },

  render ({props, actions, state}) {
    const {isShown} = state
    const {instance, instances, currentUser, activities, speechRate, speakingId, setSpeaking, selectObject, selectedObject} = props
    const isTeacher = currentUser.userType === 'teacher'
    const isStudent = currentUser.userType === 'student'
    const isReturned = instance.status === statusMap.returned
    const {at, status, hideOnTurnIn, showIncorrect} = instance
    const isRedo = at && at.turnedIn && (status === statusMap.opened)
    const commentsShown = state.commentsId

    const {loaded, value} = activities
    const comments = loaded ? value.items : []

    const isTurnedIn = status === statusMap.turnedIn || status === statusMap.graded
    const hideInstance = hideOnTurnIn && isStudent && isTurnedIn
    const isHidden = !isShown && isTurnedIn && isStudent

    return (
      <Block align='center start'>
        <Block
          align='end start'
          hide={isHidden}>
          <Card
            transform={`translate3d(-${commentsShown ? 50 : 0}px, 0, 0)`}
            printProps={{mb: 0, boxShadow: '0 0 0'}}
            transition='transform 0.35s'
            relative
            w={756}
            z={1}
            mb='l'
            mr>
            <PrintButton />
            <Activity
              instances={instances}
              selectObject={selectObject}
              selectedObject={selectedObject}
              showComments={actions.showComments}
              commentsId={state.commentsId}
              comments={comments}
              activity={instance}
              currentUser={currentUser}
              clickableTags={isTeacher}
              showIncorrect={instance.status === statusMap.returned || showIncorrect}
              showAnswers={isTeacher || instance.status === statusMap.returned}
              answerable={isStudent && instance.status <= statusMap.opened}
              speechRate={speechRate}
              speakingId={speakingId}
              setSpeaking={setSpeaking} />
          </Card>
          <Block
            printProps={{hide: true}}
            fixed={{top: 53}}
            transition='opacity 0.35s'
            opacity={commentsShown ? 0.07 : 1}
            pointerEvents={commentsShown ? 'none' : 'all'}
            w={200}>
            <ActivitySidebar
              selectedObject={selectedObject}
              selectObject={selectObject}
              canGrade={isTeacher && instance.status >= statusMap.turnedIn}
              canSetMax={false}
              isRedo={isRedo}
              hasInstanceNav={isTeacher}
              showIncorrect={showIncorrect}
              isStudent={isStudent}
              showScores={isTeacher || isReturned}
              activity={instance} />
            {
              isTeacher && <InstanceNav {...props} />
            }
          </Block>
          <Block w={200} printProps={{hide: true}} />
        </Block>
        <EmptyState mx='auto' color='blue' icon='file_download' mt='xl' hide={!isHidden}>
          <Block fs='m' mt mb='l'>Your Activity Has Been Turned In</Block>
          <Block fs='xs' hide={!hideInstance}>
            You can see your results after your activity has been returned.
          </Block>
          <Block underline fs='xs' pointer onClick={actions.showInstance} hide={hideInstance}>
            Click to View My Activity
          </Block>
        </EmptyState>
      </Block>
    )
  },

  reducer: {
    showComments: (state, commentsId) => ({commentsId}),
    showInstance: (state) => ({isShown: true})
  }
}))

/**
 * <PrintButton/>
 */

const PrintButton = component({
  render ({actions}) {
    return (
      <Button
        activeProps={{bgColor: 'rgba(black, .15)'}}
        hoverProps={{bgColor: 'rgba(black, .1)'}}
        onClick={actions.print}
        absolute={{right: 6, top: 6}}
        printProps={{hide: true}}
        color='text'
        icon='print'
        circle={30}
        fs='s' />
    )
  },

  controller: {
    print () {
      window.print()
    }
  }
})
