/**
 * Imports
 */

import {Button, CSSContainer, wrap} from 'vdux-containers'
import ClassSettingsModal from 'modals/ClassSettingsModal'
import {Block, Text, MenuItem} from 'vdux-ui'
import {component, element} from 'vdux'
import Link from 'components/Link'

/**
 * <ClassItem/> component
 */

export default wrap(Link, ({cls}) => ({
  disabled: true,
  href: `/class/${cls._id}`,
  currentProps: {
    highlight: true
  }
}))(wrap(CSSContainer, {
  hoverProps: {
    showIcon: true,
    highlight: 0.05
  }
})(component({
  render ({props, actions}) {
    const {showIcon, cls, isStudent} = props
    const {_id, displayName} = cls

    return (
      <MenuItem px='0' py='0' capitalize color='text_color' align='start stretch' {...props}>
        <Link py flex align='start center' href={`/class/${_id}`} ellipsis>
          <Text circle='25' lh='25px' mx bg='green' color='white' textAlign='center'>
            {displayName[0]}
          </Text>
          <Text ellipsis capitalize inlineBlock flex>
            {displayName}
          </Text>
        </Link>
        <Button
          onClick={actions.openClassSettings}
          activeProps={{opacity: 0.7}}
          hoverProps={{opacity: 1}}
          hide={isStudent || !showIcon}
          icon='settings'
          opacity={0.7}
          color='text'
          fs='xs'
          pr
          />
      </MenuItem>
    )
  },

  controller: {
    * openClassSettings ({context, props}) {
      yield context.openModal(() => <ClassSettingsModal group={props.cls} />)
    }
  }
})))