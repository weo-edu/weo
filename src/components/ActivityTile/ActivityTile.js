/**
 * Imports
 */

import ActivityCardActions from 'components/ActivityCardActions'
import {Flex, Block, Card, Text, Icon} from 'vdux-ui'
import {wrap, CSSContainer} from 'vdux-containers'
import {setUrl} from 'redux-effects-location'
import handleActions from '@f/handle-actions'
import createAction from '@f/create-action'
import objectEqual from '@f/object-equal'
import WeoIcon from 'components/WeoIcon'
import Figure from 'components/Figure'
import element from 'vdux/element'
import ForkMeta from './ForkMeta'
import Meta from './Meta'

/**
 * Activity Tile
 */

function render ({props}) {
  const {activity, showFork} = props
  const {image, displayName, description} = activity
  const TileMeta = showFork ? ForkMeta : Meta

  return (
    <Card w={230} relative my={8} mx={6}>
      <Activity {...props} hoverProps={{hover: true}} />
      <Block px={12} py={6} fs='xxs' borderTop='rgba(0, 0, 0, 0.04)' bgColor='#FCFCFC'>
        <TileMeta activity={activity} />
      </Block>
    </Card>
  )
}

/**
 * Actions
 */

const localLike = createAction('<ActivityTile/>: local like')

/**
 * <Activity/> component
 */

const Activity = wrap(CSSContainer)({
  initialState () {
    return {
      locallyLiked: 0
    }
  },

  render ({props, local, state}) {
    const {activity, user = {}, hover, actions} = props
    const {
      image, displayName, description, _id,
      likers = {}, repinCount, replies
    } = activity
    const {locallyLiked} = state
    const likes = likers.length + locallyLiked

    return (
      <Flex column cursor='pointer' pb onClick={() => setUrl(`/activity/${_id}`)}>
        {
          actions && hover && <ActivityCardActions spread liked={locallyLiked} localLike={local(localLike)} {...actions} activity={activity} user={user} absolute wide z='1' />
        }
        <Figure key='img' {...image} thumb={true} opacity={hover && .88} />
        <Block textAlign='center' m='m'>
          <Text my='s' fs='s' display='block' fw='200'>{displayName}</Text>
          <Text fs='xxs' wordBreak='break-word'>{description}</Text>
        </Block>
        <Flex align='center center' color='grey_medium' fs='xxs' maxHeight='14px'>
          {
            !!likes && (
              <Flex align='center center'>
                <Icon name='favorite' fs='xs'  />
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

  /**
   * Reducer
   */

  reducer: handleActions({
    [localLike]: (state, inc) => ({
      ...state,
      locallyLiked: state.locallyLiked + inc
    })
  })
})

/**
 * shouldUpdate
 */

function shouldUpdate (prev, next) {
  if (objectEqual(prev.props.actions, next.props.actions)) {
    next.props.actions = prev.props.actions
  }

  return objectEqual(prev.props, next.props)
}

/**
 * Exports
 */

export default {
  render,
  shouldUpdate
}
