/**
 * Imports
 */

import Avatar from 'components/Avatar'
import {Block, wrap, CSSContainer} from 'vdux-containers'
import element from 'vdux/element'
import map from '@f/map'

/**
 * <FreeResponseOverview/>
 */

function render ({props}) {
  const {responses = []} = props

  if(!responses.length) {
    return (
      <Block
        border='1px solid grey_light'
        textAlign='center'
        bgColor='off_white'
        wide
        p='l'>No Responses Yet</Block>
    )
  }

  return (
    <Block wide>
      { map(responder => <Response responder={responder} />, responses) }
    </Block>
  )
}

const Response = wrap(CSSContainer, {
  focusProps: { focus: true},
  hoverProps: { hover: true}
})({
  render ({props}) {
  const {responder, focus, hover} = props
  const {actor, response} = responder
    return (
      <Block
        highlight={focus || hover ? 0.03 : 0}
        m={focus ? '12px -12px' : '-1px 0 0'}
        border='1px solid grey_light'
        boxShadow={focus && 'z1'}
        align='start center'
        bgColor='off_white'
        ellipsis={!focus}
        pointer={!focus}
        tabindex={-1}
        p>
        <Avatar actor={actor} />
        <Block mx='l' flex='20%'>
          {actor.displayName}
        </Block>
        <Block flex maxWidth={focus ? 'none' : 690} ellipsis={!focus} lh='1.5em'>
          {response[0] || '-'}
        </Block>
      </Block>
    )
  }
})

/**
 * Exports
 */

export default {
  render
}
