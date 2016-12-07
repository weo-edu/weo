/**
 * Imports
 */

import {decodeFiles, component, element} from 'vdux'
import {Base, ProgressBar, ErrorTip} from 'vdux-ui'
import DropZone from 'components/DropZone'
import noop from '@f/noop'

/**
 * <FileUpload/>
 */

export default component({
  initialState: {
    n: 0,
    uploading: false,
    progress: 0
  },

  render ({props, state, actions}) {
    const {progress, uploading, error} = state

    return (
      <DropZone
        relative
        accepts='Files'
        dragonProps={{
          bgColor: 'rgba(blue, .1)',
          color: 'blue_medium',
          message: 'Drop File',
          border: '1px solid rgba(blue, .4)',
          boxShadow: '0 0 1px rgba(blue, .7)'
        }}
        message='Drag File or Click Here'
        color='grey_medium'
        border='1px dashed grey_light'
        bgColor='off_white'
        fs='m'
        lighter
        mx='auto'
        uploading={uploading}
        {...props}>
        <ProgressBar w='50%' h='5' absolute top bottom right left m='auto' hide={!uploading} progress={progress} />
        <ErrorTip show={!!error} message={error} placement='right' />
        <Base sq='100%' onChange={decodeFiles(actions.upload)} tag='input' type='file' opacity='0' absolute top left pointer />
      </DropZone>
    )
  },

  controller: {
    * upload ({props, state, actions, context}, [file]) {
      const {onUpload = noop, validate = () => ({valid: true})} = props
      const {valid, message} = validate(file)

      if (!valid) {
        yield actions.uploadError(message)
        return
      }

      const n = state.n + 1
      yield actions.uploadStart(n)

      const url = yield context.uploadFile(file, progress => actions.uploadProgress({n, progress}))

      yield actions.uploadEnd(n)
      yield onUpload({
        name: file.name,
        url
      })
    }
  },

  reducer: {
    uploadStart: (state, n) => ({
      n,
      uploading: true,
      error: null
    }),
    uploadProgress: (state, {n, progress}) => state.n !== n
      ? state
      : {progress},
    uploadEnd: (state, n) => state.n !== n
      ? state
      : {uploading: false, progress: 0},
    uploadError: (state, error) => ({error})
  }
})
