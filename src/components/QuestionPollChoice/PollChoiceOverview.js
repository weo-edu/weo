/**
 * Imports
 */

import {Tooltip} from 'vdux-containers'
import {component, element} from 'vdux'
import {Block} from 'vdux-ui'

/**
 * <QuestionPollChoice/>
 */

export default component({
  render ({props}) {
    const {object, bgColor, responses, numAnswered, hidePollNames} = props
    const names = responses
      .filter(r => r.response.indexOf(object._id) !== -1)
      .map(r => r.actor.displayName)
    const percent = Math.round((names.length / (numAnswered || 1)) * 100) + '%'

    const offset = 30
    const Tt = hidePollNames ? Block : Tooltip

    return (
      <Tt
        message={names.join('\n')}
        tooltipProps={{whiteSpace: 'pre'}}
        placement='right'
        immediate
        bgColor='grey_light'
        boxShadow='card'
        maxWidth='140px'
        flex='0 0 30%'
        flexShrink='1'
        rounded='4px'
        mx='1%'
        mb={offset}
        tall>
        <Block pb='100%' relative wide>
          <Block bgColor={bgColor} h={percent} absolute wide bottom />
          <Block absolute wide tall top left align='center center'>
            <Block innerHTML={object.content} class='markdown' fs='s' textAlign='center' />
          </Block>
          <Block fs='s' wide absolute bottom={(offset + 10) * -1} textAlign='center'>
            {percent}
          </Block>
        </Block>
      </Tt>
    )
  }
})
