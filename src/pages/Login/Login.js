/**
 * Imports
 */

import {Facebook, Google, Microsoft} from 'components/OAuthButtons'
import {postLogin, oauthLogin} from 'reducer/auth'
import BlockInput from 'components/BlockInput'
import {DecoLine, Flex, Block} from 'vdux-ui'
import {Button, Text} from 'vdux-containers'
import element from 'vdux/element'
import summon from 'vdux-summon'
import Form from 'vdux-form'

/**
 * Login page
 */

function render ({props}) {
  const {loginUser, loggedIn = {}} = props
  const {loading} = loggedIn

  return (
    <Block w='col_s' color='white' p='m'>
      <Form onSubmit={loginUser} onSuccess={user => postLogin(user.token)}>
        <BlockInput type='text' autofocus placeholder='USERNAME OR EMAIL' name='username' />
        <BlockInput placeholder='PASSWORD' type='password' name='password' />
        <Button type='submit' busy={loading} wide bgColor='green' h={43} mt={10} lh='43px' fs={15}>
          Log In
        </Button>
        <Flex align='space-around center' m='m'>
          <DecoLine w='36%' />or<DecoLine w='36%' />
        </Flex>
      </Form>
      <Flex align='space-between center' pt={10}>
        <Google w='calc(50% - 6px)' onClick={() => oauth('google')}>Sign in With Google</Google>
        <Facebook w='calc(50% - 6px)' onClick={() => oauth('facebook')}>Sign in With Facebook</Facebook>
      </Flex>
      <Microsoft w='100%' mt onClick={() => oauth('office365')}>Sign in With Office365</Microsoft>
      <Text tag='a' href='/forgot' hoverProps={{textDecoration: 'underline'}} pointer>
        <Block color='grey_light' mx='auto' mt='m' textAlign='center'>
          Forgot your password?
        </Block>
      </Text>
    </Block>
  )

  function * oauth (provider) {
    try {
      yield oauthLogin(provider)
    } catch (e) {
      const ctrl = document.querySelector('input[name=username]')
      ctrl.setCustomValidity('User not found')
      ctrl.checkValidity()
    }
  }
}

/**
 * Exports
 */

export default summon(props => ({
  loginUser: body => ({
    loggedIn: {
      url: '/auth/login',
      method: 'POST',
      body
    }
  })
}))({
  render
})
