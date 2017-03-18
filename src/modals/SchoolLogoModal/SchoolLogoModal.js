/**
 * Imports
 */

import {Modal, ModalBody, ModalFooter, ModalHeader, Text, Block, Icon} from 'vdux-ui'
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
 * <SchoolLogoModal/>
 */

export default summon(({school}) => ({
  changeLogo: logo => ({
    changingLogo: {
      url: `/school/${school._id}/logo`,
      method: 'PUT',
      body: {
        value: logo
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
    * submit ({props, context, state, actions}) {
      yield actions.beginLoading()
      const url = yield state.upload()
      yield props.changeLogo(url)
      yield context.closeModal()
      yield actions.endLoading()
    }
  },

  reducer: {
    setUpload: (state, upload) => ({upload}),
    beginLoading: () => ({loading: true}),
    endLoading: () => ({loading: false})
  }
}))
