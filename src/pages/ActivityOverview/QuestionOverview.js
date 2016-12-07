/**
 * Imports
 */

import {getOverviewQuestions} from 'lib/activity-helpers'
import QuestionRow from './QuestionRow'
import {component, element} from 'vdux'
import {Flex, Block} from 'vdux-ui'
import map from '@f/map'

/**
 * <QuestionOverview/>
 */

export default component({
  render ({props, actions, state}) {
    const {activity, instances} = props
    const questions = getOverviewQuestions(activity._object[0].attachments, instances)

    return (
      <Block pb='l'>
        <Flex color='white' lighter fs='s' mt='l' mb pt>
          <Block bgColor='grey' boxShadow='card' flex p>Question</Block>
          <Block bgColor='grey' boxShadow='card' ml p w={138}>Average</Block>
        </Flex>
        {
          map((question, i) =>
            <QuestionRow
              expanded={state.expandedAtt === i}
              dismiss={actions.toggle(null)}
              toggle={actions.toggle(i)}
              question={question}
              i={i} />, questions)
        }
      </Block>
    )
  },

  reducer: {
    toggle: (state, i) => ({
      expandedAtt: state.expandedAtt === i ? null : i
    })
  }
})
