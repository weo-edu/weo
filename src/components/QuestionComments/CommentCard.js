/**
 * Imports
 */

import {Button, Textarea, DropdownMenu, MenuItem, wrap, CSSContainer} from 'vdux-containers'
import {stopPropagation, component, element} from 'vdux'
import {Icon, Card, Block} from 'vdux-ui'
import Avatar from 'components/Avatar'
import Form from 'vdux-form'
import moment from 'moment'

/**
 * <CommentCard/>
 */

export default component({
  render ({props, state, actions}) {
    const {dismiss = actions.toggleEdit(false)} = props
    const isEdit = !props.comment || state.isEdit

    return (
      <Block>
        {
        isEdit
          ? <EditCard toggleEdit={actions.toggleEdit} {...props} dismiss={dismiss} />
          : <CommentCard toggleEdit={actions.toggleEdit} {...props} />
      }
      </Block>
    )
  },

  reducer: {
    toggleEdit: (state, opened) => ({
      isEdit: opened !== undefined ? opened : !state.isEdit
    })
  }
})

/**
 * <EditCard/>
 */

const EditCard = component({
  render ({props, actions}) {
    const {actor, comment, dismiss, submitting, ...rest} = props
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
        <Form onSubmit={actions.save}>
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
          <Button busy={submitting} mr='s' px type='submit' text='Save' />
          <Button bgColor='grey_medium' hide={!dismiss} px onClick={dismiss} text='Cancel' />
        </Form>
      </Card>
    )
  },

  controller: {
    * save ({props}, model) {
      const {comment, annotate, toggleEdit, dismiss} = props

      if (!model.comment) return

      yield annotate(model, comment)
      yield toggleEdit(false)
      if (dismiss) {
        yield dismiss()
      }
    }
  }
})

/**
 * <CommentCard/>
 */

const CommentCard = wrap(CSSContainer, {
  hoverProps: {hover: true}
})(component({
  render ({props}) {
    const {
      actor, toggleEdit, deleteAnnot,
      comment, showDD, toggleDD, isOwner
    } = props

    return (
      <Card p mb>
        <Block relative>
          <Block onClick={stopPropagation} hide={!isOwner}>
            <Icon
              absolute={{right: -6, top: -6}}
              opacity={props.hover ? 1 : 0}
              transition='opacity .35s'
              onClick={toggleDD}
              name='settings'
              pointer
              fs='xxs' />
          </Block>
          <DropdownMenu hide={!showDD} w={120} m={-6} z={2}>
            <MenuItem align='start center' onClick={toggleEdit(true)}>
              <Icon fs='xs' name='edit' mr /> Edit
            </MenuItem>
            <MenuItem align='start center' onClick={deleteAnnot}>
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
}))
