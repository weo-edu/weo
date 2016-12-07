/**
 * Imports
 */

import PageTitle from 'components/PageTitle'
import AppLayout from 'layouts/AppLayout'
import FourOhFour from 'pages/FourOhFour'
import {pickerColors} from 'lib/colors'
import {component, element} from 'vdux'
import maybeOver from '@f/maybe-over'
import summon from 'vdux-summon'
import Header from './Header'
import {Flex} from 'vdux-ui'

/**
 * <ProfileLayout/>
 */

export default summon(props => ({
  user: `/user/${props.username}`
}))(component({
  render ({props, children}) {
    const {username, currentUser} = props
    const isCurrentUser = username === currentUser.username
    const user = isCurrentUser
      ? {value: currentUser, loaded: true, loading: false}
      : props.user

    const bgColor = user.value
      ? user.value.color || pickerColors[0]
      : pickerColors[0]

    return (
      <AppLayout {...props} bgColor={bgColor}>
        <PageTitle title={`${user.value && user.value.displayName || ''} | Profile`} />
        <Flex mt={18} px='s' column mx='auto' align='center center' w='col_main'>
          {internal(currentUser, user, children)}
        </Flex>
      </AppLayout>
    )
  }
}))

/**
 * Render internal content
 */

function internal (currentUser, {value, loaded, loading, error}, children) {
  if (error) return <FourOhFour w='col_main' />
  if (!loaded) return ''

  return [
    <Header user={value} currentUser={currentUser} />,
    maybeOver(value, children)
  ]
}
