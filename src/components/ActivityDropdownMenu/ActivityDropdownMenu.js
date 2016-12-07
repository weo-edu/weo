/**
 * Imports
 */

import DeleteActivityModal from 'modals/DeleteActivityModal'
import {Button, Dropdown, MenuItem} from 'vdux-containers'
import AssignModal from 'modals/AssignModal'
import {t, component, element} from 'vdux'
import {Icon} from 'vdux-ui'

/**
 * <ActivityDropdownMenu/>
 */

export default component({
  propTypes: {
    activity: t.Object,
    reassign: t.maybe(t.Boolean),
    onDelete: t.maybe(t.Function)
  },

  render ({props, context, actions}) {
    const {activity, reassign = true, ...rest} = props
    const editUrl = `/activity/${activity._id}/edit`

    return (
      <Dropdown btn={<Btn {...rest} />} w={150}>
        <Item
          onClick={actions.openAssignModal}
          text='Reassign'
          hide={!reassign}
          color='green'
          icon='send' />
        <Item onClick={context.setUrl(editUrl)}
          text='Edit'
          color='blue'
          icon='edit' />
        <Item
          onClick={actions.openDeleteModal}
          icon='delete'
          text='Delete'
          color='red' />
      </Dropdown>
    )
  },

  controller: {
    * openAssignModal ({context, props}) {
      yield context.openModal(() => <AssignModal activity={props.activity} />)
    },

    * openDeleteModal ({props, context}) {
      const {onDelete, activity} = props
      yield context.openModal(() => <DeleteActivityModal onDelete={onDelete} activity={activity} />)
    }
  }
})

/**
 * <Item/>
 */

function Item ({props}) {
  const {icon, color, text, ...rest} = props
  return (
    <MenuItem align='start center' {...rest}>
      <Icon name={icon} color={color} fs='s' mr />{text}
    </MenuItem>
  )
}

/**
 * <Btn/>
 */

function Btn ({props}) {
  return (
    <Button
      activeProps={{highlight: 0.09}}
      focusProps={{highlight: 0.09}}
      hoverProps={{highlight: 0}}
      hide={props.hide}
      icon='more_vert'
      bgColor='white'
      color='text'
      circle={32}
      fs='m'
      ml='s' />
  )
}
