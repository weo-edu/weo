/**
 * Imports
 */

import {component, element} from 'vdux'
import Confirm from 'modals/Confirm'
import {Block, Text} from 'vdux-ui'
import summon from 'vdux-summon'

/**
 * <DeleteActivityModal/>
 */

export default summon(({activity}) => ({
  deleteActivity: () => ({
    deleting: {
      url: `/share/${activity._id}`,
      method: 'DELETE'
    }
  })
}))(component({
  render ({props, actions}) {
    const {activity, deleting} = props

    return (
      <Confirm
        accepting={deleting}
        message={<Block>Are you sure you want to delete <Text bold color='blue'> {activity.displayName}</Text>?</Block>}
        onAccept={actions.accept} />
    )
  },

  controller: {
    * accept ({props}) {
      const {deleteActivity, onDelete} = props

      yield deleteActivity()
      if (onDelete) yield onDelete()
    }
  }
}))
