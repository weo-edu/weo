/**
 * Imports
 */

import DeleteActivityModal from 'modals/DeleteActivityModal'
import OutlineButton from 'components/OutlineButton'
import {component, element} from 'vdux'

/**
 * <DeleteButton/>
 */

export default component({
  render ({props, actions}) {
    const {text, onClick = [], ...rest} = props

    return (
      <OutlineButton
        onClick={[].concat(onClick, actions.openDeleteModal)}
        color='grey_medium'
        icon='delete'
        {...rest}>
        {text}
      </OutlineButton>
    )
  },

  controller: {
    * openDeleteModal ({context, props}) {
      const {onDelete, activity} = props
      yield context.openModal(() => <DeleteActivityModal onDelete={onDelete} activity={activity} />)
    }
  }
})
