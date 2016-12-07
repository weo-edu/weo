/**
 * Imports
 */

import {Block, Flex, Card, Icon} from 'vdux-ui'
import {Menu, MenuItem} from 'vdux-containers'
import PageTitle from 'components/PageTitle'
import AppLayout from 'layouts/AppLayout'
import {component, element} from 'vdux'
import Link from 'components/Link'
import map from '@f/map'

/**
 * <SettingsLayout/>
 */

export default component({
  render ({props, context, children}) {
    const isStudent = props.currentUser.userType === 'student'

    return (
      <AppLayout {...props}>
        <PageTitle title='Account Settings' />
        <Flex w='col_main' mt='s' mx='auto' px='s' py='l' relative>
          <Block>
            <Card w={230} mr pb='l'>
              <Menu column>
                <Block p fs='s' color='grey_medium'>
                  Your Account
                </Block>
                { map(item => <NavItem item={item} isStudent={isStudent} />, items) }
                <MenuItem onClick={context.logoutUser} borderBottom='1px solid grey_light' {...itemProps}>
                  <Icon name='exit_to_app' mr='s' fs='s' />
                  Log Out

                </MenuItem>
              </Menu>
            </Card>
          </Block>
          <Block flex>
            { children }
          </Block>
        </Flex>
      </AppLayout>
    )
  }
})

/**
 * <NavItem/>
 */

function NavItem ({props}) {
  const {item, isStudent} = props
  const {name, url, icon, hideStudent} = item
  const hide = isStudent && hideStudent

  return (
    <Link ui={MenuItem} href={url} {...itemProps} hide={hide}>
      <Icon name={icon} fs='s' mr='s' />
      <Block flex>
        {name}
      </Block>
      <Icon name='keyboard_arrow_right' fs='s' />
    </Link>
  )
}

/**
 * Constants
 */

const itemProps = {
  currentProps: {borderLeftColor: 'blue', highlight: 0.05, color: 'text'},
  borderLeft: '3px solid transparent',
  borderTop: '1px solid grey_light',
  hoverProps: {color: 'text'},
  align: 'start center',
  color: 'grey_medium',
  fw: 'bold',
  py: 'm'
}

const items = [
  {
    name: 'Settings',
    icon: 'settings',
    url: '/account/settings'
  },
  {
    name: 'Edit Profile',
    icon: 'account_circle',
    url: '/account/profile'
  },
  {
    name: 'Email Notifications',
    icon: 'email',
    url: '/account/email',
    hideStudent: true
  }
]
