/**
 * Imports
 */

import {component, element} from 'vdux'
import loadImage from '@f/load-image'
import resize from 'lib/resize-image'
import {Block} from 'vdux-ui'

/**
 * <Figure/>
 */

export default component({
  onCreate ({props, actions}) {
    if (props.url) return loadImages(props, actions.imageLoaded)
  },

  render ({props, state}) {
    const {url, width, height, thumb, thumbFirst, ...rest} = props
    if (!url) return <span />

    const ratio = props.ratio || height / width

    const fullUrl = getUrl(url, thumb)
    const thumbUrl = getUrl(url, true)

    const img = !thumb && thumbFirst && !state[fullUrl]
      ? thumbUrl
      : fullUrl

    return (
      <Block m={0} relative overflow='hidden' maxWidth='100%' {...rest}>
        <Block paddingBottom={ratio * 100 + '%'}>
          <Block hidden={!(state[fullUrl] || state[thumbUrl])} tag='img' tall wide absolute left top m='auto' src={img} />
        </Block>
      </Block>
    )
  },

  onUpdate (prev, next) {
    if (getUrl(prev.props.url, prev.props.thumb) !== getUrl(next.props.url, next.props.thumb)) {
      if (next.props.url) {
        return loadImages(next.props, next.actions.imageLoaded)
      }
    }
  },

  reducer: {
    imageLoaded: (state, url) => ({[url]: true})
  }
})

/**
 * Helpers
 */

function getUrl (url, thumb) {
  if (!url) return

  return thumb
    ? resize(url, thumb === true ? 350 : thumb)
    : url
}

function * loadImages ({url, thumb, thumbFirst}, imageLoaded) {
  const load = [getUrl(url, thumb)]
  if (!thumb && thumbFirst) load.push(getUrl(url, true))

  yield load.map(function * (url) {
    yield loadImage(url)
    yield imageLoaded(url)
  })
}
