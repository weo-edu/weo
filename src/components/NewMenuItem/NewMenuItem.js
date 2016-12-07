/**
 * Imports
 */

import {stopPropagation, component, element, findDOMNode} from 'vdux'
import BlockInput from 'components/BlockInput'
import {Block, Button} from 'vdux-containers'
import Form from 'vdux-form'

/**
 * Constants
 */

const hoverProps = {highlight: 0.03}

/**
 * <NewMenuItem/>
 */

export default component({
  render ({props, actions, state, path}) {
    const {
      type = 'Item', openedProps = {}, closedProps = {},
      onSubmit, validate, loading, ...rest
    } = props
    const {opened} = state

    return (
      <Form onSubmit={onSubmit} onSuccess={!loading && actions.toggle} validate={validate} relative onChange={stopPropagation}>
        {
          opened
            ? <Block
              highlight='0.03'
              bgColor='white'
              p
              {...rest}
              {...openedProps}>
              <BlockInput
                autofocus
                autocomplete='off'
                errorPlacement='top'
                placeholder={type + ' Name …'}
                name='displayName' />
              <Block align='start center' mt>
                <Button px mr bgColor='grey' text='Cancel' onClick={actions.toggle} disabled={loading} />
                <Button id={path} px text='Create' type='submit' disabled={loading} />
              </Block>
            </Block>
            : <Block
              onClick={actions.toggle}
              hoverProps={hoverProps}
              align='start center'
              bgColor='white'
              pointer
              p
              {...rest}
              {...closedProps}>
              <Button bgColor='red' h='32px' w='38px' p='0' mr icon='add' fs='s' disabled={loading} />
              {type}
            </Block>
        }
      </Form>
    )
  },

  onUpdate (prev, next) {
    if (next.state.opened && !prev.state.opened) {
      return () => setTimeout(() => findDOMNode(next).scrollIntoView())
    }
  },

  reducer: {
    toggle: state => ({opened: !state.opened})
  }
})
