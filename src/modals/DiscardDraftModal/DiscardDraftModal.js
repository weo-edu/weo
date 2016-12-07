/**
 * Imports
 */

import {component, element} from 'vdux'
import Confirm from 'modals/Confirm'
import summon from 'vdux-summon'

/**
 * <DiscardDraftModal/>
 */

export default summon(({activity}) => ({
  deleteActivity: () => ({
    deleting: {
      url: `/share/${activity._id}`,
      method: 'DELETE'
    }
  })
}))(component({
  render ({actions}) {
    return (
      <Confirm
        header='Discard Draft?'
        message='You will lose your Activity if you exit without saving. Are you sure you want to delete your draft?'
        onAccept={actions.accept} />
    )
  },

  controller: {
    * accept ({props}) {
      yield props.deleteActivity()
      if (props.onAccept) yield props.onAccept()
    }
  }
}))
