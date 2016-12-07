/**
 * Imports
 */

import {component, element} from 'vdux'
import {Block, Base} from 'vdux-ui'
import debounce from '@f/debounce'
import Cropper from 'cropperjs'
import noop from '@f/noop'

/**
 * <Cropped/>
 */

export default component({
  onCreate ({path, props}) {
    const {onCrop = noop} = props

    return dispatch => {
      let data
      const handle = debounce(() => dispatch(onCrop(data)), 100)

      setTimeout(() => {
        const el = document.getElementById(path)
        new Cropper(el, {
          aspectRatio: 1,
          crop: newData => {
            data = newData
            handle()
          }
        })
      })
    }
  },

  render ({path, props}) {
    const {url} = props

    return (
      <Block>
        <Base tag='img' sq='300' id={path} src={url} maxWidth='100%' crossorigin='anonymous' />
      </Block>
    )
  },

  onRemove ({path}) {
    return () => {
      const node = document.getElementById(path)
      node.cropper.destroy()
    }
  },

  shouldUpdate () {
    return false
  }
})
