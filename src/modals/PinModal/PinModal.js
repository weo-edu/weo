/**
 * Imports
 */

import {Modal, ModalFooter, ModalHeader, Block, Text, Flex, Toast} from 'vdux-ui'
import ActivityTileModaled from 'components/ActivityTileModaled'
import {Button, form} from 'vdux-containers'
import {component, element} from 'vdux'
import PinSelect from './PinSelect'
import Link from 'components/Link'
import summon from 'vdux-summon'

/**
 * <PinModal/>
 */

export default summon(() => ({
  boards: '/user/boards',
  createBoard: body => ({
    creatingBoard: {
      url: '/board/',
      method: 'POST',
      invalidates: '/user/boards',
      body
    }
  }),
  pin: (boardId, activityId, rest) => ({
    pinning: {
      url: `/share/${activityId}/pin/`,
      method: 'PUT',
      body: {
        to: [boardId],
        ...rest
      }
    }
  }),
  copyActivity: activityId => ({
    copying: {
      url: `/share/${activityId}/copy`,
      method: 'POST'
    }
  })
}))(
  form(() => ({
    fields: ['originalDescription', 'displayName']
  }))(component({
    render ({props, context, actions}) {
      const {
        activity, boards,
        createBoard, creatingBoard = {},
        pinning = {}, copying = {}
      } = props
      const {value, loaded} = boards
      const busy = creatingBoard.loading || copying.loading || pinning.loading

      if (!loaded) return <span />

      return (
        <Modal onDismiss={context.closeModal} w='620' bgColor='grey_light'>
          <Flex>
            <Block flex align='center center' py px='l'>
              <ActivityTileModaled busy={busy} activity={activity} intent='pin' />
            </Block>
            <Flex column bg='white' flex boxShadow='-1px 0 1px 0 rgba(0,0,0,0.1)' relative minHeight='400px'>
              <ModalHeader fs='s' h='56px' lh='56px' p='0' bg='off_white' borderBottom='1px solid grey_light'>
              Select a Board to Save to:
              </ModalHeader>
              <PinSelect boards={value.items} onSelectBoard={actions.doPin} createBoard={createBoard} busy={busy} absolute h='calc(100% - 56px)' top={56} wide />
            </Flex>
          </Flex>
          <ModalFooter m='0'>
            <Text fs='xxs' py='s'>
              <Text pointer underline onClick={context.closeModal}>cancel</Text>
            </Text>
          </ModalFooter>
        </Modal>
      )
    },

    controller: {
      * doPin ({actions, props, context}, board) {
        const {activity, copyActivity, onPin, fields, pin, user} = props
        const {displayName, originalDescription} = activity
        const url = `/${user.username}/boards/${board._id}`
        const model = {
          displayName: fields.displayName.value === undefined ? displayName : fields.displayName.value,
          originalDescription: fields.originalDescription.value === undefined ? originalDescription : fields.originalDescription.value
        }

        if (activity.published) {
          const copy = yield copyActivity(activity._id)
          yield pin(board._id, copy._id, model)
        } else {
          yield pin(board._id, activity._id, model)
        }

        yield context.closeModal()
        if (onPin) yield onPin(board._id)

        yield context.toast(
          <Toast key='a' onDismiss={context.hideToast}>
            <Block align='space-between center'>
              <Block ellipsis>
                Pinned to <Link onClick={context.hideToast} href={url} color='blue'>{displayName}</Link>
              </Block>
              <Button onClick={[context.setUrl(url), context.hideToast]} bgColor='green'>Go to Board</Button>
            </Block>
          </Toast>
        )
      }
    }
  })))
