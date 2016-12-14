/**
 * Imports
 */

import {Modal, ModalBody, ModalFooter, ModalHeader, Grid, Text, Icon, Block} from 'vdux-ui'
import {Button, CSSContainer, wrap} from 'vdux-containers'
import {component, element} from 'vdux'
import * as colors from 'lib/colors'
import summon from 'vdux-summon'
import Form from 'vdux-form'

/**
 * Constants
 */

const {pickerColors, blue} = colors

/**
 * <ColorPickerModal/>
 */

export default summon(({user}) => ({
  updateColor: color => ({
    submitting: {
      url: '/user',
      method: 'PUT',
      invalidates: false,
      body: {
        ...user,
        color
      }
    }
  })
}))(component({
  initialState: ({props}) => ({
    selected: props.user.color
  }),

  render ({props, state, actions, context}) {
    const {updateColor, submitting = {}} = props
    const {loading} = submitting
    const {selected} = state

    return (
      <Modal onDismiss={context.closeModal}>
        <Form onSubmit={updateColor(selected)} onSuccess={context.closeModal}>
          <ModalBody pb px={0}>
            <ModalHeader>
              Select a Color
            </ModalHeader>
            <Grid rowAlign='center'>
              {
                pickerColors.map(
                  color => <ColorBlock onClick={actions.choose(color)} color={color} selected={color === selected} />)
              }
            </Grid>
          </ModalBody>
          <ModalFooter bg='grey'>
            <Text fs='xxs'>
              <Text pointer underline onClick={context.closeModal}>cancel</Text>
              <Text mx>or</Text>
            </Text>
            <Button type='submit' busy={loading}>Update</Button>
          </ModalFooter>
        </Form>
      </Modal>
    )
  },

  reducer: {
    choose: (state, selected) => ({selected})
  }
}))

/**
 * <ColorBlock/> component
 */

const ColorBlock = wrap(CSSContainer, {hoverProps: {hovered: true}})(component({
  render ({props}) {
    const {color, hovered, selected, ...rest} = props

    return (
      <Block
        tabindex='-1'
        outline='3px solid transparent'
        outlineColor={hovered || selected ? blue : 'transparent'}
        transition='outline-color .35s'
        outlineOffset='2px'
        bg={color}
        relative
        sq='100'
        pointer
        m='10'
        {...rest}>
        <Icon
          transition='transform .35s'
          transform={selected ? 'scale(1)' : 'scale(0)'}
          name='check'
          align='center center'
          color='blue'
          bg='white'
          fs='19'
          circle='25'
          absolute
          right
          top
          m='s' />
      </Block>
    )
  }
}))
