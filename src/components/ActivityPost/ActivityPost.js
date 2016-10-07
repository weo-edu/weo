/**
 * Imports
 */

import ObjectControls from 'components/ObjectControls'
import MarkdownHelper from 'components/MarkdownHelper'
import LineTextarea from 'components/LineTextarea'
import TextToSpeech from 'components/TextToSpeech'
import {Button} from 'vdux-containers'
import element from 'vdux/element'
import {Block} from 'vdux-ui'

/**
 * <ActivityPost/>
 */

function render ({props}) {
  const {object, editing, open, editable, onEdit, remove, setSpeaking, speakingId, speechRate, speechEnabled, ...rest} = props

  if (editing) return <EditablePost {...props} />

  return (
    <Block {...rest}>
      {
        speechEnabled && object.displayName &&
        <TextToSpeech
          onStart={() => setSpeaking(object._id)}
          onEnd={() => setSpeaking()}
          rate={speechRate}
          text={object.displayName}
          current={speakingId === object._id}
          float='left'/>
      }
      <Block
        fs='s'
        fw='200'
        lh='1.5em'
        class='markdown'
        innerHTML={object.content} />
    </Block>
  )
}

/**
 * <EditablePost/>
 */

function EditablePost ({props}) {
  const {object, onEdit, open} = props
  const {originalContent} = object

  return (
    <Block>
      <Block py align='start'>
        <Block flex>
          <LineTextarea
            autofocus
            fs='s'
            lighter
            onInput={e => onEdit({...object, originalContent: e.target.value})}
            defaultValue={originalContent} />
        </Block>
        <Block alignSelf='baseline'>
          <MarkdownHelper mt={8} menuProps={{mr: -12}} />
        </Block>
      </Block>
      <ObjectControls {...props} />
    </Block>

  )
}

/**
 * Exports
 */

export default {
  render
}
