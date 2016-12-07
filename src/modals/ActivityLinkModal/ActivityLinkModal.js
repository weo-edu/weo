/**
 * Imports
 */

import {Modal, ModalHeader, Block, Text} from 'vdux-ui'
import BlockInput from 'components/BlockInput'
import {component, element} from 'vdux'
import summon from 'vdux-summon'

/**
 * <ActivityLinkModal/>
 */

export default summon(({activity}) => {
  const id = activity.contexts[0].descriptor.id
  return {
    group: id === 'public' ? null : `/group/${id}`
  }
})(component({
  render ({actions, props, context}) {
    const {activity, group} = props
    const {value, loading} = group
    const isPublic = activity.contexts[0].descriptor.id === 'public'
    if (!isPublic && loading) return <span />

    const url = `${window.location.origin}/activity/${activity._id}`

    return (
      <Modal onDismiss={context.closeModal} pb='l'>
        <ModalHeader w='col_s' m='auto'>
          Activity Link
        </ModalHeader>
        <Block w='col_s' mx='auto' mb='l'>
          <Block mb='l' fs='s' color='grey_medium' textAlign='center'>
            {
              isPublic
                ? <Block>
                    Copy the link below to share this activity with your colleagues.
                </Block>
                : <Block>
                    Copy the link below to share this activity with the students in your
                  <Text color='blue' bold> {value.displayName} </Text>
                    class.
                </Block>
            }
          </Block>
          <BlockInput readonly autofocus onFocus={{selectTarget: true}} value={url} />
        </Block>
      </Modal>
    )
  }
}))
