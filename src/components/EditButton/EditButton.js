/**
 * Imports
 */

import OutlineButton from 'components/OutlineButton'
import {component, element} from 'vdux'
import summon from 'vdux-summon'

/**
 * <EditButton/>
 */

export default summon(({activity}) => ({
  copyActivity: () => ({
    copyingActivity: {
      url: `/share/${activity._id}/copy`,
      method: 'POST'
    }
  })
}))(component({
  render ({props, actions}) {
    const {onClick = [], text, ...rest} = props

    return (
      <OutlineButton
        onClick={[].concat(onClick, actions.handleClick)}
        color='grey_medium'
        icon='edit'
        {...rest}>
        {text}
      </OutlineButton>
    )
  },

  controller: {
    * handleClick ({context, props}) {
      const {activity, copy, intent, copyActivity} = props
      const act = copy
        ? yield copyActivity()
        : activity

      yield context.setUrl(`/activity/${act._id}/edit${intent ? '/' + intent : ''}`)
    }
  }
}))
