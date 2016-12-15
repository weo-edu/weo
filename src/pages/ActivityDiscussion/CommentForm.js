/**
 * Imports
 */

import {Button, Textarea} from 'vdux-containers'
import validate from '@weo-edu/validate'
import {component, element} from 'vdux'
import Avatar from 'components/Avatar'
import Schema from '@weo-edu/schema'
import summon from 'vdux-summon'
import {Block} from 'vdux-ui'
import Form from 'vdux-form'

/**
 * <CommentForm/>
 */

export default summon(({id}) => ({
  makeComment: body => ({
    makingComent: {
      url: '/share',
      method: 'POST',
      body
    }
  })
}))(component({
  render ({props, actions}) {
    const {
      currentUser, makingComment = {}
    } = props
    return (
      <Form p='l' bg='off_white' borderTop='1px solid rgba(black, .05)' align='start start' onSubmit={actions.createShare} validate={validateComment}>
        <Avatar actor={currentUser} size='40px' />
        <Block flex mx>
          <Textarea
            border='rgba(grey, 0.15)'
            errorPlacement='left'
            placeholder='Write your comment…'
            borderColor='grey_light'
            focusProps={{borderColor: 'rgba(blue, 0.35)'}}
            name='comment'
            lh='1.5em'
            rows={3}
            p />
        </Block>
        <Button busy={makingComment.loading} bgColor='grey' type='submit'>Submit</Button>
      </Form>
    )
  },

  controller: {
    * createShare ({props}, model) {
      const {classId, id, makeComment} = props
      const type = classId === 'public' ? 'public' : 'group'
      const comment = {
        _object: [{
          attachments: [],
          objectType: 'comment',
          originalContent: model.comment
        }],
        channels: [`share!${id}.replies`],
        shareType: 'share',
        contexts: [{
          allow: [
            {id: `${type}:teacher:${classId}`},
            {id: `${type}:student:${classId}`}
          ],
          descriptor: {
            displayName: classId,
            id: classId,
            url: '/'
          }
        }]
      }

      yield makeComment(comment)
    }
  }
}))

/**
 * Validate
 */

function validateComment (model) {
  return validate(Schema()
    .prop('comment', Schema('string').min(1, 'Required'))
    .required('comment'))(model)
}
