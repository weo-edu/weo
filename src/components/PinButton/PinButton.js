/**
 * Imports
 */

import OutlineButton from 'components/OutlineButton'
import SignUpModal from 'modals/SignUpModal'
import {component, element} from 'vdux'
import PinModal from 'modals/PinModal'

/**
 * <PinButton/>
 */

export default component({
  render ({props, actions}) {
    const {text, onClick = [], ...rest} = props

    return (
      <OutlineButton
        onClick={[].concat(onClick, actions.openModal)}
        color='blue'
        weoIcon='pin'
        {...rest}>
        {text}
      </OutlineButton>
    )
  },

  controller: {
    * openModal ({props, context}) {
      const {user, onPin, activity} = props

      yield context.openModal(() =>
            user && user._id
              ? <PinModal user={user} onPin={onPin} activity={activity} />
              : <SignUpModal />)
    }
  }
})
