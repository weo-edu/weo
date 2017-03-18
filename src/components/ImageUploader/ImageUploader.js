/**
 * Imports
 */

import {Modal, ModalBody, ModalFooter, ModalHeader, Text, Block, Icon} from 'vdux-ui'
import FileUpload from 'components/FileUpload'
import Cropper from 'components/Cropper'
import {component, element} from 'vdux'
import {Button} from 'vdux-containers'
import cropImage from '@f/crop-image'

/**
 * Constants
 */

const tileWidth = 230

/**
 * <ImageUploader/>
 *
 * Props:
 *
 * - onStart(): Callback when the upload starts
 * - onError(err): Callback if there is an error; receives the error
 * - onSuccess(url): Callback executed when the crop process is complete, passed the url of the uploaded file
 */

export default component({
  * onCreate ({props, actions}) {
    yield props.setUpload(actions.submit)
  },

  render ({props, actions, context, state}) {
    const {url, loading} = state

    return (
      <Block align='center center' h='360'>
        {
          url
            ? <Cropper url={url} onCrop={actions.setCrop} />
            : <FileUpload onUpload={actions.setImage} validate={validateFile} sq={300} />
        }
      </Block>
    )
  },

  controller: {
    * submit ({props, actions, state, context}) {
      const {url, crop} = state
      let uploadUrl = url

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

      return uploadUrl
    }
  },

  reducer: {
    setImage: (state, {url}) => ({url}),
    setCrop: (state, crop) => ({crop}),
    beginLoading: () => ({loading: true}),
    endLoading: () => ({loading: false})
  }
})

/**
 * Helpers
 */

const validType = /\.(?:jpg|jpeg|gif|png)$/i

function validateFile (file) {
  if (!file) return {valid: true}

  const {size, name} = file

  if (size > 20 * 1000000) {
    return {
      valid: false,
      message: 'File too big. Must be under 20MB.'
    }
  } else if (!validType.test(name)) {
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
