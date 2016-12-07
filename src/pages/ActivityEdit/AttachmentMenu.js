/**
 * Imports
 */

import {wrap, CSSContainer, Button} from 'vdux-containers'
import MediaModal from 'modals/MediaModal'
import {component, element} from 'vdux'
import {Icon, Block} from 'vdux-ui'

/**
 * <AttachmentMenu/>
 */

export default component({
  initialState: ({props}) => ({
    open: props.startsOpen
  }),

  render ({props, state, actions}) {
    const {startsOpen} = props

    const menu = [
      <Close onClick={actions.toggle} absolute='top -10px right -10px' hide={startsOpen} />,
      <AttachButton onClick={actions.attachQuestion} icon='help' color='red' text='Question' hoverProps={{hover: true}} />,
      <AttachButton onClick={actions.attachMedia('video')} icon='videocam' color='yellow' text='Video' hoverProps={{hover: true}} />,
      <AttachButton onClick={actions.attachMedia('link')} icon='link' color='blue' text='Link' hoverProps={{hover: true}} />,
      <AttachButton onClick={actions.attachMedia('image')} icon='camera_alt' color='green' text='Image' hoverProps={{hover: true}} />,
      <AttachButton onClick={actions.attachMedia('document')} icon='insert_drive_file' color='red' text='Document' hoverProps={{hover: true}} />,
      <AttachButton onClick={actions.createAndAttach({objectType: 'post'})} icon='subject' color='text' text='Text' hoverProps={{hover: true}} />
    ]

    return (
      <Block relative bgColor='grey_light' border='1px dashed grey_medium' wide mb='l' h={130} align='space-around center' px='l'>
        {
          state.open
            ? menu
            : <Button onClick={actions.toggle} pointer circle={55} boxShadow='card' icon='add' bgColor='blue' fs='m' />
        }
      </Block>
    )
  },

  controller: {
    * attachMedia ({context, actions}, type) {
      yield context.openModal(() => (
        <MediaModal onAccept={actions.createAndAttach} type={type} />
      ))
    },

    * createAndAttach ({props, actions, context}, object) {
      const id = yield context.generateObjectId()

      yield props.attach({
        ...object,
        _id: id
      })

      yield actions.toggle()
    },

    * attachQuestion ({actions, context, props}) {
      const {attach, defaultPoints = 10} = props
      const id1 = yield context.generateObjectId()
      const id2 = yield context.generateObjectId()

      yield attach({
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
      })

      yield actions.toggle()
    }
  },

  reducer: {
    toggle: state => ({open: !state.open})
  }
})

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

/**
 * <AttachButton/>
 */

const AttachButton = wrap(CSSContainer)({
  render ({props, children}) {
    const {text, onClick, icon, color, hover} = props

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
          sq={50} />
        <Block fs='s' lighter>{text}</Block>
      </Block>
    )
  }
})
