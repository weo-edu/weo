/**
 * Imports
 */

import BlockInput from 'components/BlockInput'
import {component, element} from 'vdux'
import {Button} from 'vdux-containers'
import Link from 'components/Link'
import summon from 'vdux-summon'
import {Block} from 'vdux-ui'
import Form from 'vdux-form'

/**
 * <ForgotPassword/>
 */

export default summon(props => ({
  sendReset: ({username}) => ({
    sendingReset: {
      url: '/user/forgot',
      method: 'POST',
      body: {
        username
      }
    }
  })
}))(component({
  render ({props, actions, state}) {
    const {sendReset} = props
    const {success} = state

    return (
      <Block w='col_s' p='m' color='white' textAlign='center'>
        {
          success
            ? <Block lighter fs='s'>
                Reset request confirmed. Check your email.
            </Block>
            : <ForgotForm {...actions} sendReset={sendReset} />
        }
      </Block>
    )
  },

  reducer: {
    setSuccess: () => ({success: true})
  }
}))

/**
 * <ForgotForm/>
 */

function ForgotForm ({props}) {
  const {sendReset, sendingReset = {}, setSuccess} = props
  const {loading} = sendingReset

  return (
    <Block>
      <Form onSubmit={sendReset} onSuccess={setSuccess}>
        <BlockInput autofocus placeholder='EMAIL OR USERNAME' name='username' />
        <Button type='submit' busy={loading} wide bgColor='green' h={43} mt={10} lh='43px' fs={15}>
          Reset Password
        </Button>
      </Form>
      <Block mt>
        <Link href='/login' color='grey_light' hoverProps={{underline: true}}>
          Nevermind
        </Link>
      </Block>
    </Block>
  )
}
