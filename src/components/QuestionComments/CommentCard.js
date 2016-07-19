/**
 * Imports
 */

import {Button, Textarea, Block, DropdownMenu, MenuItem, wrap, CSSContainer} from 'vdux-containers'
import handleActions from '@f/handle-actions'
import createAction from '@f/create-action'
import {Icon, Card, Text} from 'vdux-ui'
import Avatar from 'components/Avatar'
import Document from 'vdux/Document'
import element from 'vdux/element'
import summon from 'vdux-summon'
import Form from 'vdux-form'
import moment from 'moment'
import map from '@f/map'


/**
 * Render
 */

function render ({props, state, local}) {
  const {dismiss = local(toggleEdit), ...rest} = props
  const isEdit = !props.comment || state.isEdit
  return (
    <Block>
    {
      isEdit
        ? <EditCard dismiss={dismiss} {...rest} />
        : <CommentCard
            toggleEdit={local(toggleEdit)}
            {...rest} />
    }
    </Block>
  )

}

function EditCard ({props}) {
  const {actor, comment, annotate, dismiss, ...rest} = props
  const message = comment && comment._object[0].originalContent
  return (
    <Card p mb {...rest}>
      <Block align='start' mb>
        <Avatar actor={actor} mr />
        <Block column align='center'>
          {actor.displayName}
          <Block fs='xxs' color='grey_medium'>
            Leave a note
          </Block>
        </Block>
      </Block>
      <Form onSubmit={annotate}>
        <Textarea
          focusProps={{border: '1px solid rgba(blue, 0.35)'}}
          placeholder='Write your comment…'
          borderColor='grey_light'
          defaultValue={message}
          errorPlacement='left'
          name='comment'
          autofocus
          rows={3}
          p='s'
          mb />
          <Button mr='s' px type='submit' text='Save' />
          <Button bgColor='grey_medium' hide={!dismiss} px onClick={dismiss} text='Cancel' />
      </Form>
    </Card>
  )
}

const CommentCard = wrap(CSSContainer, {
  hoverProps: {hover: true}
})({
  render ({props}) {
    const {
      dismiss, actor, isEdit, toggleEdit,
      annotate, comment, showDD, toggleDD
    } = props

    return (
      <Card p mb>
        <Block relative>
          <Block onClick={e => e.stopPropagation()}>
            <Icon
              absolute={{right: -6, top: -6}}
              opacity={props.hover ? 1 : 0}
              transition='opacity .35s'
              onClick={toggleDD}
              name='settings'
              pointer
              fs='xxs'/>
          </Block>
          <DropdownMenu hide={!showDD} w={120} m={-6} z={2}>
            <MenuItem align='start center' onClick={toggleEdit}>
              <Icon fs='xs' name='edit' mr/> Edit
            </MenuItem>
            <MenuItem align='start center'>
              <Icon fs='xs' name='delete' mr /> Delete
            </MenuItem>
          </DropdownMenu>
        </Block>
        <Block align='start' mb>
          <Avatar actor={actor} mr />
          <Block column align='center'>
            {actor.displayName}
            <Block fs='xxs' color='grey_medium'>
              { moment(comment.createdAt).fromNow() }
            </Block>
          </Block>
        </Block>
        <Block>
          { comment._object[0].originalContent }
        </Block>
      </Card>
    )
  }
})

/**
 * Actions
 */

const toggleEdit = createAction('<CommentCard/>: toggleEdit')

/**
 * Reducer
 */

const reducer = handleActions({
  [toggleEdit]: state => ({...state, isEdit: !state.isEdit})
})

/**
 * Exports
 */

export default {
  render,
  reducer
}