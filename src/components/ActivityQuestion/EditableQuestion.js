/**
 * Imports
 */

import QuestionAttachment from 'components/QuestionAttachment'
import ObjectControls from 'components/ObjectControls'
import MarkdownHelper from 'components/MarkdownHelper'
import {t, decodeNode, component, element} from 'vdux'
import LineTextarea from 'components/LineTextarea'
import QuestionTypeMenu from './QuestionTypeMenu'
import {Button, Toggle, Tooltip} from 'vdux-containers'
import {Block, Badge, Icon} from 'vdux-ui'
import sleep from '@f/sleep'
import map from '@f/map'

/**
 * Style props objects
 */

const markdownMenuProps = {mr: -12}
const highlightProps = {opacity: 1}

/**
 * <EditableQuestion/>
 */

export default component({
  propTypes: {
    object: t.Object,
    idx: t.Integer,
    selectObject: t.Function,
    isSelected: t.Boolean
  },

  render ({props, actions}) {
    const {object, idx, selectObject, isSelected, ...rest} = props
    const {poll, attachments = [], originalContent, randomize} = object
    const type = attachments[0] && attachments[0].objectType
    const isMultipleChoice = !poll && type === 'choice'
    // Make sure type is choice because poll doesn't get set
    // false when switching to short or free
    const isPoll = poll && type === 'choice'

    const focusNext = decodeNode(actions.focusNext)
    const focusLast = decodeNode(actions.focusLast)
    const insert = decodeNode(actions.insert)

    return (
      <Block fw='lighter' relative onClick={selectObject(object._id)} {...rest}>
        <Block id={object._id} />
        <Block align='start' py mb>
          <Badge mr='l' bgColor={isSelected ? 'blue' : 'grey_medium'} pt={3} size={25}>{idx + 1}</Badge>
          <Block flex>
            <Block align='start center' mt={-8} mb='l'>
              <Block flex>
                <LineTextarea fs='s' placeholder='Ask your class a question…' lighter onInput={actions.editOriginalContent} defaultValue={originalContent} autofocus />
              </Block>
              <Block alignSelf='baseline' relative z={3}>
                <MarkdownHelper mt={8} menuProps={markdownMenuProps} />
              </Block>
            </Block>
            <Block class='choice-container' align='start' column={isMultipleChoice} onKeypress={{enter: [type === 'choice' && insert, focusNext]}}>
              {
                map((att, i) => <QuestionAttachment
                  focusPrevious={actions.focusPrevious}
                  remove={actions.remove(att)}
                  onEdit={actions.editChild}
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
                      onClick={[actions.attach('choice'), focusLast]}
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
                        <Icon ml={-6} mr align='center center' name='add' sq={21} fs='s' color='white' />
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
                    <Button onClick={actions.attach('choice')} m='auto' bgColor='grey' p={0} sq={50} ml='s'>
                      <Icon name='add' fs='s' />
                    </Button>
                  </Block>
                )
              }
            </Block>
          </Block>
        </Block>
        <ObjectControls {...props}>
          <QuestionTypeMenu mx object={object} attach={actions.attach} />
          {
            isMultipleChoice &&
              <Toggle
                onChange={actions.setRandomize}
                label={<Block align='start center'>
                    Shuffle Choice Order
                    <Tooltip
                      tooltipProps={{w: 200, whiteSpace: 'normal', fs: 'xs'}}
                      message='When enabled, each student will receive their options in a different randomized order.'>
                      <Icon fs='s' ml='s' name='help_outline'/>
                    </Tooltip>
                  </Block>}
                checked={randomize}
                w={350}
                ml />
          }
          {
            type === 'shortAnswer' &&
              <Toggle
                onChange={actions.setCaseSensitivity}
                label={<Block align='start center'>
                    Case Sensitive
                    <Tooltip
                      tooltipProps={{w: 200, whiteSpace: 'normal', fs: 'xs'}}
                      message={'When enabled, students\' answers will need to match the same case as the provided answers.'}>
                      <Icon fs='s' ml='s' name='help_outline'/>
                    </Tooltip>
                  </Block>}
                checked={object.attachments[0].caseSensitive}
                w={180}
                ml />
          }
          {

            (type === 'shortAnswer' || type === 'text') &&
              <Toggle
                label={<Block align='start center'>
                    Spell Check
                    <Tooltip
                      tooltipProps={{w: 200, whiteSpace: 'normal', fs: 'xs'}}
                      message={'When enabled, students will see spell check information as they type their solutions.'}>
                      <Icon fs='s' ml='s' name='help_outline'/>
                    </Tooltip>
                  </Block>}
                onChange={actions.setSpelling}
                checked={object.spellCheck}
                w={180}
                />
          }
        </ObjectControls>
      </Block>
    )
  },

  controller: {
    * insert ({actions}, node) {
      const p = findParent(node)
      const inputs = [].slice.call(p.querySelectorAll('input[type="text"]'))
      const idx = inputs.indexOf(node)

      yield actions.attach('choice', undefined, false, idx + 1)()
    },

    * remove ({props}, att) {
      const {object, onEdit} = props
      yield onEdit({
        ...object,
        attachments: object.attachments.filter(({_id}) => _id !== att._id)
      })
    },

    * editChild ({props}, newObj) {
      const {onEdit, object} = props

      yield onEdit({
        ...object,
        attachments: object.attachments.map(att => att._id === newObj._id
          ? newObj
          : att)
      })
    },

    * editOriginalContent ({props}, value) {
      const {onEdit, object} = props

      yield onEdit({
        ...object,
        originalContent: value
      })
    },

    * setRandomize ({props}) {
      const {onEdit, object} = props

      yield onEdit({
        ...object,
        randomize: !object.randomize
      })
    },

    * setSpelling ({props}) {
      const {onEdit, object} = props

      yield onEdit({
        ...object,
        spellCheck: !object.spellCheck
      })
    },

    * setCaseSensitivity ({props}) {
      const {onEdit, object} = props

      yield onEdit({
        ...object,
        attachments: [{
          ...object.attachments[0],
          caseSensitive: !object.attachments[0].caseSensitive
        }]
      })
    },

    * attach ({props, context}, type, poll, removeAll, idx) {
      const {onEdit, object} = props
      const {attachments = []} = object

      const id = yield context.generateObjectId()

      let correctAnswer = []
      if (removeAll) {
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
    },

    * focusPrevious (model, node) {
      const p = findParent(node)
      if (!p) return

      const inputs = [].slice.call(p.querySelectorAll('input[type="text"]'))
      if (inputs.length) {
        const idx = inputs.indexOf(node)
        const focusIdx = idx === 0 ? 1 : idx - 1

        yield sleep(50)
        inputs[focusIdx] && inputs[focusIdx].focus()
      }
    },

    * focusNext (model, node) {
      yield sleep(50)

      const p = findParent(node)
      if (!p) return

      const inputs = [].slice.call(p.querySelectorAll('input[type="text"]'))
      if (inputs.length) {
        const idx = inputs.indexOf(node)
        const focusIdx = idx === 0 ? 1 : idx + 1
        inputs[focusIdx].focus()
      }
    },

    * focusLast (model, node) {
      const p = findParent(node)
      if (!p) return

      // Wait until the next choice is rendered
      yield sleep(30)

      const inputs = [].slice.call(p.querySelectorAll('input[type="text"]'))
      if (inputs.length) {
        inputs[inputs.length - 1].focus()
      }
    }
  }
})

/**
 * Helpers
 */

function findParent (node) {
  let p = node

  while ((p = p.parentNode) && p.className.indexOf('choice-container') === -1) {
    ;
  }

  return p
}
