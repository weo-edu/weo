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
    const {icon, weoIcon, color, ...rest} = props
    return (
      <Block p textAlign='center' w='col_main' {...rest}>
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
