/**
 * Imports
 */

import {Block, Icon, Image as UiImage, Text} from 'vdux-ui'
import {t, stopPropagation, component, element} from 'vdux'
import {Block as ContBlock, Button} from 'vdux-containers'
import EditingMedia from './EditingMedia'
import Loading from 'components/Loading'
import Figure from 'components/Figure'
import Link from 'components/Link'

/**
 * <ActivityMedia/>
 */

export default component({
  propTypes: {
    object: t.Object,
    onEdit: t.maybe(t.Function),
    remove: t.maybe(t.Function)
  },

  render ({props}) {
    if (props.editing) return <EditingMedia {...props} />

    const {object, onEdit, remove, ...rest} = props

    switch (object.objectType) {
      case 'link':
        return <LinkObject object={object} {...rest} />
      case 'video':
      case 'rich':
        return <Video object={object} {...rest} />
      case 'document':
        return <Document object={object} {...rest} />
      case 'image':
        return <Image object={object} {...rest} />
      case 'file':
        return <File object={object} {...rest} />
    }
  }
})

/**
 * <LinkObject/>
 */

const LinkObject = component({
  render ({props}) {
    const {object, ...rest} = props
    const {description, embed = {}, image = {}, displayName} = object
    const linkProps = {
      onClick: stopPropagation,
      href: embed.url,
      target: '_blank',
      hoverProps: {textDecoration: 'underline'}
    }

    return (
      <Block align='start center' bgColor='#fbfbfb' border='1px solid rgba(52, 52, 52, 0.08)' h={120} overflow='hidden' {...rest}>
        {
          image.url && (
            <Link {...linkProps} minWidth={118} tall relative bgColor='white' borderRight='1px solid rgba(grey_light, .5)'>
              <Block
                tag='img'
                maxWidth='100%'
                maxHeight='100%'
                absolute={{top: 0, right: 0, bottom: 0, left: 0}}
                m='auto'
                src={image.url} />
            </Link>
          )
        }
        <Block flex p minWidth={0}>
          <Block column mb fs='xxs' ellipsis>
            <Link maxWidth='100%' color='blue' fs='s' fw={200} ellipsis {...linkProps}>
              {displayName}
            </Link>
            <Link color='rgb(153, 153, 153)' ellipsis {...linkProps}>
              {embed.url}
            </Link>
          </Block>
          <Block lighter overflow='hidden' maxHeight={43} lh='20px'>
            {description}
          </Block>
        </Block>
      </Block>
    )
  }
})

/**
 * <Video/>
 */

const Video = component({
  reducer: {
    playVideo: () => ({play: true})
  },

  render ({props, state, actions}) {
    const {object, editable, preview, isDragging, ...rest} = props
    const {content, image = {}, displayName, embed = {}} = object
    const {url, height, width} = image
    const imgSize = height / width >= 0.74 ? '74.6%' : '100%'
    const playable = editable ? preview : true

    return (
      <Block tag='span' {...rest} pointerEvents={isDragging ? 'none' : 'auto'}>
        <Block wide tall relative bg={`#000 url(${url}) no-repeat center`} bgSize={imgSize} printProps={{hide: true}}>
          <Loading show={state.play} dark={false} absolute top bottom left right />
          <Block hidden={state.play} onClick={playable && actions.playVideo} pointer relative>
            <Figure
              maxWidth={imgSize}
              height={height}
              hidden
              width={width}
              thumbFirst
              url={url}
              mx='auto' />
            <Icon
              absolute={{top: 0, left: 0, right: 0, bottom: 0}}
              textShadow='1px 1px 5px rgba(0,0,0, .4)'
              name='play_arrow'
              color='white'
              opacity='.7'
              sq={150}
              fs={150}
              m='auto' />
            {displayName && <Block
              bg='linear-gradient(to top,rgba(52,52,52,0.45),rgba(52,52,52,0))'
              absolute={{bottom: 0, left: 0}}
              p='30% 5% 3%'
              wide>
              <Link
                onClick={stopPropagation}
                hoverProps={{underline: true}}
                href={embed.url}
                target='_blank'
                color='white'
                lighter
                fs='s'>
                {displayName}
              </Link>
              </Block>}
          </Block>
          {
            state.play &&
              <Block absolute={{top: 0}} tall wide innerHTML={content} class='activity-video' />
          }
        </Block>
        <Block align='start center' hide printProps={{hide: false}}>
          <Block w={200} relative>
            <UiImage src={url} wide />
            <Icon
              absolute={{top: 0, left: 0, right: 0, bottom: 0}}
              textShadow='1px 1px 5px rgba(0,0,0, .4)'
              name='play_arrow'
              color='white'
              opacity='.8'
              sq={75}
              fs={75}
              m='auto' />
          </Block>
          <Block ml='l'>
            <Block fs='s' lighter mb='s' mt={-12}>
              {displayName || 'Untitled'}
            </Block>
            <Block>{embed.url}</Block>
          </Block>
        </Block>
      </Block>
    )
  }
})

/**
 * Constants
 */

const linkProps = {
  hoverProps: {opacity: 0.8},
  align: 'start center',
  target: '_blank',
  pointer: true,
  color: 'blue',
  fs: 'xs'
}

/**
 * <Document/>
 */

const Document = component({
  render ({props}) {
    const {object, editable, preview, isDragging, ...rest} = props
    const {content, embed = {}} = object
    const {url} = embed

    return (
      <Block {...rest} pointerEvents={isDragging ? 'none' : 'auto'}>
        <Block
          class='activity-document'
          innerHTML={content}
          pb='123%'
          w='100%'
          relative
          h={0} />
        <Block align='start center' mt>
          <Link onClick={stopPropagation} href={url} {...linkProps}>
            <Icon name='open_in_new' mr='xs' fs='inherit' />
            View File
          </Link>
          {
            editable && !preview &&
            <ContBlock ml {...linkProps}>
              <Icon name='edit' mr='xs' fs='inherit' />Edit
            </ContBlock>
          }
        </Block>
      </Block>
    )
  }
})

/**
 * <Image/>
 */

function Image ({props}) {
  const {object, ...rest} = props
  const {image = {}, justify = 'center', zoom} = object

  return (
    <Block textAlign={justify} {...rest}>
      <Figure {...image} w={image.width * (zoom || 1)} display='inline-block' thumbFirst />
    </Block>
  )
}

/**
 * <File/>
 */

function File ({props}) {
  const {object, ...rest} = props
  const {originalContent, originalFilename} = object

  return (
    <Block align='start center' {...rest}>
      <Text color='grey_medium' mr>Download File: </Text>
      <Block>
        <a href={originalContent}>
          <Button>
            <Icon name='file_download' />
            {originalFilename}
          </Button>
        </a>
      </Block>
    </Block>
  )
}
