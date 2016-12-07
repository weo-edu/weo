/**
 * Imports
 */

import {Button, Tooltip} from 'vdux-containers'
import {component, element} from 'vdux'
import {Block, Icon} from 'vdux-ui'

/**
 * <ObjectControls/>
 */

export default component({
  render ({props, actions, children}) {
    const {object, remove, open, saving} = props

    return (
      <Block p m={-24} mt={24} borderTop='1px solid grey_light' bgColor='off_white' align='space-between center'>
        <Block align='start center'>
          {children}
        </Block>
        <Block align='end stretch'>
          <Tooltip message='Delete'>
            <Btn onClick={remove(object)} h={32}>
              <Icon fs='s' name='delete' color='text' />
            </Btn>
          </Tooltip>
          <Tooltip message='Duplicate'>
            <Btn onClick={actions.duplicate} mx='s' h={32}>
              <Icon fs='s' name='content_copy' color='text' />
            </Btn>
          </Tooltip>
          <Tooltip message='Done'>
            <Btn onClick={open(null)} h={32} busy={saving} darkSpinner>
              <Icon fs='s' name='check_circle' color='text' />
            </Btn>
          </Tooltip>
        </Block>
      </Block>
    )
  },

  controller: {
    * duplicate ({props, context}) {
      const {insert, pos, object} = props
      const _id = yield context.generateObjectId()
      const newObj = {
        ...object,
        _id
      }

      delete newObj.id
      if (newObj.attachments) {
        newObj.attachments = newObj.attachments.map(att => {
          const newAtt = {...att}
          delete newAtt.id
          return newAtt
        })
      }

      yield insert(newObj, pos + 1)
    }
  }
})

/**
 * <Btn/>
 */

function Btn ({props, children}) {
  return (
    <Button
      hoverProps={{highlight: 0.03}}
      focusProps={{highlight: 0.03}}
      border='1px solid grey_medium'
      bgColor='off_white'
      color='text'
      px
      {...props}>
      {children}
    </Button>
  )
}
