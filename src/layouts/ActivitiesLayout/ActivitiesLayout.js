/**
 * Imports
 */

import {Block, Flex, Card, Menu, Divider} from 'vdux-containers'
import CreateBoardModal from 'modals/CreateBoardModal'
import {Document, component, element} from 'vdux'
import PageTitle from 'components/PageTitle'
import WeoIcon from 'components/WeoIcon'
import resize from 'lib/resize-image'
import Link from 'components/Link'
import summon from 'vdux-summon'
import NavItem from './NavItem'
import {Icon} from 'vdux-ui'
import map from '@f/map'

/**
 * <MyActivities/> page
 */

export default summon(({user, currentUser}) => ({
  boards: user._id === currentUser._id
    ? '/user/boards'
    : `/user/${user._id}/boards`
}))(component({
  render ({props, children, actions, state}) {
    const {boards, user, currentUser} = props
    const isMe = currentUser._id === user._id
    const {username} = user
    const iconSize = '25px'
    const {value = [], loaded} = boards

    return (
      <Flex w='col_main' mt='s' mx='auto' pb='l' relative>
        <Block>
          <Block mr w={230} h='100vh' hide={!state.isScrolled} />
          <Card mr w={230} position={state.isScrolled ? 'fixed' : 'static'} top={66} overflowY='auto' maxHeight='calc(100vh - 80px)'>
            <Menu column py='s'>
              <NavItem href={`/${username}/boards/all`} display='flex' align='start center'>
                <Icon name='assignment' color='white' bg='green' circle={iconSize} lh={iconSize} fs='s' mr textAlign='center' />
                All Activities
              </NavItem>
              {
                loaded
                  ? map(board =>
                    <NavItem href={`/${username}/boards/${board._id}`} board={board} isMe={isMe} display='flex' currentUser={currentUser} align='start center'>
                      <BoardIcon board={board} />
                      <Block flex ellipsis>{board.displayName}</Block>
                    </NavItem>, value.items)
                  : ''
              }
              {
                isMe &&
                  <span>
                    <NavItem href={`/${username}/boards/drafts`} display='flex' align='start center'>
                      <WeoIcon name='draft' color='white' bg='yellow' circle={iconSize} lh={iconSize} fs='s' fw='bolder' mr textAlign='center' />
                      Drafts
                    </NavItem>
                    <Divider />
                    <NavItem onClick={actions.createBoardModal} display='flex' align='start center'>
                      <Icon name='add' sq={iconSize} lh={iconSize} fs='s' mr textAlign='center' />
                      New Board
                    </NavItem>
                    <NavItem href={`/${username}/boards/trash`} display='flex' align='start center'>
                      <Icon name='delete' sq={iconSize} lh={iconSize} fs='s' mr textAlign='center' />
                      Trash
                    </NavItem>
                  </span>
              }
            </Menu>
          </Card>
        </Block>
        <Block w='col_main' maxWidth='714px' pt={6} relative>
          {children}
        </Block>
        <Document onScroll={actions.handleScroll(230)} />
      </Flex>
    )
  },

  controller: {
    * createBoardModal ({context}) {
      yield context.openModal(() => <CreateBoardModal />)
    },

    * handleScroll ({actions, state}, threshold = 0, e) {
      const isScrolled = document.body.scrollTop >= threshold

      if (state.isScrolled !== isScrolled) {
        yield actions.setScrolled(isScrolled)
      }
    }
  },

  reducer: {
    setScrolled: (state, isScrolled) => ({
      isScrolled
    })
  }
}))

/**
 * <BoardIcon/>
 */

function BoardIcon ({props}) {
  const {board} = props

  const {images = []} = board
  const [img] = images

  // Why 300? Who knows, but that is what we were doing before
  const url = img && img.url ? resize(img.url, 300) : ''

  return (
    <Block circle={25} mr bgColor='grey_light' align='center center' bgImg={url} bgSize='cover' bgPos='center'>
      {
        <Icon color='text' hide={img} fs='s' name='dashboard' />
      }
    </Block>
  )
}
