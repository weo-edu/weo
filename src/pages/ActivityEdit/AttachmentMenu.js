/**
 * Imports
 */

import {wrap, CSSContainer, Button} from 'vdux-containers'
import {generateObjectId} from 'middleware/objectId'
import handleActions from '@f/handle-actions'
import createAction from '@f/create-action'
import MediaModal from 'modals/MediaModal'
import {openModal} from 'reducer/modal'
import {Icon, Block} from 'vdux-ui'
import element from 'vdux/element'

/**
 * initialState
 */

function initialState ({props}) {
  return {
    open: props.startsOpen
  }
}

/**
 * <AttachmentMenu/>
 */

function render ({props, state, local}) {
  const {attach, startsOpen, defaultPoints = 10} = props

  const menu = [
    <Close onClick={local(toggle)} absolute='top -10px right -10px' hide={startsOpen} />,
    <AttachButton onClick={attachQuestion} icon='help' color='red' text='Question' hoverProps={{hover: true}} />,
    <AttachButton onClick={attachMedia('video')} icon='videocam' color='yellow' text='Video' hoverProps={{hover: true}} />,
    <AttachButton onClick={attachMedia('link')} icon='link' color='blue' text='Link' hoverProps={{hover: true}} />,
    <AttachButton onClick={attachMedia('image')} icon='camera_alt' color='green' text='Image' hoverProps={{hover: true}} />,
    <AttachButton onClick={attachMedia('document')} icon='insert_drive_file' color='red' text='Document' hoverProps={{hover: true}} />,
    <AttachButton onClick={create('post')} icon='subject' color='text' text='Text' hoverProps={{hover: true}} />
  ]

  return (
    <Block relative bgColor='grey_light' border='1px dashed grey_medium' wide mb='l' h={130} align='space-around center' px='l'>
      {
        state.open
          ? menu
          : <Button onClick={local(toggle)} pointer circle={55} boxShadow='card' icon='add' bgColor='blue' fs='m'>

            </Button>
      }
    </Block>
  )

  function attachMedia (type) {
    return () => openModal(() => <MediaModal
      onAccept={createAndAttach}
      type={type} />)
  }

  function create (type) {
    const obj = type === 'question'
      ? initQuestion()
      : {objectType: type}

    return () => createAndAttach(obj)
  }

  function * createAndAttach (object) {
    const id = yield generateObjectId()
    yield attach({
      object:{
        ...object,
        _id: id
      }
    })
    yield local(toggle)()
  }

  function * attachQuestion () {
    const id1 = yield generateObjectId()
    const id2 = yield generateObjectId()

    yield attach({
      object: {
        _id: id1,
        objectType: 'question',
        points: {
          max: defaultPoints
        },
        attachments: [{
          _id: id2,
          objectType: 'choice',
          correctAnswer: [id2]
        }]
      }
    })
    yield local(toggle)()
  }
}


/**
 * <Close/>
 */

function Close ({props}) {
  return (
    <Icon
      border='2px solid white'
      align='center center'
      bgColor='black'
      boxShadow='z1'
      color='white'
      name='close'
      circle={24}
      pointer
      fs='xs'
      {...props} />
  )
}

const AttachButton = wrap(CSSContainer)({
  render ({props, children}) {
    const {
      attach, type, text, onClick, icon, color, hover
    } = props

    return (
      <Block
        textAlign='center'
        onClick={onClick}
        pointer>
        <Icon
          transform={hover ? 'translateY(-6px)' : ''}
          transition='transform .15s'
          color={color}
          name={icon}
          fs={42}
          sq={50}/>
        <Block fs='s' lighter>{text}</Block>
      </Block>
    )
  }
})


/**
 * Actions
 */

const toggle = createAction('<ActivityEditor/>: toggle attachments')

/**
 * Reducer
 */

const reducer = handleActions({
  [toggle]: state => ({
    ...state,
    open: !state.open
   })
})


/**
 * Exports
 */

export default {
  initialState,
  render,
  reducer
}
