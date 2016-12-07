/**
 * Imports
 */

import {imageLoaded} from 'vdux-containers'
import {component, element} from 'vdux'
import resize from 'lib/resize-image'
import {Block} from 'vdux-ui'

/**
 * <BgImg/>
 */

export default imageLoaded(({img, thumb}) => getUrl(img, thumb))(component({
  render ({props}) {
    const {img, thumb, isLoaded, ...rest} = props
    const resizedUrl = getUrl(img, thumb)

    return (
      <Block
        hidden={!isLoaded}
        backgroundSize='cover'
        backgroundPosition='center'
        backgroundImage={`url(${resizedUrl})`} {...rest} />
    )
  }
}))

/**
 * Helpers
 */

function getUrl (img, thumb) {
  if (!img && !img.url) return

  const url = img.url ? img.url : img

  return thumb
    ? resize(url, thumb === true ? 300 : thumb)
    : url
}
