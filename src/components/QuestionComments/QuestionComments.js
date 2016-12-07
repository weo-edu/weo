/**
 * Imports
 */

import {stopPropagation, Document, component, element} from 'vdux'
import {Button} from 'vdux-containers'
import {Icon, Block} from 'vdux-ui'
import Comments from './Comments'

/**
 * <QuestionComments/>
 */

export default component({
  render ({props}) {
    const {
      showComments, commentsId, question, comments, ...rest
    } = props
    const hasComments = !!comments.length
    const isShown = commentsId === question._id

    return (
      <Block {...rest} question={question} z={2} printProps={{hide: true}}>
        <CommentButton
          hasComments={hasComments}
          showComments={showComments}
          question={question}
          isShown={isShown} />
        { isShown && <Comments {...props} /> }
      </Block>
    )
  }
})

/**
 * Constants
 */

const highlightStyle = {highlight: 0.03}
const shownCommentStyle = {
  transform: 'rotate(360deg)',
  bgColor: 'grey',
  color: 'white',
  circle: 24,
  left: 5,
  mt: 8
}

/**
 * <CommentButton/>
 */

const CommentButton = component({
  render ({props}) {
    const {showComments, question, isShown, hasComments} = props
    const style = isShown
      ? shownCommentStyle
      : {}

    return (
      <Block>
        <Button
          onClick={[stopPropagation, showComments(isShown ? null : question._id)]}
          color={hasComments ? 'white' : 'grey_medium'}
          bgColor={hasComments ? 'green' : '#F3F3F3'}
          boxShadow='0 1px 3px rgba(0,0,0,0.35)'
          borderWidth={0}
          hoverProps={highlightStyle}
          focusProps={highlightStyle}
          absolute={{left: -10}}
          transition='all .35s'
          align='center center'
          transform='rotate(0)'
          circle={40}
          p={0}
          {...style}>
          <Icon fs={19} name={isShown ? 'chevron_left' : 'chat_bubble'} />
        </Button>
        {isShown && <Document onClick={showComments(null)} />}
      </Block>
    )
  }
})
