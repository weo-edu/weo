/**
 * Imports
 */

import {Button, CSSContainer, wrap} from 'vdux-containers'
import ActivityQuestion from 'components/ActivityQuestion'
import {getOverviewQuestions} from 'lib/activity-helpers'
import ActivityMedia from 'components/ActivityMedia'
import ActivityPost from 'components/ActivityPost'
import objectEqual from '@f/object-equal'
import arrayEqual from '@f/array-equal'
import {Block, Icon} from 'vdux-ui'
import element from 'vdux/element'

/**
 * Type map
 */

const typeMap = {
  post: ActivityPost,
  question: ActivityQuestion,
  link: ActivityMedia,
  video: ActivityMedia,
  image: ActivityMedia,
  document: ActivityMedia,
  rich: ActivityMedia,
  file: ActivityMedia
}

const editingProps = {
  boxShadow: '0 0 12px rgba(black, .5)',
  z: 2
}

/**
 * <ActivityObject/>
 */

const ActivityObject = wrap(CSSContainer, ({editable}) => editable
  ? {hoverProps: {hover: true}}
  : {}
)({
  render({props}) {
    const {object, open, editing, editable, onEdit, hover, opening, ...rest} = props
    const Obj = typeMap[object.objectType]
    const editableProps = {
      onClick: () => open(object._id),
      bgColor: hover ? 'off_white' : 'white'
    }

    if (!Obj) throw new Error('<ActivityObject/>: unknown object type: ' + object.objectType)

    return (
      <Block
        opacity={opening ? .5 : 1}
        pageBreakInside='avoid'
        printProps={{p: 16}}
        bgColor='white'
        p={24}
        relative
        {...(editable && !editing ? editableProps : {})}
        {...(editing ? editingProps : {})}
        {...rest}>
        <Obj key={object._id} {...props} />
        {
          editable && (!editing && hover) &&
            <Icon
              absolute={{top: 0, left: 0}}

              color='grey_medium'
              name='drag_handle'
              textAlign='center'
              class='handle'
              cursor='move'
              h={24}
              wide />
        }
      </Block>
    )
  }
})

/**
 * Exports
 */

 export default ActivityObject
