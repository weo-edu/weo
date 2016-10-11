/**
 * Imports
 */

import {Block, Flex, Card, Menu, Divider} from 'vdux-containers'
import CreateBoardModal from 'modals/CreateBoardModal'
import PageTitle from 'components/PageTitle'
import AppLayout from 'layouts/AppLayout'
import WeoIcon from 'components/WeoIcon'
import {openModal} from 'reducer/modal'
import resize from 'lib/resize-image'
import Link from 'components/Link'
import element from 'vdux/element'
import summon from 'vdux-summon'
import NavItem from './NavItem'
import {Icon} from 'vdux-ui'
import map from '@f/map'

/**
 * <MyActivities/> page
 */

function render ({props, children}) {
  const {boards} = props
  const iconSize = '25px'
  const {value = [], loaded} = boards

  return (
    <AppLayout {...props}>
      <PageTitle title='My Activities' />
      <Flex w='col_main' mt='s' mx='auto' px='s' py='l' relative>
        <Block>
          <Card w={230} mr>
            <Menu column py='s'>
              <NavItem href='/activities/all' display='flex' align='start center'>
                <Icon name='assignment' color='white' bg='green' circle={iconSize} lh={iconSize} fs='s' mr textAlign='center' />
                All Activities
              </NavItem>
              {
                loaded
                  ? map(board =>
                    <NavItem href={`/activities/${board._id}`} board={board} display='flex' align='start center'>
                      {boardIcon(board)}
                      <Block flex ellipsis>{board.displayName}</Block>
                    </NavItem>, value.items)
                  : ''
              }
              <NavItem href='/activities/drafts' display='flex' align='start center'>
                <WeoIcon name='draft' color='white' bg='yellow' circle={iconSize} lh={iconSize} fs='s' fw='bolder' mr textAlign='center' />
                Drafts
              </NavItem>
              <Divider/>
              <NavItem onClick={() => openModal(() => <CreateBoardModal/>)} display='flex' align='start center'>
                <Icon name='add' sq={iconSize} lh={iconSize} fs='s' mr textAlign='center' />
                New Board
              </NavItem>
              <NavItem href='/activities/trash' display='flex' align='start center'>
                <Icon name='delete' sq={iconSize} lh={iconSize} fs='s' mr textAlign='center' />
                Trash
              </NavItem>
            </Menu>
          </Card>
        </Block>
        <Block w='col_main' maxWidth='714px'>
          {children}
        </Block>
      </Flex>
    </AppLayout>
  )
}

function boardIcon (board) {
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

/**
 * Helpers
 */

function cmp (a, b) {
  return a.displayName.toUpperCase() > b.displayName.toUpperCase() ? 1 : -1
}

/**
 * Exports
 */

export default summon(props => ({
  boards: '/user/boards',
}))({
  render
})
