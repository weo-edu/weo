/**
 * Imports
 */

import WeoIcon from 'components/WeoIcon'
import {component, element} from 'vdux'
import {Block, Card} from 'vdux-ui'

/**
 * <DraftsWidget/>
 */

export default component({
  render ({props, context}) {
    const {draftCount, user} = props
    const size = '25px'

    return (
      <Block align='start center' pointer p {...props} hide={!draftCount || user.userType === 'student'} onClick={context.setUrl(`/${user.username}/boards/drafts`)}>
        <WeoIcon fs='m' mr name='drafts' />
        <Block align='start center' flex>
          Drafts
          <Block circle={size} lh={size} ml fs='xxs' bg='yellow' color='white' textAlign='center'>
            {draftCount < 100 ? draftCount : '99+'}
          </Block>
        </Block>
      </Block>
    )
  }
})
