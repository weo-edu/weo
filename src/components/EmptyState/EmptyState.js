/**
 * Imports
 */

import WeoIcon from 'components/WeoIcon'
import {component, element} from 'vdux'
import {Block, Icon} from 'vdux-ui'

/**
 * <EmptyState/>
 */

export default component({
  render ({props, children}) {
    const {icon, weoIcon, color, fill, ...rest} = props
    const style = fill ? {
      p: '24px 12px 80px',
      bg: 'grey_light',
      border: '1px solid #D8DADD',
      w: 'col_xl'
    } : {}

    return (
      <Block p textAlign='center' w='col_main' {...style} {...rest}>
        {
          weoIcon
            ? <WeoIcon fs='xxl' color={color} name={weoIcon} />
            : <Icon fs='xxl' color={color} name={icon} />
        }
        <Block fs='s' lighter mx='auto' w='col_m'>
          {children}
        </Block>
      </Block>
    )
  }
})
