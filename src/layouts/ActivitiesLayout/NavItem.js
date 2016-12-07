/**
 * Imports
 */

import BoardSettingsModal from 'modals/BoardSettingsModal'
import {CSSContainer, Icon, wrap} from 'vdux-containers'
import {stopPropagation, component, element} from 'vdux'
import {MenuItem, Block} from 'vdux-ui'
import Link from 'components/Link'

/**
 * Constants
 */

const hoverProps = {color: 'text'}
const currentProps = {borderLeftColor: 'blue', highlight: 0.05, color: 'test'}

/**
 * <NavItem/> in <ActivitiesLayout/>
 */

export default wrap(CSSContainer, {
  hoverProps: {
    showSettings: true
  }
})(component({
  render ({props, children, actions}) {
    const {showSettings, board, isMe, ...rest} = props

    return (
      <Link
        fw='bold'
        display='flex'
        color='grey_medium'
        ui={MenuItem}
        {...rest}
        py='m'
        borderLeft='3px solid transparent'
        hoverProps={hoverProps}
        currentProps={currentProps}>
        <Block flex align='start center' ellipsis>
          {children}
        </Block>
        <Icon
          onClick={[stopPropagation, actions.openSettings]}
          hide={!board || !isMe}
          transition='opacity 0.15s'
          fs='xs'
          opacity={showSettings ? 0.5 : 0}
          name='settings'
          hoverProps={{opacity: 1}} />
      </Link>
    )
  },

  controller: {
    * openSettings ({props, context}) {
      const {currentUser} = props
      yield context.openModal(() => <BoardSettingsModal board={props.board} exitPath={`/${currentUser.username}/boards/all`} />)
    }
  }
}))
