/**
 * Imports
 */

import {Modal, ModalBody, ModalFooter, ModalHeader, ErrorTip, Grid, Text, Block, Flex, Radio} from 'vdux-ui'
import {form, Button} from 'vdux-containers'
import validate from '@weo-edu/validate'
import toBlob from '@f/dataurl-to-blob'
import AvatarBlock from './AvatarBlock'
import {component, element} from 'vdux'
import * as avatarMap from './avatars'
import * as colors from 'lib/colors'
import Schema from '@weo-edu/schema'
import summon from 'vdux-summon'
import reduce from '@f/reduce'

/**
 * Constants
 */

let numPages = 0

/**
 * <AvatarPickerModal/>
 */

export default summon(() => ({
  changeAvatar: url => ({
    changingAvatar: {
      url: '/avatar/',
      method: 'PUT',
      body: {
        url
      }
    }
  })
}))(
form(({changeAvatar, user}, context) => ({
  fields: ['avatar'],
  validate: validate(schema),
  * onSubmit ({avatar}) {
    if (avatar === 'letters') {
      avatar = yield context.uploadFile(toBlob(letterAvatar(user)))
    }

    yield changeAvatar(avatar)
    yield context.closeModal()
    yield context.updateAvatar()
  }
}))(
component({
  initialState: {
    page: 0
  },

  render ({props, state, actions, context}) {
    const {user, fields, changingAvatar = {}} = props
    const {loading} = changingAvatar
    const {page} = state

    const extras = [{url: 'letters', name: 'letters'}]
    if (user.userType === 'teacher') {
      extras.unshift({url: 'upload', name: 'upload'})
    }

    const avatars = reduce((avatars, url, name) => {
      avatars.push({
        url,
        name
      })
      return avatars
    }, extras, avatarMap)

    const pageSize = 12
    numPages = Math.ceil(avatars.length / pageSize)
    const curAvatars = avatars.slice(page * pageSize, (page + 1) * pageSize)

    return (
      <Modal onDismiss={context.closeModal}>
        <ModalBody pb px={0}>
          <ModalHeader>
            Select an Avatar
          </ModalHeader>
          <Grid rowAlign='center' minHeight={360}>
            {
              curAvatars.map(({url, name}) =>
                <Radio
                  name='avatar'
                  btn={AvatarBlock}
                  checked={fields.avatar.value === name}
                  value={name}
                  uiProps={{
                    user,
                    avatar: name === 'letters'
                      ? letterAvatar(user)
                      : url
                  }} />
              )
            }
          </Grid>
          <ErrorTip show={fields.avatar.error} message='Must select avatar' placement='right' />
        </ModalBody>
        <ModalFooter bg='grey'>
          <Block flex align='start center'>
            <Button bgColor='black' icon='keyboard_arrow_left' mr='s' fs='s' h='30px' px='25' onClick={actions.prev} disabled={page === 0} />
            <Button bgColor='black' icon='keyboard_arrow_right' mr fs='s' h='30px' px='25' onClick={actions.next} disabled={page === (numPages - 1)} />
            <Flex>
              { dots(page, actions, numPages) }
            </Flex>
          </Block>
          <Text fs='xxs'>
            <Text pointer underline onClick={context.closeModal}>cancel</Text>
            <Text mx>or</Text>
          </Text>
          <Button type='submit' busy={loading}>Update</Button>
        </ModalFooter>
      </Modal>
    )
  },

  reducer: {
    next: state => ({page: Math.min(state.page + 1, (numPages - 1))}),
    prev: state => ({page: Math.max(state.page - 1, 0)}),
    go: (state, page) => ({page})
  }
})))

/**
 * Helpers
 */

function dots (page, actions, numPages) {
  const arr = Array.apply(null, Array(numPages))
  return (
    arr.map((_, i) => <Block pointer circle='5' bgColor={page === i ? 'white' : 'rgba(255,255,255,.5)'} ml='s' onClick={actions.go(i)} />)
  )
}

function letterAvatar (user) {
  const {name, color} = user
  const initials = (name.givenName[0] || '') + (name.familyName[0] || '')
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const size = 250

  canvas.width = canvas.height = size
  ctx.fillStyle = color || colors.pickerColors[0]
  ctx.fillRect(0, 0, size, size)
  ctx.font = size / 2.5 + 'px Lato'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = '#FFF'
  ctx.fillText(initials.toUpperCase(), size / 2, size / 2)

  return canvas.toDataURL('image/png')
}

/**
 * Validation
 */

const schema = Schema()
  .prop('avatar', 'string')
  .required(['avatar'])
