/**
 * Imports
 */

import {decodeNode, component, element} from 'vdux'
import {Tooltip, Button} from 'vdux-containers'
import LineInput from 'components/LineInput'
import {Block, Icon} from 'vdux-ui'
import map from '@f/map'

/**
 * <ShortAnswerEdit/>
 */

export default component({
  render ({props, actions}) {
    const {object, focusPrevious} = props
    const {correctAnswer = []} = object

    return (
      <Block>
        <Block my='s' align='start center'>
          Provide each possible answer:
          <Tooltip placement='right' message='Student responses must exactly match one of your provided solutions. Provide all possible solutions to the question.' ml='s' tooltipProps={{whiteSpace: 'normal', lh: '1.4em', fs: '12px'}}>
            <Icon name='help' fs='s' pr />
          </Tooltip>
        </Block>
        <Block>
          {
            map((ans, i) => <Answer
              focusPrevious={focusPrevious}
              answer={ans}
              onInput={actions.edit(i)}
              onEnter={actions.save(correctAnswer.concat(`Answer ${correctAnswer.length + 1}`))}
              num={correctAnswer.length}
              remove={actions.remove}
              idx={i} />,
              correctAnswer)
          }
        </Block>
        <Block align='start center' w='45%'>
          <Block mr mt={-4} fs='s'>{correctAnswer.length + 1}.</Block>
          <Button
            key={`btn_${correctAnswer.length}`}
            hoverProps={{borderBottomColor: 'grey_medium'}}
            focusProps={{borderBottomColor: 'grey_medium'}}
            border='1px dashed transparent'
            borderBottomColor='grey_light'
            bgColor='transparent'
            onClick={actions.save(correctAnswer.concat(`Answer ${correctAnswer.length + 1}`))}
            color='grey_medium'
            cursor='text'
            lh='12px'
            h={38}
            fs='s'
            p={0}
            flex
            mr>
            <Block align='start' flex lighter>
              Add Answer
            </Block>
          </Button>
          <Block align='center center'>
            <Button icon='close' hidden pointerEvents='none' />
          </Block>
        </Block>
      </Block>
    )
  },

  controller: {
    * save ({props}, correctAnswer) {
      yield props.onEdit({
        ...props.object,
        correctAnswer
      })
    },

    * edit ({props, actions}, i, value) {
      yield actions.save(replace(props.object.correctAnswer, i, value))
    },

    * remove ({props, actions}, idx) {
      const ans = props.object.correctAnswer.slice()
      ans.splice(idx, 1)
      yield actions.save(ans)
    }
  }
})

/**
 * <Answer/>
 */

const Answer = component({
  render ({props, actions}) {
    const {answer, idx, remove, num, onInput, onEnter} = props

    return (
      <Block align='start center' mr mb='s' flex='45%'>
        <Block mr mt={-4} fs='s'>{idx + 1}.</Block>
        <LineInput
          onKeydown={{
            backspace: decodeNode(actions.maybeRemove),
            enter: onEnter
          }}
          onInput={onInput}
          // placeholder={'Answer ' + (idx+1)}
          onFocus={{selectTarget: true}}
          value={answer}
          autofocus
          fs='s'
          m={0} />
        <Button tabindex='-1' color='text' icon='close' ml onClick={remove(idx)} hidden={num === 1} poinerEvents={num === 1 ? 'none' : 'default'} />
      </Block>
    )
  },

  controller: {
    * maybeRemove ({props}, node) {
      const {num, idx, focusPrevious, remove} = props

      if (num !== 1 && node.value === '') {
        yield [
          remove(idx),
          focusPrevious(node)
        ]
      }
    }
  }
})

/**
 * Helpers
 */

function replace (arr, idx, val) {
  arr = arr.slice()
  arr[idx] = val
  return arr
}
