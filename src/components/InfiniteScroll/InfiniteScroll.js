/**
 * Imports
 */

import Loading from 'components/Loading'
import {Block} from 'vdux-ui'
import Document from 'vdux/document'
import element from 'vdux/element'

/**
 * <InfiniteScroll/>
 */

function render ({props, children}) {
  const {more, threshold = 350, loading, ...rest} = props

  return (
    <Block pb='l' {...rest}>
      {children}
      <Loading h={200} show={loading} />
      <Document onScroll={handleScroll(more, threshold)} />
    </Block>
  )
}

/**
 * Actions
 */

function handleScroll (more, threshold = 0) {
  return e => {
    if (delta() <= threshold) {
      return more()
    }
  }
}

function delta () {
  return document.body.scrollHeight - (document.body.scrollTop + window.innerHeight)
}

/**
 * Exports
 */

export default {
  render
}
