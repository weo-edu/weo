/**
 * Imports
 */

import QuestionAttachment from 'components/QuestionAttachment'
import QuestionComments from 'components/QuestionComments'
import ObjectControls from 'components/ObjectControls'
import MarkdownHelper from 'components/MarkdownHelper'
import {generateObjectId} from 'middleware/objectId'
import LineTextarea from 'components/LineTextarea'
import QuestionTypeMenu from './QuestionTypeMenu'
import {Button, Toggle} from 'vdux-containers'
import handleActions from '@f/handle-actions'
import createAction from '@f/create-action'
import {Block, Badge, Icon} from 'vdux-ui'
import element from 'vdux/element'
import getProp from '@f/get-prop'
import summon from 'vdux-summon'
import map from '@f/map'

/**
 * Style props objects
 */

const markdownMenuProps = {mr: -12}
const highlightProps = {opacity: 1}

/**
 * <EditableQuestion/>
 */

function render ({props}) {
  const {object, idx,  onEdit, selectObject, isSelected, ...rest} = props
  const {poll, attachments = [], originalContent, randomize, caseSensitive} = object
  const type = getProp('0.objectType', attachments)
  const isMultipleChoice = !poll && type === 'choice'
  // Make sure type is choice because poll doesn't get set
  // false when switching to short or free
  const isPoll = poll && type === 'choice'

  return (
    <Block fw='lighter' relative onClick={() => selectObject(object._id)} {...rest}>
      <Block id={object._id} />
      <Block align='start' py mb>
        <Badge mr='l' bgColor={isSelected ? 'blue' : 'grey_medium'} pt={3} size={25}>{idx + 1}</Badge>
        <Block flex>
          <Block align='start center' mt={-8} mb='l'>
            <Block flex>
              <LineTextarea fs='s' placeholder='Ask your class a question…' lighter onInput={e => onEdit({...object, originalContent: e.target.value})} defaultValue={originalContent} autofocus />
            </Block>
            <Block alignSelf='baseline' relative z={3}>
              <MarkdownHelper mt={8} menuProps={markdownMenuProps} />
            </Block>
          </Block>
          <Block class='choice-container' align='start' column={isMultipleChoice} onKeypress={{enter: [type === 'choice' && insert, e => focusNext(e.target)]}}>
            {
              map((att, i) => <QuestionAttachment
                  focusPrevious={focusPrevious}
                  remove={() => onEdit({
                    ...object,
                    attachments: attachments.filter(({_id}) => _id !== att._id)
                  })}
                  onEdit={newObj => onEdit({
                    ...object,
                    attachments: attachments.map(att => att._id === newObj._id
                      ? newObj
                      : att)
                  })}
                  editing
                  object={att}
                  key={att._id}
                  numAtt={attachments.length}
                  poll={poll}
                  idx={i} />, attachments)
            }
            {
              isMultipleChoice && (
                <Block key={`add_${attachments.length}`} mt='s' align='start center' wide>
                  <Button
                    onClick={e => [attach('choice')(), focusLast(e.target)]}
                    hoverProps={highlightProps}
                    focusProps={highlightProps}
                    transition='opacity .15s'
                    bgColor='grey_medium'
                    borderWidth='0'
                    opacity='.7'
                    color='text'
                    h={46}
                    w='70%'
                    pill
                    mr>
                    <Block align='start center' flex>
                      <Icon ml={-6} mr align='center center' name='add' sq={21} fs='s' color='white'/>
                      <Block bg='white' h={32} lh='32px' px fs='s' color='grey_medium' lighter flex mr={6} border='1px solid rgba(black, .1)' textAlign='left' cursor='text'>
                        Add Choice
                      </Block>
                    </Block>
                  </Button>
                </Block>
              )
            }
            {
              isPoll && attachments.length < 6 && (
                <Block key={`add_${attachments.length}`} align='center center' mr={-24}>
                  <Button onClick={attach('choice')} m='auto' bgColor='grey' p={0} sq={50} ml='s'>
                    <Icon name='add' fs='s' />
                  </Button>
                </Block>
              )
            }
          </Block>
        </Block>
      </Block>
      <ObjectControls {...props}>
        <QuestionTypeMenu mx object={object} attach={attach} />
        {
          isMultipleChoice &&
            <Toggle
              onChange={e => onEdit({...object, randomize: e.target.checked})}
              label='Shuffle Choice Order'
              checked={randomize}
              w={350}
              ml/>
        }
        {
          type === 'shortAnswer' &&
            <Toggle
              onChange={e => onEdit({
                ...object,
                attachments: [{
                  ...object.attachments[0],
                  caseSensitive: e.target.checked
                }]
              })}
              label='Case Sensitive'
              checked={object.attachments[0].caseSensitive}
              w={350}
              ml/>
        }
      </ObjectControls>
    </Block>
  )

  function insert (e) {
    const p = findParent(e.target)
    const inputs = [].slice.call(p.querySelectorAll('input[type="text"]'))
    const idx = inputs.indexOf(e.target)

    return attach('choice', undefined, false, idx + 1)()
  }

  function attach (type, poll, removeAll, idx) {
    return function * () {
      const id = yield generateObjectId()

      let correctAnswer = []
      if(removeAll) {
        correctAnswer = type === 'choice' && !poll
          ? [id]
          : type === 'shortAnswer' ? ['Answer 1'] : []
      }

      const newObj = {
        _id: id,
        objectType: type,
        correctAnswer
      }

      const newAtts = removeAll ? [] : attachments.slice()
      if (idx === undefined || idx === -1) idx = attachments.length
      newAtts.splice(idx, 0, newObj)

      yield onEdit({
        ...object,
        poll: poll === undefined ? object.poll : poll,
        attachments: newAtts
      })
    }
  }
}

/**
 * Helpers
 */

// XXX This is a bit of a hack to give focus to the previous
// choice when deleting
function focusPrevious (node) {
  const p = findParent(node)

  const inputs = [].slice.call(p.querySelectorAll('input[type="text"]'))
  if (inputs.length) {
    const idx = inputs.indexOf(node)
    const focusIdx = idx === 0 ? 1 : idx - 1

    setTimeout(() => inputs[focusIdx] && inputs[focusIdx].focus(), 50)
  }
}

function focusNext (node) {
  setTimeout(() => {
    const p = findParent(node)
    const inputs = [].slice.call(p.querySelectorAll('input[type="text"]'))
    if (inputs.length) {
      const idx = inputs.indexOf(node)
      const focusIdx = idx === 0 ? 1 : idx + 1
      inputs[focusIdx].focus()
    }
  }, 50)
}

function focusLast (node) {
  const p = findParent(node)

  // Wait until the next choice is rendered
  setTimeout(() => {
    const inputs = [].slice.call(p.querySelectorAll('input[type="text"]'))
    if (inputs.length) {
      inputs[inputs.length - 1].focus()
    }
  }, 30)
}

function findParent (node) {
  let p = node

  while ((p = p.parentNode) && p.className.indexOf('choice-container') === -1)
    ;

  return p
}

/**
 * Exports
 */

export default {
  render
}
