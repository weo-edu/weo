/**
 * Imports
 */

import BoardSettingsModal from 'modals/BoardSettingsModal'
import FollowButton from 'components/FollowButton'
import {Button, Flex} from 'vdux-containers'
import {Block, Card, Text} from 'vdux-ui'
import WeoIcon from 'components/WeoIcon'
import {component, element} from 'vdux'
import Avatar from 'components/Avatar'
import BgImg from 'components/BgImg'
import Link from 'components/Link'

/**
 * Constants
 */

const underline = {underline: true}
const opacity = {opacity: 0.92}
const highlight = {highlight: 0.03}

/**
 * <BoardTile/>
 */

export default component({
  render ({props, context, actions}) {
    const {board, currentUser, hideMeta} = props
    const {owners = [], displayName, images = []} = board
    const [owner = {}] = owners
    const url = `/${owner.username}/boards/${board._id}`

    return (
      <Card w={230} h={250} relative my={8} mx={6}>
        <Flex column tall>
          {
            hideMeta
              ? <Flex align='start center' px fs='s' lighter h={50}>
                {displayName}
              </Flex>
              : <Flex px h={50} align='start center'>
                <Avatar link thumb actor={owner} />
                <Flex column ml='m'>
                  <Link hoverProps={underline} href={url} mb='2px' bold>{displayName}</Link>
                  <Link color='grey_medium' fs='xxs' hoverProps={underline} href={`/${owner.username}/boards`}>
                    {owner.displayName}
                  </Link>
                </Flex>
              </Flex>
          }
          <Block bg='grey'>
            <Flex wrap h={158} bgColor='off_white' borderColor='rgba(grey,0.03)' borderBottom borderTop pointer onClick={context.setUrl(url)} hoverProps={opacity}>
              {
                !images.length && (
                  <Text p fs='xxs'>
                    <Text fw='bolder'>{displayName}</Text>
                    <Text px='xs'>by</Text>
                    <Text color='blue'>{owner.displayName}</Text>
                  </Text>
                )
              }
              {
                images.map(img => <BgImg flex='50%' maxWidth='100%' img={img} thumb />)
              }
            </Flex>
          </Block>
          <Flex h='42px' p='s' align='space-between center'>
            {
                !currentUser
                  ? <Block />
                  : currentUser._id === owner.id
                    ? <Button color='text' px='l' bgColor='off_white' border='1px solid rgba(0,0,0,0.15)' hoverProps={highlight} focusProps={highlight} onClick={actions.openBoardSettings}>Edit</Button>
                    : <FollowButton w='150' px='0' board={board} />
              }
            <Block color='grey_medium' lh='30px'>
              <WeoIcon name='pin' fs='14px' />
              <Text fs='xxs'>
                {board.board && board.board.canonicalTotal.items}
              </Text>
            </Block>
          </Flex>
        </Flex>
      </Card>
    )
  },

  controller: {
    * openBoardSettings ({context, props}) {
      yield context.openModal(() => <BoardSettingsModal board={props.board} />)
    }
  }
})
