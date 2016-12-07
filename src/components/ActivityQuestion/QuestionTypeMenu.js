/**
 * Imports
 */

import {questionIcon, questionDisplay} from 'lib/activity-helpers'
import {Dropdown, MenuItem, Button} from 'vdux-containers'
import {t, component, element} from 'vdux'
import {Block, Icon} from 'vdux-ui'

/**
 * QuestionTypeMenu
 */

export default component({
  propTypes: {
    attach: t.Function,
    object: t.Object
  },

  render ({props}) {
    const {attach, object, ...rest} = props

    return (
      <Dropdown btn={<Btn object={object} relative {...rest} />} wide z={2}>
        <Item object={object} onClick={attach('text', false, true)} type='text' />
        <Item object={object} onClick={attach('shortAnswer', false, true)} type='shortAnswer' />
        <Item object={object} onClick={attach('choice', false, true)} type='choice' />
        <Item object={object} onClick={attach('choice', true, true)} type='poll' />
      </Dropdown>
    )
  }
})

/**
 * <Btn/>
 */

function Btn ({props}) {
  const {object, ...rest} = props
  return (
    <Button
      align='space-between center'
      bgColor='grey'
      uppercase
      w={190}
      z={2}
      px
      {...rest}>
      <Block align='start center' flex>
        <Icon name={questionIcon(object)} fs='s' mr='s' />
        <Block>{questionDisplay(object)}</Block>
      </Block>
      <Icon name='arrow_drop_down' mr={-8} />
    </Button>
  )
}

/**
 * <Item/>
 */

function Item ({props}) {
  const {type, object, onClick, ...rest} = props
  const cur = object.poll
    ? type === 'poll'
    : object.attachments[0].objectType === type
  return (
    <MenuItem
      highlight={cur ? 0.08 : 0}
      align='start center'
      whiteSpace='nowrap'
      onClick={!cur && onClick}
      {...rest}>
      <Icon name={questionIcon(type)} fs='s' mr />
      <Block>{questionDisplay(type)}</Block>
    </MenuItem>
  )
}
