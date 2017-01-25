/**
 * Imports
 */

import {Flex, Tooltip} from 'vdux-containers'
import {component, element} from 'vdux'
import {Block, Icon} from 'vdux-ui'

/**
 * Constants
 */

const ttProps = {whiteSpace: 'normal'}

/**
 * <SettingsRow/>
 */

export default component({
  render ({props, actions, children}) {
    const {prop, name, placeholder, message, clickable = true, ...rest} = props
    const text = Array.isArray(prop) ? prop.join(', ') : prop
    const keyWidth = '25%'
    const rowProps = {
      hoverProps: {bgColor: clickable && 'rgba(blue_light, .06)'},
      activeProps: {bgColor: clickable && 'rgba(blue_light, .1)'},
      borderBottom: '1px solid grey_light',
      pointer: clickable,
      fw: 'lighter',
      p: 'l',
      fs: 's',
      onClick: props.Modal && actions.openModal,
      ...rest
    }

    return (
      <Flex {...rowProps}>
        <Block flex={keyWidth} align='start center'>
          {name}
          {
            message &&
            <Tooltip message={message} align='center center' tooltipProps={ttProps}>
              <Icon name='info' fs='xs' ml='s' />
            </Tooltip>
          }
        </Block>
        <Block flex color={text ? 'text' : 'grey_medium'}>
          {
            children.length ? children : ((text === undefined || text === '') ? placeholder : text)
          }
        </Block>
      </Flex>
    )
  },

  controller: {
    * openModal ({props, context}) {
      yield context.openModal(() => props.Modal)
    }
  }
})
