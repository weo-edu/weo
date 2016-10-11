/**
 * Imports
 */

import BoardSettingsModal from 'modals/BoardSettingsModal'
import {CSSContainer, Icon, wrap} from 'vdux-containers'
import {openModal} from 'reducer/modal'
import {MenuItem, Block} from 'vdux-ui'
import Link from 'components/Link'
import element from 'vdux/element'

/**
 * ActivitiesLayout <NavItem/> component
 */

function render ({props, children}) {
  const {showSettings, board, ...rest} = props

  return (
    <Link
      fw='bold'
      display='flex'
      color='grey_medium'
      ui={MenuItem}
      {...rest}
      py='m'
      borderLeft='3px solid transparent'
      hoverProps={{color: 'text'}}
      currentProps={{borderLeftColor: 'blue', highlight: 0.05, color: 'text'}}>
      <Block flex align='start center' ellipsis>
        {children}
      </Block>
      <Icon
        onClick={e => openSettings(e, board)}
        hide={!board}
        transition='opacity 0.15s'
        fs='xs'
        opacity={showSettings ? 0.5 : 0}
        name='settings'
        hoverProps={{opacity: 1}} />
    </Link>
  )
}

function openSettings(e, board) {
  e.stopPropagation()
  return openModal(() => <BoardSettingsModal board={board} exitPath='/activities/all' />)
}

/**
 * Exports
 */

export default wrap(CSSContainer, {
  hoverProps: {
    showSettings: true
  }
})({
  render
})
