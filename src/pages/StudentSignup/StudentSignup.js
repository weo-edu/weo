/**
 * Imports
 */

import {Google, Facebook, Microsoft} from 'components/OAuthButtons'
import {Flex, Block, DecoLine, Button} from 'vdux-containers'
import BlockInput from 'components/BlockInput'
import {component, element} from 'vdux'
import validate from 'lib/validate'
import summon from 'vdux-summon'
import Form from 'vdux-form'

/**
 * Student signup page
 */

export default summon(props => ({
  createStudent: body => ({
    creatingStudent: {
      url: '/auth/user',
      method: 'POST',
      body
    }
  })
}))(component({
  render ({props, context, actions}) {
    const {createStudent, creatingStudent = {}} = props
    const {loading} = creatingStudent

    return (
      <Form onSubmit={createStudent} onSuccess={actions.handleSuccess} validate={validateStudent}>
        <input type='hidden' name='userType' value='student' />
        <Flex>
          <BlockInput autofocus name='name[givenName]' placeholder='FIRST NAME' />
          <BlockInput name='name[familyName]' placeholder='LAST NAME' ml={6} />
        </Flex>
        <BlockInput name='username' placeholder='USERNAME' />
        <BlockInput name='email' placeholder='EMAIL (OPTIONAL)' />
        <BlockInput type='password' name='password' placeholder='PASSWORD' />
        <BlockInput type='password' name='confirm_password' placeholder='CONFIRM PASSWORD' />
        <Block color='white'>
          <Button busy={loading} type='submit' wide bgColor='green' h={43} mt={10} lh='43px' fs={15}>
            Sign Up Now
          </Button>
          <Flex align='space-around center' m='m'>
            <DecoLine w='36%' />or<DecoLine w='36%' />
          </Flex>
          <Flex align='space-between center' pt={10}>
            <Google w='calc(50% - 6px)' onClick={context.oauthCreate('google', {userType: 'student'})}>Sign in With Google</Google>
            <Facebook w='calc(50% - 6px)' onClick={context.oauthCreate('facebook', {userType: 'student'})}>Sign in With Facebook</Facebook>
          </Flex>
          <Microsoft w='100%' mt onClick={context.oauthCreate('office65', {userType: 'student'})}>Sign in With Office365</Microsoft>
        </Block>
      </Form>
    )
  },

  controller: {
    * handleSuccess ({context}, user) {
      yield context.postLogin(user)
    }
  }
}))

/**
 * validateStudent
 */

function validateStudent (model) {
  if (!model.email) delete model.email

  const result = validate.student(model)

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
