/**
 * Imports
 */

import ActivityDropdownMenu from 'components/ActivityDropdownMenu'
import AssignButton from 'components/AssignButton'
import DeleteButton from 'components/DeleteButton'
import {Block, Fixed, Flex, Text} from 'vdux-ui'
import LikeButton from 'components/LikeButton'
import PinButton from 'components/PinButton'
import EditDropdown from './EditDropdown'
import {component, element} from 'vdux'
import {Button} from 'vdux-containers'
import Link from 'components/Link'

/**
 * <Nav/> for activities
 */

export default component({
  initialState: {
    locallyLiked: 0
  },

  render ({props, actions, state}) {
    const {
      activity, user, isPublic, isInstance, instance,
      progress, overview, preview, discussion, isEdit,
      isOwner, back, savingIndicator, intent, exit
    } = props
    const {_id: id, displayName} = activity
    const {locallyLiked} = state
    const comments = activity.replies.canonicalTotal.items

    return (
      <Block printProps={{hide: true}}>
        <Fixed bgColor='white' wide top z={3} boxShadow='card' align='start center' h={53}>
          <Flex align='start center' wide px flex>
            <Button icon='arrow_back' fs='s' onClick={back} color='text' mr />
            <Text fs='s' lighter>{displayName}</Text>
          </Flex>
          <Flex align='center center' hide={isEdit}>
            <NavTile highlight='red' path={`${id}/students`} hide={!progress}>
              Student Progress
            </NavTile>
            <NavTile highlight='green' path={`${id}/overview`} hide={!overview}>
              Class Overview
            </NavTile>
            <NavTile highlight='blue' path={`${id}/preview`} hide={!preview}>
              Activity Preview
            </NavTile>
            <NavTile highlight='blue' path={`${id}/instance/${user._id}`} hide={!instance}>
              Activity
            </NavTile>
            <NavTile highlight='yellow' path={`${id}/discussion`} hide={!discussion}>
              <Text color='grey_medium' mr='s' hide={!comments}>
                {comments}
              </Text>
              Discussion
            </NavTile>
          </Flex>
          <Block flex px hide={isEdit}>
            <Flex flex align='end center' hide={isInstance}>
              <LikeButton
                liked={locallyLiked}
                hide={!isPublic}
                localLike={actions.localLike}
                activity={activity}
                user={user} />
              <AssignButton
                activity={activity}
                hide={!isPublic}
                onAssign={exit}
                text='Assign'
                user={user} />
              <PinButton
                onPin={exit}
                activity={activity}
                user={user}
                hide={user.userType === 'student'}
                text='Pin' />
              <ActivityDropdownMenu
                onDelete={back}
                reassign={!isInstance && !isPublic}
                hide={user.userType === 'student' || !isOwner}
                activity={activity} />
            </Flex>
          </Block>
          <Block flex px align='end center' hide={!isEdit}>
            <Block align='end center' mr color='grey_medium'>
              <Block align='start center'>
                {savingIndicator}
              </Block>
            </Block>
            <Block align='end center' hide={activity.published || (intent && intent !== 'new')}>
              <Block color='red' align='start center' mr>DRAFT</Block>
              <EditDropdown user={user} onAction={exit} back={back} activity={activity} />
            </Block>
            {
              intent === 'pin'
                ? <PinButton activity={activity} user={user} text='Pin' onPin={exit} />
                : intent === 'assign'
                  ? <AssignButton activity={activity} text='Assign' user={user} onAssign={exit} />
                  : <Block align='end center' hide={!activity.published}>
                      <Button mr='s' text='Done' onClick={back} bgColor='grey' />
                      <DeleteButton onDelete={exit} activity={activity} bgColor='red' />
                    </Block>
            }
          </Block>
        </Fixed>
        <Block pt={53} hidden mb />
      </Block>
    )
  },

  reducer: {
    localLike: (state, inc) => ({locallyLiked: state.locallyLiked + inc})
  }
})

/**
 * <NavTile/>
 */

function NavTile ({props, children}) {
  const {highlight, path, ...rest} = props
  const height = '53px'

  return (
    <Block px={10} {...rest}>
      <Link
        currentProps={{borderBottomColor: highlight}}
        hoverProps={{borderBottomColor: highlight}}
        borderBottom='3px solid transparent'
        href={`/activity/${path}`}
        display='inline-block'
        transition='all 0.2s'
        textAlign='center'
        lh={height}
        h={height}
        uppercase
        fs='xxs'
        replace
        px='s'>
        {children}
      </Link>
    </Block>
 )
}
