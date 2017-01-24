/**
 * Imports
 */

import {Modal, ModalBody, ModalFooter, ModalHeader, Text, Block, Icon} from 'vdux-ui'
import AvatarPickerModal from 'modals/AvatarPickerModal'
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
          <Block align='center center' h='360'>
            {
              url
                ? <Cropper url={url} onCrop={actions.setCrop} />
                : <FileUpload onUpload={actions.setImage} validate={validateFile} sq={300} />
            }
          </Block>
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

    * submit ({props, actions, context, state}) {
      const {url, crop} = state
      let uploadUrl = url

      yield actions.beginLoading()

      try {
        if (crop) {
          const {x, y, width, height} = crop.detail
          const blob = cropImage(
            yield createImage(crop.target.src),
            x,
            y,
            width,
            height,
            tileWidth,
            tileWidth)

          uploadUrl = yield context.uploadFile(blob)
        }

        yield props.changeAvatar(uploadUrl)
      } finally {
        yield actions.endLoading
      }

      yield context.closeModal()
      yield context.updateAvatar()
    }
  },

  reducer: {
    setImage: (state, {url}) => ({url}),
    setCrop: (state, crop) => ({crop}),
    beginLoading: () => ({loading: true}),
    endLoading: () => ({loading: false})
  }
}))

/**
 * Helpers
 */

const validAvatarType = /\.(?:jpg|jpeg|gif|png)$/i

function validateFile (file) {
  if (!file) return {valid: true}

  const {size, name} = file

  if (size > 20 * 1000000) {
    return {
      valid: false,
      message: 'File too big. Must be under 20MB.'
    }
  } else if (!validAvatarType.test(name)) {
    return {
      valid: false,
      message: 'Invalid file type. Must be a picture.'
    }
  }

  return {valid: true}
}

function createImage (url) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = url + (url.indexOf('?') === -1 ? '?' : '&') + 'ts=' + (+new Date())
    img.onload = () => resolve(img)
  })
}
