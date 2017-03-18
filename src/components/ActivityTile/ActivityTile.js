/**
 * Imports
 */

import ActivityCardActions from 'components/ActivityCardActions'
import {Flex, Block, Card, Text, Icon} from 'vdux-ui'
import {wrap, CSSContainer} from 'vdux-containers'
import {t, component, element} from 'vdux'
import objectEqual from '@f/object-equal'
import WeoIcon from 'components/WeoIcon'
import Figure from 'components/Figure'
import ForkMeta from './ForkMeta'
import Meta from './Meta'

/**
 * <ActivityTile/>
 */

export default component({
  propTypes: {
    activity: t.Object,
    showFork: t.maybe(t.Boolean)
  },

  render ({props}) {
    const {activity, showFork} = props
    const TileMeta = showFork ? ForkMeta : Meta

    return (
      <Card w={230} relative my={8} mx={6}>
        <Activity {...props} />
        <Block px={12} py={6} fs='xxs' borderTop='rgba(0, 0, 0, 0.04)' bgColor='#FCFCFC'>
          <TileMeta activity={activity} />
        </Block>
      </Card>
    )
  }
})

/**
 * <Activity/> component
 */

const Activity = wrap(CSSContainer, {
  hoverProps: {hover: true}
})(component({
  initialState: {
    locallyLiked: 0
  },

  render ({props, actions, state}) {
    const {activity, user = {}, hover, options} = props
    const {
      image, displayName, description, _id,
      likers = {}, repinCount, replies
    } = activity
    const {locallyLiked} = state
    const likes = likers.length + locallyLiked

    return (
      <Flex column cursor='pointer' pb onClick={actions.goToActivity(_id)}>
        {
          options && hover && <ActivityCardActions spread liked={locallyLiked} localLike={actions.localLike} {...options} activity={activity} user={user} absolute wide z='1' />
        }
        <Figure key='img' {...image} thumb opacity={hover && 0.88} />
        <Block textAlign='center' m='m'>
          <Text my='s' fs='s' display='block' fw='200'>{displayName}</Text>
          <Text fs='xxs' wordBreak='break-word'>{description}</Text>
        </Block>
        <Flex align='center center' color='grey_medium' fs='xxs' maxHeight='14px'>
          {
            !!likes && (
              <Flex align='center center'>
                <Icon name='favorite' fs='xs' />
                <Text mr='4' ml='2'>{likes}</Text>
              </Flex>
            )
          }
          {
            !!repinCount && (
              <Flex align='center center'>
                <WeoIcon name='pin' fs='14' mb='-2' />
                <Text mr='4' ml='2'>{repinCount}</Text>
              </Flex>
            )
          }
          {
            !!replies.canonicalTotal.items && (
              <Flex align='center center'>
                <Icon name='mode_comment' fs='xs' mb='-2' />
                <Text mr='4' ml='2'>{replies.canonicalTotal.items}</Text>
              </Flex>
            )
          }
        </Flex>
      </Flex>
    )
  },

  controller: {
    * goToActivity ({context}, id) {
      yield context.setUrl(`/activity/${id}`)
    }
  },

  reducer: {
    localLike: (state, inc) => ({locallyLiked: state.locallyLiked + inc})
  },

  shouldUpdate (prev, next) {
    if (objectEqual(prev.props.options, next.props.options)) {
      next.props.options = prev.props.options
    }

    return objectEqual(prev.props, next.props)
  }
}))
