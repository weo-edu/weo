/**
 * Imports
 */

import {Modal, Block, Icon, Text} from 'vdux-ui'
import {component, element} from 'vdux'
import {Button} from 'vdux-containers'

/**
 * Constants
 */

const overlayPrint = {
  overflow: 'visible',
  w: '100%',
  h: 'auto',
  position: 'relative'
}

/**
 * <PrintLoginModal/>
 */

export default component({
  render ({props, actions, context}) {
    const {user} = props

    return (
      <Modal mt='0' w='800px' onDismiss={context.closeModal} pb='s' overlayProps={{printProps: overlayPrint}} printProps={{w: '100%', h: 'auto'}} relative>
        <Block p bg='grey' align='space-between' printProps={{display: 'none'}}>
          <Button bgColor='off_white' color='text' onClick={context.closeModal}>
            Cancel
          </Button>
          <Button onClick={actions.print}>
            <Icon name='print' fs='s' mr='s' /> Print
          </Button>
        </Block>
        {
            user.map((u, i) => <InfoBlock last={user.length === i + 1} user={u} />)
          }
      </Modal>
    )
  },

  controller: {
    print () {
      window.print()
    }
  }
})

/**
 * <InfoBlock/>
 */

function InfoBlock ({props}) {
  const {user, last} = props
  return (
    <Block borderBottom={!last && '1px dashed grey_medium'} p='l' pageBreakInside='avoid' relative>
      <Block border='1px solid grey_medium' align='start center' borderRadius='10'>
        <Block fs='l' color='blue' flex='35%' maxWidth='35%' overflow='hidden' textAlign='center'>
          {user.displayName}
        </Block>
        <Block tag='ol' fs='s' flex='50%'>
          <Block tag='li' mb='s'>
            Go to <Text color='blue'>weo.io/login</Text>
          </Block>
          <Block tag='li'>
            Log in with the following info:
            <Block align='start center' mt='s'>
              <Text bold flex='40%'>username:</Text>
              <Text fontFamily='monospace'>{user.username}</Text>
            </Block>
            <Block align='start center'>
              <Text bold flex='40%'>password:</Text>
              <Text fontFamily='monospace'>{user.tmpPassword || '<Your Password>'}</Text>
            </Block>
          </Block>
        </Block>
      </Block>
    </Block>
  )
}
