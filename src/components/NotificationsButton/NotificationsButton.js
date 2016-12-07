/**
 * Imports
 */

import {component, element} from 'vdux'
import {Block} from 'vdux-containers'
import Link from 'components/Link'
import {Icon} from 'vdux-ui'

/**
 * <NotificationsButton/>
 */

export default component({
  render ({props}) {
    const {currentUser, ...rest} = props
    const {notifications = {}} = currentUser
    const {canonicalTotal = {}} = notifications
    const total = (canonicalTotal.items || 0) - (currentUser.readNotifications || 0)
    const cSize = '15px'

    return (
      <Link pointer fs='m' px='s' href='/notifications' align='center center' {...rest} relative>
        <Icon name='notifications' fs='m' />
        <Block
          absolute
          top='-6'
          right='-3'
          textAlign='center'
          hide={!total}
          circle={cSize}
          lh={cSize}
          fs='10'
          bg='red'>{total > 99 ? '99+' : total }</Block>
      </Link>
    )
  }
})
