/**
 * Imports
 */

import {activitySort, combineInstancesAndStudents} from 'lib/activity-helpers'
import {component, element} from 'vdux'
import {Button} from 'vdux-containers'
import findIndex from '@f/find-index'
import {Block, Icon} from 'vdux-ui'

/**
 * Constants
 */

const style = {
  transition: 'flex-grow 0.35s',
  boxShadow: 'card',
  bgColor: 'white',
  borderRadius: 0,
  ellipsis: true,
  color: 'text',
  flex: true,
  px: true,
  h: 45,
  minWidth: '40px',
  hoverProps: {highlight: 0.01},
  focusProps: {outline: '1px solid rgba(blue_light, .4)'},
  activeProps: {highlight: 0}
}

/**
 * <InstanceNav/>
 */

export default component({
  render ({props, actions, state}) {
    const {instances, activity, instance, students, currentUser} = props
    const {activeBtn = 'next'} = state

    const instStudents = combineInstancesAndStudents(activity, students, instances)
    const sort = currentUser.preferences.shareStudentSort || {property: 'name.givenName', dir: 1}

    instStudents.sort(activitySort(sort))

    const idx = findIndex(instStudents, inst => inst.instanceId === instance._id)
    const prev = instStudents[idx - 1]
    const next = instStudents[idx + 1]

    const activeNext = !prev || (next && activeBtn === 'next')
    const activePrev = !activeNext

    return (
      <Block align='start' mt>
        {
          <Button
            onMouseover={actions.active('prev')}
            onClick={actions.go(prev)}
            disabled={!prev}
            mr='s'
            {...style}
            flexGrow={activePrev ? 1 : 0.0001}>
            <Icon name='chevron_left' fs='s' />
            <Block ellipsis hide={!prev || !activePrev} flex>
              {prev && prev.displayName}
            </Block>
          </Button>
        }
        {
          <Button
            onMouseover={actions.active('next')}
            onClick={actions.go(next)}
            disabled={!next}
            ml='s'
            {...style}
            flexGrow={activeNext ? 1 : 0.0001}>
            <Block ellipsis hide={!next || !activeNext} flex>
              {next && next.displayName}
            </Block>
            <Icon name='chevron_right' fs='s' />
          </Button>
        }
      </Block>
    )
  },

  controller: {
    * go ({props, actions, context}, inst) {
      const {activity} = props
      yield context.setUrl(`/activity/${activity._id}/instance/${inst.userId}`, true)
    }
  },

  reducer: {
    active: (state, activeBtn) => ({activeBtn})
  }
})
