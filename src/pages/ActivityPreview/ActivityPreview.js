/**
 * Imports
 */

import {Button, Dropdown, MenuItem} from 'vdux-containers'
import ActivitySidebar from 'components/ActivitySidebar'
import ShareDropdown from './ShareDropdown'
import Activity from 'components/Activity'
import {Block, Card, Icon} from 'vdux-ui'
import {component, element} from 'vdux'

/**
 * <ActivityPreview/>
 */

export default component({
  render ({props, actions, state}) {
    const {activity, currentUser, setSpeaking, speechRate, speakingId, selectObject, selectedObject} = props
    const isTeacher = currentUser.userType === 'teacher'

    return (
      <Block align='center start' printProps={{display: 'block'}}>
        <Block align='end start' printProps={{display: 'block'}}>
          <Card w={756} mb='l' mr relative printProps={{mb: 0, boxShadow: '0 0 0'}}>
            <Block absolute right top m={8} align='start center' printProps={{hide: true}}>
              <ShareDropdown activity={activity} btn={() => <DDButton icon='share' mr='s' />} />
              <PrintDropdown setPrintAns={actions.setPrintAns} />
            </Block>
            <Activity
              showAnswers
              selectedObject={selectedObject}
              selectObject={selectObject}
              showAnswersOnPrint={state.printAnswers}
              clickableTags={isTeacher}
              activity={activity}
              setSpeaking={setSpeaking}
              speechRate={speechRate}
              speakingId={speakingId} />
          </Card>
          <Block w={200} relative fixed={{top: 53}} printProps={{hide: true}}>
            <ActivitySidebar activity={activity} currentUser={currentUser} selectObject={selectObject} selectedObject={selectedObject} />
          </Block>
          <Block printProps={{hide: true}} w={200} />
        </Block>
      </Block>
    )
  },

  reducer: {
    setPrintAns: (state, printAnswers) => ({printAnswers})
  }
})

/**
 * <DDButton/>
 */

function DDButton ({props}) {
  return (
    <Button
      activeProps={{bgColor: 'rgba(black, .15)'}}
      hoverProps={{bgColor: 'rgba(black, .1)'}}
      color='text'
      circle={30}
      fs='s'
      {...props} />
  )
}

/**
 * <PrintDropdown/>
 */

const PrintDropdown = component({
  render ({props, actions}) {
    const {setPrintAns} = props

    return (
      <Dropdown z={2} whiteSpace='nowrap' btn={<DDButton icon='print' />} >
        <MenuItem align='start center' onClick={actions.print(setPrintAns(true))}>
          <Icon name='visibility' fs='s' color='green' mr='s' /> Show Answers
        </MenuItem>
        <MenuItem align='start center' onClick={actions.print(setPrintAns(false))}>
          <Icon name='visibility_off' fs='s' color='red' mr='s' /> Hide Answers
        </MenuItem>
      </Dropdown>
    )
  },

  controller: {
    * print (setAnswers) {
      setTimeout(() => window.print())
      yield setAnswers()
    }
  }
})
