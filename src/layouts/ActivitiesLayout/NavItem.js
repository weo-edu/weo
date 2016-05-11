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
      hoverProps={{highlight: 0.05, color: 'text'}}
      currentProps={{borderLeftColor: 'blue', highlight: true, color: 'text'}}>
      <Block flex align='start center'>
        {children}
      </Block>
      <Icon
        onClick={() => openModal(<BoardSettingsModal board={board} />)}
        hide={!board}
        transition='opacity 0.15s'
        fs='xs'
        opacity={showSettings ? 0.5 : 0}
        name='settings'
        hoverProps={{opacity: 1}} />
    </Link>
  )
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