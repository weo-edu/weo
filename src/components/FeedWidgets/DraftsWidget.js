/**
 * Imports
 */

import {Block, Flex, Card} from 'vdux-ui'
import WeoIcon from 'components/WeoIcon'
import {component, element} from 'vdux'

/**
 * <DraftsWidget/>
 */

export default component({
  render ({props, context}) {
    const {draftCount, user} = props
    const size = '25px'

    return (
      <Card align='start center' pointer p {...props} hide={!draftCount} onClick={context.setUrl(`/${user.username}/boards/drafts`)}>
        <WeoIcon fs='m' mr name='drafts' />
        <Flex align='start center' flex>
          Drafts
          <Block circle={size} lh={size} ml fs='xxs' bg='yellow' color='white' textAlign='center'>
            {draftCount < 100 ? draftCount : '99+'}
          </Block>
        </Flex>
      </Card>
    )
  }
})
