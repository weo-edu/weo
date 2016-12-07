/**
 * Imports
 */

import {Button, Dropdown, MenuItem} from 'vdux-containers'
import {statusMap} from 'lib/activity-helpers'
import {t, component, element} from 'vdux'
import {Block, Text, Icon} from 'vdux-ui'
import RedoModal from 'modals/RedoModal'
import Confirm from 'modals/Confirm'
import summon from 'vdux-summon'

/**
 * <SidebarActions/>
 */

export default summon(({activity}) => ({
  setStatus: status => ({
    settingStatus: {
      url: `/instance/${activity._id}/${status}`,
      invalidates: false,
      method: 'PUT'
    }
  })
}))(component({
  propTypes: {
    questions: t.Array,
    count: t.Integer,
    isStudent: t.maybe(t.Boolean),
    setStatus: t.Function,
    activity: t.Object
  },

  render ({props, actions}) {
    const {
      questions, count, isStudent,
      setStatus, settingStatus = {}, activity
    } = props
    const {status} = activity
    const {loading} = settingStatus
    const canTurnIn = count === questions.length

    return (
      <Block>
        <Block hide={!isStudent || status >= statusMap.turnedIn}>
          <Block wide bgColor='grey_medium' align='center center' relative p={0} overflow='hidden' opacity='.5' rounded hide={canTurnIn} h={32} >
            <Block
              w={count / questions.length * 100 + '%'}
              absolute={{top: 0, left: 0}}
              transition='width .6s ease'
              bg='blue'
              tall />
            <Text relative z='2' color='white'>Progress: {count} of {questions.length}</Text>
          </Block>
          <Button
            hide={!canTurnIn}
            h={32}
            wide
            onClick={actions.openTurnInModal}>
            Turn In
          </Button>
        </Block>
        <Block align='start space-between' hide={isStudent}>
          <Button flex onClick={setStatus('returned')} disabled={status >= statusMap.returned || loading} busy={loading}>
            Return
          </Button>
          <Dropdown disabled={loading} btn={<Btn disabled={loading} />} w={120}>
            <MenuItem align='start center' onClick={actions.openRedoModal}>
              <Icon name='redo' mr fs='xs' />
              Redo
            </MenuItem>
            <MenuItem align='start center' onClick={setStatus('turned_in')}>
              <Icon name='file_download' mr fs='xs' />
              Collect
            </MenuItem>
          </Dropdown>
        </Block>
      </Block>
    )
  },

  controller: {
    * openRedoModal ({props, context}) {
      yield context.openModal(() => <RedoModal instanceIds={props.activity._id} />)
    },

    * openTurnInModal ({props, context}) {
      yield context.openModal(() => (
        <ConfirmTurnIn
          message='You will not be able to change answers afterwards.'
          header='Turn In Now?'
          activity={props.activity} />
      ))
    }
  }
}))

/**
 * <ConfirmTurnIn/>
 */

const ConfirmTurnIn = summon(({activity}) => ({
  onAccept: () => ({
    accepting: {
      url: `/instance/${activity._id}/turned_in`,
      method: 'PUT'
    }
  })
}))(Confirm)

/**
 * <Btn/>
 */

function Btn ({props}) {
  return (
    <Button
      activeProps={{bgColor: 'rgba(black, .1)'}}
      icon='more_vert'
      bgColor='white'
      color='text'
      circle='32'
      fs='m'
      ml
      {...props} />
  )
}
