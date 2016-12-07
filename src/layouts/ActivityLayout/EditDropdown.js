/**
 * Imports
 */

import DeleteActivityModal from 'modals/DeleteActivityModal'
import {Button, Dropdown, MenuItem} from 'vdux-containers'
import AssignModal from 'modals/AssignModal'
import {Block, Icon, Toast} from 'vdux-ui'
import WeoIcon from 'components/WeoIcon'
import {component, element} from 'vdux'
import PinModal from 'modals/PinModal'
import Link from 'components/Link'
import summon from 'vdux-summon'

/**
 * <EditDropdown/>
 */

export default summon(({activity}) => ({
  saveDraft: () => ({
    savingDraft: {
      url: `/share/${activity._id}/draft`,
      method: 'PUT'
    }
  })
}))(component({
  render ({props, actions}) {
    return (
      <Block align='start center' {...props}>
        <Button
          onClick={actions.openPinModal}
          borderRadius='99px 0 0 99px'
          text='Save Activity'
          bgColor='green'
          pl={18}
          h={34}
          pr />
        <Dropdown
          btn={
            <Button borderLeftWidth={0} borderRadius='0 99px 99px 0' px='s' h={34} bgColor='green'>
              <Icon name='arrow_drop_down' />
            </Button>
          }
          w={160}>
          <Item
            onClick={actions.draft}
            weoIcon='drafts'
            text='Save to Drafts'
            color='yellow' />
          <Item
            onClick={actions.openDeleteModal}
            icon='delete'
            text='Delete Activity'
            color='red' />
        </Dropdown>
      </Block>
    )
  },

  controller: {
    * draft ({props, context}) {
      const {user} = props

      yield props.saveDraft()
      yield context.back(true)

      yield context.toast(
        <Toast key='a'>
          <Block align='space-between center'>
            <Block>
              Saved to <Link onClick={context.hideToast} href={`/${user.username}/boards/drafts`} color='blue'>Drafts</Link>
            </Block>
            <Button onClick={[context.setUrl(`/${user.username}/boards/drafts`), context.hideToast]} bgColor='green'>Go to Drafts</Button>
          </Block>
        </Toast>
      )
    },

    * openAssignModal ({props, context}) {
      const {onAction, activity} = props
      yield context.openModal(() => <AssignModal
        onAssign={onAction('assign')}
        activity={activity} />)
    },

    * openPinModal ({props, context}) {
      const {onAction, activity, user} = props

      yield context.openModal(() => <PinModal onPin={onAction('pin', true)} activity={activity} user={user} />)
    },

    * openDeleteModal ({props, context}) {
      const {onAction, activity} = props
      yield context.openModal(() => <DeleteActivityModal onDelete={onAction('delete')} activity={activity} />)
    }
  }
}))

/**
 * <Item/>
 */

function Item ({props}) {
  const {icon, color, text, weoIcon, ...rest} = props
  return (
    <MenuItem align='start center' {...rest}>
      { weoIcon && <WeoIcon name={weoIcon} color={color} fs='s' mr /> }
      { icon && <Icon name={icon} color={color} fs='s' mr /> }
      {text}
    </MenuItem>
  )
}
