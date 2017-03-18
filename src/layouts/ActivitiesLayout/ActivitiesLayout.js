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
    const {boards, user, currentUser = {}} = props
    const isMe = currentUser._id === user._id
    const {username} = user
    const drafts = currentUser.drafts ? currentUser.drafts.canonicalTotal.items : 0
    const iconSize = '25px'
    const {value = [], loaded} = boards

    return (
      <Flex w='col_main' mt='s' mx='auto' pb='l' relative>
        <Block>
          <Block mr w={230} h='100vh' hide={!state.isScrolled} />
          <Card mr w={230} overflowY='auto' position={state.isScrolled ? 'fixed' : 'static'} top={66}>
            <Block relative uppercase p boxShadow='0 2px 1px rgba(75,82,87,0.1)'>Boards</Block>
            <Menu column maxHeight='calc(100vh - 158px)' overflow='auto'>
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
                    <Divider />
                    <NavItem href={`/${username}/boards/drafts`} display='flex' align='start center'>
                      <WeoIcon w={iconSize} name='draft' fs='s' mr textAlign='center' />
                      Drafts
                      <Block color='white' lighter circle={20} bg='yellow' textAlign='center' lh='20px' textIndent='-2px' ml hide={drafts < 1}>
                        { drafts > 99 ? '99+' : drafts }
                      </Block>
                    </NavItem>
                    <NavItem href={`/${username}/boards/trash`} display='flex' align='start center'>
                      <Icon name='delete' sq={iconSize} lh={iconSize} fs='s' mr textAlign='center' />
                      Trash
                    </NavItem>
                    <NavItem onClick={actions.createBoardModal} display='flex' align='start center'>
                      <Icon  bolder name='add' sq={iconSize} lh={iconSize} fs='s' mr textAlign='center' />
                      New Board
                    </NavItem>
                  </span>
              }
            </Menu>
            <Block boxShadow='0 -2px 1px rgba(75,82,87,0.1)' z='1' relative p>
              <Block fs='xxs' color='grey_medium' hide={!isMe}>
                {
                  //`Storage: ${user.pinCount} / 1000`
                }
              </Block>
            </Block>
          </Card>
        </Block>
        <Block w='col_main' maxWidth='714px' relative>
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
