/**
 * Imports
 */

import summonChannels from 'lib/summon-channels'
import Loading from 'components/Loading'
import CommentForm from './CommentForm'
import {component, element} from 'vdux'
import Avatar from 'components/Avatar'
import {Block, Card} from 'vdux-ui'
import getProp from '@f/get-prop'
import moment from 'moment'
import map from '@f/map'

/**
 * <ActivityPreview/>
 */

export default summonChannels(
  ({activity}) => `share!${activity._id}.replies`
)(component({
  render ({props}) {
    const { currentUser, activities, activity, classId } = props
    const {value, loading, loaded} = activities

    if (loading && !loaded) return <Loading show h={200} />

    const comments = value.items.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))

    return (
      <Card w='col_main' mx='auto' mb='l'>
        <Block p fs='l' lighter bg='grey' color='white'>
          Discussion
        </Block>
        <Block p='xl' fs='s' lighter hide={comments.length}>
          No one has made any comments yet. Be the first to share!
        </Block>
        {
          map((comment, i) => <Comment i={i} comment={comment} />, comments)
        }
        <CommentForm id={activity._id} currentUser={currentUser} classId={classId} />
      </Card>
    )
  }
}))

/**
 * <Comment/>
 */

function Comment ({props}) {
  const {comment, i} = props
  const {actor, createdAt} = comment
  const content = getProp('_object.0.originalContent', comment)
  const width = 4

  return (
    <Block px='l' pt={i ? 0 : 'l'} pb='l' align='start start' relative>
      <Block w={4} absolute left={38} tall top bgColor='#EEE' />
      <Avatar boxSizing='content-box' border={`${width}px solid white`} mr actor={actor} relative ml={width * -1} />
      <Block flex px='l' py rounded='5px' bgColor='off_white' border='1px solid #E0E0E0' relative>
        <Block bold mb>{actor.displayName}</Block>
        <Block lighter>
          {content}
        </Block>
        <Block fs='xxs' color='grey_medium' lighter absolute top right m>
          { moment(createdAt).fromNow() }
        </Block>
        <Arrow />
      </Block>
    </Block>
  )
}

/**
 * Constants
 */

const absolute = {top: 9, right: '100%'}

/**
 * <Arrow/>
 */

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
