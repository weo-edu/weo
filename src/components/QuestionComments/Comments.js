/**
 * Imports
 */

import {stopPropagation, component, element} from 'vdux'
import CommentCard from './CommentCard'
import {Block} from 'vdux-containers'
import summon from 'vdux-summon'
import {Icon} from 'vdux-ui'
import map from '@f/map'

/**
 * Constants
 */

const absolute = {left: 36, top: 0}
const hoverProps = {opacity: 1}

/**
 * <Comments/>
 */

export default summon(({activityId, question}) => ({
  makeAnnot: body => ({
    makingAnnot: {
      url: `/instance/${activityId}/annotate?objectId=${question._id}`,
      method: 'POST',
      body
    }
  }),
  editAnnot: body => ({
    editingAnnot: {
      url: `/share/${body._id}`,
      method: 'PUT',
      body
    }
  }),
  deleteAnnot: id => ({
    deletingAnnot: {
      url: `/share/${id}`,
      method: 'DELETE'
    }
  })
}))(component({
  render ({props, actions, state}) {
    const {
      comments, currentUser, actor, deleteAnnot,
      makingAnnot = {}, editingAnnot = {}
    } = props
    const showNew = !comments.length || state.showNew
    const isStudent = currentUser.userType === 'student'

    return (
      <Block
        onClick={stopPropagation}
        absolute={absolute}
        w={250}>
        <Block onClick={actions.toggleDD(null)}>
          {
            map(comment => <CommentCard
              submitting={makingAnnot.loading || editingAnnot.loading}
              toggleDD={actions.toggleDD(comment._id)}
              showDD={state.dropdownId === comment._id}
              actor={comment.actor}
              annotate={actions.annotate}
              isOwner={currentUser._id === comment.actor.id}
              deleteAnnot={deleteAnnot(comment._id)}
              comment={comment} />, comments)
          }
          <CommentCard
            dismiss={comments.length && actions.toggleNew}
            submitting={makingAnnot.loading || editingAnnot.loading}
            actor={currentUser}
            annotate={actions.annotate}
            hide={!showNew} />
          <Block
            onClick={actions.toggleNew}
            hoverProps={hoverProps}
            align='center center'
            hide={showNew || isStudent}
            opacity='.85'
            pointer
            pb='l'>
            <Icon lh='17px' name='add_circle_outline' fs='s' mr='s' />
            <Block lh='17px'>
              Leave a note for {actor.displayName}
            </Block>
          </Block>
        </Block>
      </Block>
    )
  },

  controller: {
    * annotate ({props}, model, annotation) {
      if (annotation) {
        annotation = {
          ...annotation,
          _object: [
            {
              ...annotation._object[0],
              originalContent: model.comment
            }
          ]
        }

        yield props.editAnnot(annotation)
      } else {
        yield props.makeAnnot({
          originalContent: model.comment
        })
      }
    }
  },

  reducer: {
    toggleNew: state => ({showNew: !state.showNew}),
    toggleDD: (state, id) => ({dropdownId: id})
  }
}))
