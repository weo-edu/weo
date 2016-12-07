/**
 * Imports
 */

import {component, element} from 'vdux'

/**
 * <PageTitle/>
 */

export default component({
  onCreate ({props, context}) {
    return context.setTitle(props.title || 'Weo')
  },

  render ({props}) {
    return <span />
  },

  onUpdate (prev, {props, context}) {
    if (prev.props.title !== props.title) {
      return context.setTitle(props.title || 'Weo')
    }
  }
})
