/**
 * Imports
 */

import {Modal, ModalBody, ModalFooter, ModalHeader, Text, Block, Icon} from 'vdux-ui'
import AvatarPickerModal from 'modals/AvatarPickerModal'
import ImageUploader from 'components/ImageUploader'
import FileUpload from 'components/FileUpload'
import Cropper from 'components/Cropper'
import {component, element} from 'vdux'
import {Button} from 'vdux-containers'
import cropImage from '@f/crop-image'
import summon from 'vdux-summon'

/**
 * Constants
 */

const tileWidth = 230

/**
 * <AvatarUploadModal/>
 */

export default summon(props => ({
  changeAvatar: avatar => ({
    changingAvatar: {
      url: '/avatar/',
      method: 'PUT',
      body: {
        url: avatar
      }
    }
  })
}))(component({
  render ({props, actions, context, state}) {
    const {url, loading} = state

    return (
      <Modal onDismiss={context.closeModal}>
        <ModalBody pb>
          <ModalHeader>
            Upload An Image
          </ModalHeader>
          <ImageUploader setUpload={actions.setUpload} />
        </ModalBody>
        <ModalFooter bg='grey'>
          <Block flex>
            <Button bgColor='black' mr='s' fs='xs' h='30' px='25' onClick={actions.openPicker}>
              <Icon name='keyboard_arrow_left' fs='s' mr='s' />
              Back
            </Button>
          </Block>
          <Text fs='xxs'>
            <Text pointer underline onClick={context.closeModal}>cancel</Text>
            <Text mx>or</Text>
          </Text>
          <Button onClick={actions.submit} busy={loading}>Update</Button>
        </ModalFooter>
      </Modal>
    )
  },

  controller: {
    * openPicker ({context, props}) {
      yield context.openModal(() => <AvatarPickerModal user={props.user} />)
    },

    * submit ({props, context, state, actions}) {
      yield actions.beginLoading()
      const url = yield state.upload()
      yield props.changeAvatar(url)
      yield context.closeModal()
      yield context.updateAvatar()
      yield actions.endLoading()
    }
  },

  reducer: {
    setUpload: (state, upload) => ({upload}),
    beginLoading: () => ({loading: true}),
    endLoading: () => ({loading: false})
  }
}))
