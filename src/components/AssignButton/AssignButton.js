/**
 * Imports
 */

import OutlineButton from 'components/OutlineButton'
import AssignModal from 'modals/AssignModal'
import SignUpModal from 'modals/SignUpModal'
import {component, element} from 'vdux'

/**
 * <AssignButton/>
 */

export default component({
  render ({props, actions}) {
    const {text, onClick = [], ...rest} = props

    return (
      <OutlineButton
        onClick={[].concat(onClick, actions.openModalAction)}
        color='green'
        icon='send'
        {...rest}>
        {text}
      </OutlineButton>
    )
  },

  controller: {
    * openModalAction ({context, props}) {
      const {onAssign, user, activity} = props

      yield context.openModal(() => user
        ? <AssignModal onAssign={onAssign} activity={activity} />
        : <SignUpModal />
      )
    }
  }
})
