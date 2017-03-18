/**
 * Imports
 */

import {Fixed, Text, Icon, Flex, Block, Menu, Button} from 'vdux-containers'
import NotificationsButton from 'components/NotificationsButton'
import CreateActivityModal from 'modals/CreateActivityModal'
import SignUpModal from 'modals/SignUpModal'
import ClassNav from 'components/ClassNav'
import HomeOwl from 'components/HomeOwl'
import AccountMenu from './AccountMenu'
import {component, element} from 'vdux'
import Link from 'components/Link'
import getProp from '@f/get-prop'
import Search from './Search'

/**
 * <Nav/>
 */

export default component({
  render ({props, actions}) {
    const {currentUser, currentUrl, bgColor = 'grey', search, query} = props
    const isLoggedIn = currentUser && currentUser._id
    const isStudent = isLoggedIn && currentUser.userType === 'student'
    const stepsLeft = isLoggedIn && getSteps(currentUser)

    return (
      <Block>
        <Fixed wide top z={2} boxShadow='card'>
          <Flex align='space-between' wide bgColor={bgColor} color='white' h={53}>
            <Flex align='start center'>
              <Flex align='center center' mx='m'>
                <HomeOwl />
                {
                  !isLoggedIn &&
                  <Text fs='m' ml bold>WEO</Text>
                }
              </Flex>
              {
                isLoggedIn && [
                  <Item href='/class' icon='assignment' text='Classes' />,
                  <Item href={`/${currentUser.username}`} icon='person' text={isStudent ? 'My Profile' : 'My Activities'} />,
                  <Item href='/school' icon='school' text='School' hide={!currentUser.school || isStudent} />,
                  <Item href='/get-started' icon='stars' text='Get Started' relative hide={!stepsLeft || isStudent}>
                    <Block circle={15} bg='red' absolute left={3} top={7} boxShadow='z2' fs='10' textAlign='center' lh='14px' textIndent={-2}>{stepsLeft}</Block>
                  </Item>
                ]
              }
            </Flex>
            <Menu flex align='end center'>
              <Search url={currentUrl} searching={search} query={query} hide={isStudent} mr='s' />
              {
                isLoggedIn && [
                  <NotificationsButton currentUser={currentUser} />,
                  <AccountMenu ml currentUser={currentUser} />
                ]
              }
              <Button
                onClick={actions.createActivity}
                border='1px solid rgba(#000, .1)'
                hide={isStudent}
                px='21'
                h={34}
                pill
                mr>
                <Icon fs='s' mr='s' name='edit' />
                Create Activity
              </Button>
              {
                !isLoggedIn &&
                  <Button
                    px='16'
                    mr
                    h={53}
                    boxShadow='inset 1px 0 0 rgba(255,255,255,0.07),inset -1px 0 0 rgba(255,255,255,0.07)'
                    borderLeft='1px solid rgba(0,0,0,0.1)'
                    borderRight='1px solid rgba(0,0,0,0.1)'
                    bgColor='transparent'
                    onClick={actions.openSignupModal}>
                    SIGN UP
                  </Button>
              }
            </Menu>
          </Flex>
        </Fixed>
        <Block pt={53} hidden />
      </Block>
    )
  },

  controller: {
    * openSignupModal ({context}) {
      yield context.openModal(() => <SignUpModal />)
    },

    * createActivity ({context, props}) {
      yield context.openModal(() =>
        props.currentUser && props.currentUser._id
          ? <CreateActivityModal currentUser={props.currentUser} />
          : <SignUpModal />
      )
    }
  }
})

/**
 * Helpers
 */

function getSteps(user) {
  const steps = ['group_joined', 'onboard.add_students', 'onboard.create_share', 'onboard.assign_share', 'onboard.profile_set', 'onboard.follow']
  let len = 0
  steps.forEach(val => {
    len += !getProp(val, user.preferences)
  })
  return len
}

/**
 * <Item/>
 */

function Item ({props, children}) {
  const {text, icon, href, onClick, hide, disabled, ...rest} = props

  return (
    <Link
      tag={href && !disabled ? 'a' : 'div'}
      onClick={onClick}
      href={href}
      align='center center'
      hide={hide}
      disabled={disabled}
      h={53}
      pointer
      px={9}
      mr={9}
      borderBottom='3px solid transparent'
      transition='all 0.15s'
      currentProps={{borderBottom: '3px solid #fff'}}
      hoverProps={{borderBottom: '3px solid #fff'}}
      {...rest}>
      <Icon fs='m' name={icon} />
      <Text ml='s'>{text}</Text>
      {children}
    </Link>
  )
}
