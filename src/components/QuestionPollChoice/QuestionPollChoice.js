/**
 * Imports
 */

import PollChoiceOverview from './PollChoiceOverview'
import {grey, blue, yellow, green, red} from 'lib/colors'
import {decodeNode, component, element} from 'vdux'
import TextToSpeech from 'components/TextToSpeech'
import BlockInput from 'components/BlockInput'
import {Button} from 'vdux-containers'
import Avatar from 'components/Avatar'
import {Block} from 'vdux-ui'
import Color from 'color'

/**
 * Colors
 */

const colors = [
  blue,
  yellow,
  green,
  red,
  Color(grey).lighten(0.6).rgbString()
].map(c => Color(c).lighten(0.3).rgbString())

/**
 * <QuestionPollChoice/>
 */

export default component({
  render ({props, actions}) {
    const {
      object, idx, editing, answerable, overview, submit,
      answer = [], actor, numAtt, setSpeaking, speechRate,
      speakingId, speechEnabled, remove
    } = props
    const {content, originalContent} = object
    const chosen = answer[0] === object._id
    const hasAnswer = !!answer.length
    const bgColor = hasAnswer && !overview
      ? chosen ? colors[idx % colors.length] : 'grey_light'
      : colors[idx % colors.length]

    if (overview) return <PollChoiceOverview bgColor={bgColor} {...props} />

    return (
      <Block
        onClick={answerable && submit(chosen ? [] : [object._id])}
        pointer={answerable}
        bgColor={bgColor}
        boxShadow='card'
        maxWidth='140px'
        flex='0 0 30%'
        flexShrink='1'
        rounded='4px'
        relative
        mx='1%'
        tall
        >
        {
          !editing && speechEnabled &&
          <TextToSpeech
            absolute={{top: 5, right: -5}}
            z={3}
            onStart={setSpeaking(object._id)}
            onEnd={setSpeaking(null)}
            rate={speechRate}
            text={object.displayName}
            current={speakingId === object._id} />
        }
        <Button zIndex={2} color='text' absolute='top 4px right 4px' icon='close' onClick={remove} fs='s' tabindex='-1' hide={!editing || numAtt === 1} />
        <Block pb='100%' wide relative>
          <Block absolute wide tall top left align='center center'>
            {
              !editing
                ? <Block p='s' class='markdown' fs='s' textAlign='center' innerHTML={content} />
                : <BlockInput
                  onInput={actions.editOriginalContent}
                  defaultValue={originalContent}
                  mx={5}
                  fs='s'
                  placeholder={`Choice #${idx + 1}`}
                  inputProps={{textAlign: 'center', p: '6px 12px 5px', fs: 's', fw: 200}}
                  autofocus={!content}
                  onKeydown={{backspace: decodeNode(actions.maybeRemove)}} />
            }
          </Block>
          { chosen && <ChosenMarker actor={actor} /> }
        </Block>
      </Block>
    )
  },

  controller: {
    * editOriginalContent ({props}, originalContent) {
      yield props.onEdit({...props.object, originalContent})
    },

    * maybeRemove ({props}, node) {
      const {focusPrevious, numAtt, remove} = props

      if (node.value === '' && numAtt > 1) {
        yield remove()
        yield focusPrevious(node)
      }
    }
  }
})

/**
 * <ChosenMarker/>
 */

function ChosenMarker ({props}) {
  const {actor} = props

  return (
    <Avatar
      absolute={{right: -6, top: -6}}
      border='2px solid white'
      boxSizing='content-box'
      boxShadow='z2'
      actor={actor}
      size='23%'
      m='auto' />
  )
}
