/**
 * Imports
 */

import BlockInput from 'components/BlockInput'
import {password} from 'lib/schemas/user'
import validate from '@weo-edu/validate'
import {component, element} from 'vdux'
import {Button} from 'vdux-containers'
import Schema from '@weo-edu/schema'
import summon from 'vdux-summon'
import {Block} from 'vdux-ui'
import Form from 'vdux-form'

/**
 * <ResetPassword/>
 */

export default summon(({token}) => ({
  resetPassword: ({password}) => ({
    resettingPassword: {
      url: `/user/reset?token=${token}`,
      method: 'PUT',
      body: {
        password
      }
    }
  })
}))(component({
  render ({props, actions, state}) {
    const {resetPassword} = props
    const {success} = state

    return (
      <Block w='col_s' p='m' color='white' textAlign='center'>
        {
          success
            ? <SuccessBlock />
            : <ResetForm resetPassword={resetPassword} {...actions} />
        }
      </Block>
    )
  },

  reducer: {
    setSuccess: state => ({success: true})
  }
}))

/**
 * <ResetForm/>
 */

function ResetForm ({props}) {
  const {resetPassword, resettingPassword = {}, setSuccess} = props
  const {loading} = resettingPassword

  return (
    <Form onSubmit={resetPassword} onSuccess={setSuccess} validate={validatePassword}>
      <BlockInput type='password' autofocus placeholder='PASSWORD' name='password' />
      <BlockInput type='password' placeholder='CONFIRM PASSWORD' name='confirm_password' />
      <Button type='submit' busy={loading} wide bgColor='green' h={43} mt={10} lh='43px' fs={15}>
        Reset Password
      </Button>
    </Form>
  )
}

/**
 * <SuccessBlock/>
 */

function SuccessBlock ({context}) {
  return (
    <Block fs='s' lighter>
      <Block>
        Password Reset Successful!
      </Block>
      <Button py px={40} fs='s' mt='l' boxShadow='z2' lighter onClick={context.setUrl('/login')}>
        Login Now
      </Button>
    </Block>
  )
}

/**
 * Validation
 */

function validatePassword (model) {
  const result = validate(Schema()
    .prop('password', password)
    .required('password'))(model)

  if (model.password !== model.confirm_password) {
    result.valid = false
    result.errors = result.errors || []
    result.errors.push({
      field: 'confirm_password',
      message: 'Must match password'
    })
  }

  delete model.confirm_password
  return result
}
