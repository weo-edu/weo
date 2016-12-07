/**
 * Imports
 */

import ObjectControls from 'components/ObjectControls'
import MarkdownHelper from 'components/MarkdownHelper'
import LineTextarea from 'components/LineTextarea'
import TextToSpeech from 'components/TextToSpeech'
import {t, component, element} from 'vdux'
import {Block} from 'vdux-ui'

/**
 * <ActivityPost/>
 */

export default component({
  propTypes: {
    object: t.struct({
      objectType: t.enums.of('post')
    }),
    editing: t.maybe(t.Boolean),
    setSpeaking: t.Function,
    speakingId: t.maybe(t.String)
  },

  render ({props}) {
    const {object, editing, setSpeaking, speakingId, speechRate, speechEnabled, ...rest} = props

    if (editing) return <EditablePost {...props} />

    return (
      <Block {...rest}>
        {
          speechEnabled && object.displayName &&
          <TextToSpeech
            onStart={setSpeaking(object._id)}
            onEnd={setSpeaking(null)}
            rate={speechRate}
            text={object.displayName}
            current={speakingId === object._id}
            float='left' />
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
})

/**
 * <EditablePost/>
 */

const EditablePost = component({
  render ({props, actions}) {
    const {object} = props

    return (
      <Block>
        <Block py align='start'>
          <Block flex>
            <LineTextarea
              autofocus
              fs='s'
              lighter
              onInput={actions.editOriginalContent}
              defaultValue={object.originalContent} />
          </Block>
          <Block alignSelf='baseline'>
            <MarkdownHelper mt={8} menuProps={{mr: -12}} />
          </Block>
        </Block>
        <ObjectControls {...props} />
      </Block>
    )
  },

  controller: {
    * editOriginalContent ({props}, value) {
      const {onEdit, object} = props
      yield onEdit({...object, originalContent: value})
    }
  }
})
