/**
 * Imports
 */

import {component, element} from 'vdux'
import {Button} from 'vdux-containers'
import {Modal} from 'vdux-ui'
import qs from 'qs'

/**
 * <VideoModal/>
 */

export default component({
  render ({props, context}) {
    const {videoId, options} = props
    const url = 'https://www.youtube.com/embed/' + videoId + '?' + qs.stringify(options)

    return (
      <Modal absolute onDismiss={context.closeModal} bg='#000' w='64vw' h='36vw' top bottom m='auto' left right overlayProps={{bg: 'rgba(#000, .7)'}}>
        <Button icon='close' absolute bottom='100%' right fs='s' mb opacity='.75' hoverProps={{opacity: 1}} transition='opacity .15s' onClick={context.closeModal} />
        <iframe frameborder='0' allowfullscreen src={url} width='100%' height='100%' />
      </Modal>
    )
  }
})
