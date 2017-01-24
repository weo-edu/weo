/**
 * Imports
 */

import {stopPropagation, decodeRaw, component, element} from 'vdux'
import {Modal, ModalFooter, Block} from 'vdux-ui'
import BlockInput from 'components/BlockInput'
import FileUpload from 'components/FileUpload'
import {Button} from 'vdux-containers'
import summon from 'vdux-summon'
import Form from 'vdux-form'

/**
 * <MediaModal/>
 */

export default summon(() => ({
  scrapeMedia: url => ({
    scraping: {
      method: 'PUT',
      url: '/share/scrape/',
      body: {url}
    }
  })
}))(component({
  render ({props, context, actions}) {
    const {type, scraping = {}} = props
    const uploadable = type === 'document' || type === 'image' || type === 'file'

    return (
      <Modal onDismiss={context.closeModal} w='col_xl'>
        <Block color='blue' p boxShadow='z1' capitalize textAlign='center' fs='m' lighter>
          Add {type}
        </Block>
        <Block p='l' h={275} align='stretch'>
          {
             uploadable
              ? <FileUpload onDrop={decodeRaw(actions.onDrop)} onUpload={actions.done} message={<Upload loading={scraping.loading} {...props} onSubmit={actions.done} />} align='center center' wide {...props} />
              : <ScrapeFile {...props} loading={scraping.loading} onSubmit={actions.done} />
          }
        </Block>
        <ModalFooter mt={0} bg='grey'>
          <Button bgColor='white' color='text' hoverProps={{highlight: 0.03}} focusProps={{highlight: 0.03}} onClick={context.closeModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    )
  },

  controller: {
    * done ({props, context}, {name, url}) {
      console.log('done', name, url)
      const object = yield props.scrapeMedia(url)
      yield context.closeModal()
      yield props.onAccept({
        ...object,
        originalFilename: name,
        originalContent: url
      })
    },

    * onDrop ({actions}, e) {
      if (e._rawEvent.dataTransfer.types.indexOf('text/uri-list') !== -1) {
        const url = e._rawEvent.dataTransfer.getData('text/uri-list')

        // Yes! It is in fact possible to get a falsy url. Safari likes to do this
        // for some reason. When you drop a file into the dropzone, it likes to
        // give it a text/uri-list media type for what i'm sure are very very sound
        // reasons. Entirely purposeful, surely. Hence this check.
        if (url) {
          e.preventDefault()
          yield actions.done({url})
        }
      }
    }
  }
}))

/**
 * <ScrapeFile/>
 */

function ScrapeFile ({props}) {
  return (
    <Block column align='center center' wide>
      <Block mb='l' fs='s' lighter>
        Paste your link below.
      </Block>
      <MediaInput mb={40} {...props} />
    </Block>
  )
}

/**
 * <Upload/>
 */

function Upload ({props}) {
  return (
    <Block flex textAlign='center'>
      Drag File or Click Here
      <Block mb='xl' fs='xs' fw='normal' mt>
        or paste a URL below
      </Block>
      <MediaInput relative z={1} {...props} mx='auto' />
    </Block>
  )
}

/**
 * <MediaInput/>
 */

const MediaInput = component({
  render ({props}) {
    const {placeholder, loading, onSubmit, ...rest} = props

    return (
      <Form align='start stretch' onClick={stopPropagation} w='60%' onSubmit={onSubmit} {...rest}>
        <BlockInput
          placeholder={placeholder || 'Enter a url...'}
          borderRightWidth={0}
          inputProps={{py: 8}}
          name='url'
          autofocus
          lighter
          fs='s'
          mb={0} />
        <Button borderRadius='0' type='submit' busy={loading}>
          Submit
        </Button>
      </Form>
    )
  }
})
