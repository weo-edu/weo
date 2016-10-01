/**
 * Imports
 */

import {generateObjectId} from 'middleware/objectId'
import {Button, Tooltip} from 'vdux-containers'
import {Block, Icon} from 'vdux-ui'
import element from 'vdux/element'

/**
 * <ObjectControls/>
 */

function render ({props, children}) {
  const {object, remove, open, insert, pos, saving} = props

  return (
    <Block p m={-24} mt={24} borderTop='1px solid grey_light' bgColor='off_white' align='space-between center'>
      <Block align='start center'>
        {children}
      </Block>
      <Block align='end stretch'>
        <Tooltip message='Delete'>
          <Btn onClick={() => remove(object)} h={32}>
            <Icon fs='s' name='delete' color='text' />
          </Btn>
        </Tooltip>
        <Tooltip message='Duplicate'>
          <Btn onClick={() => duplicate()} mx='s' h={32}>
            <Icon fs='s' name='content_copy' color='text' />
          </Btn>
        </Tooltip>
        <Tooltip message='Done'>
          <Btn onClick={() => open(null)} h={32} busy={saving} darkSpinner>
            <Icon fs='s' name='check_circle' color='text' />
          </Btn>
        </Tooltip>
      </Block>
    </Block>
  )

  function * duplicate () {
    const _id = yield generateObjectId()
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

    yield insert({object: newObj, idx: pos + 1})
  }
}

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

/**
 * Exports
 */

export default {
  render
}
