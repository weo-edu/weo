/**
 * Imports
 */

import Avatar from 'components/Avatar'
import {component, element} from 'vdux'
import {Card, Block} from 'vdux-ui'
import moment from 'moment'

/**
 * <School Comment/>
 */

export default component({
  render ({props}) {
  	const {comment} = props
  	const {text, actor, createdAt} = comment
  	const width = 4
    return (
    	<Card p='l' mt align='start start' relative>
	      <Avatar boxSizing='content-box' mr mt={2} ml={-8} actor={actor} relative  />
	      <Block flex px='l' py rounded='5px' bgColor='#FCFCFC' border='1px solid #E0E0E0' relative>
	        <Block bold mb>{actor.displayName}</Block>
	        <Block lighter>
	          {text}
	        </Block>
	        <Block fs='xxs' color='grey_medium' lighter absolute top right m>
	          { moment(createdAt).fromNow() }
	        </Block>
	        <Arrow />
	      </Block>
	    </Card>
    )
  }
})

/**
 * <Arrow/>
 */

const absolute = {top: 9, right: '100%'}

function Arrow () {
  return (
    <span>
      <Block
        absolute={absolute}
        border='10px solid transparent'
        borderRightColor='#CCC' />
      <Block
        absolute={absolute}
        border='10px solid transparent'
        borderRightColor='off_white'
        mr={-1} />
    </span>
  )
}