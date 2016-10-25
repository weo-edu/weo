/**
 * Imports
 */

import FreeResponseOverview from './FreeResponseOverview'
import LineTextarea from 'components/LineTextarea'
import element from 'vdux/element'
import {Block} from 'vdux-ui'

/**
 * <QuestionFreeResponse/>
 */

function render ({props}) {
  const {answerable, answer = [], submit, overview} = props

  if(overview) return <FreeResponseOverview {...props} />

  return (
    <Block flex relative my>
      {
       answerable
       ? <LineTextarea
          onInput={e => submit(e.target.value)}
          defaultValue={answer[0] || ''}
          placeholder='Free response...'
          fs='s'
          lh='normal'
          minHeight='40px'
          verticalAlign='top'
          disabled={!answerable}
          borderStyle={answerable ? 'solid' : 'dotted'}
          borderColor='grey_light'
          opacity='1' />
        : <Block
            border='1px dotted grey_light'
            borderWidth='0 0 1px 0'
            p='7px 0 8px'
            color={answer[0] ? 'text' : 'grey_medium'}
            fs='s'>
            {answer[0] || 'Free Response...'}
          </Block>
      }
    </Block>
  )
}

/**
 * Exports
 */

export default {
  render
}
