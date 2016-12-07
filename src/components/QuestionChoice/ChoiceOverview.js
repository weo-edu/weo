/**
 * Imports
 */

import {Tooltip} from 'vdux-containers'
import {component, element} from 'vdux'
import {Block} from 'vdux-ui'

/**
 * <QuestionChoice/>
 */

export default component({
  render ({props}) {
    const {object, responses, numAnswered, bgColor, correctCheck: CorrectCheck} = props
    const names = responses
      .filter(r => r.response.indexOf(object._id) !== -1)
      .map(r => r.actor.displayName)
    const percent = numAnswered ? Math.round(names.length / numAnswered * 100) : 0

    return (
      <Tooltip message={names.join('\n')}
        tooltipProps={{whiteSpace: 'pre'}}
        placement='right'
        immediate
        printProps={{bgColor: 'transparent', p: '2px 0 2px 20px'}}
        p='12px 12px 12px 30px'
        align='start center'
        borderRadius='25px'
        bgColor={bgColor}
        relative
        w='70%'
        my='s'>
        { CorrectCheck && <CorrectCheck show /> }
        <Block fs='s' absolute left={-67} textAlign='left'>
          { percent }%
        </Block>
        <Block>
          <Block mx='40px' fs='s' innerHTML={object.content || '<br/>'} class='markdown' printProps={{ml: 0}} />
        </Block>
      </Tooltip>
    )
  }
})
