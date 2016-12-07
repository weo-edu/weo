/**
 * Imports
 */
import {stopPropagation, component, Document, element} from 'vdux'
import ActivityQuestion from 'components/ActivityQuestion'
import {wrap, CSSContainer} from 'vdux-containers'
import {questionIcon} from 'lib/activity-helpers'
import {Block, Card, Flex, Icon} from 'vdux-ui'

/**
 * <QuestionRow/>
 */

export default wrap(CSSContainer, {
  hoverProps: {hover: true}
})(component({
  render ({props}) {
    const {question, hover, i, expanded, dismiss} = props
    const {displayName, total, numAnswered, points: {max}, poll} = question
    // Prevent division by zero
    const average = Math.round((total / (numAnswered || 1)) * 10) / 10
    const headerProps = {
      highlight: hover || expanded ? 0.03 : 0,
      boxShadow: expanded ? '0 0 0' : 'card',
      align: 'start center',
      borderBottom: '1px solid off_white',
      p: true
    }

    return (
      <Block>
        <Document onClick={dismiss} />
        <Block m={expanded ? '12px -30px' : 0} boxShadow={expanded ? 'z2' : '0 0 0'} onClick={[props.toggle, stopPropagation]}>
          <Flex fs='s' lighter wide pointer>
            <Card {...headerProps} ellipsis flex>
              <Block>{i + 1}.</Block>
              <Icon name={questionIcon(question)} fs='s' mx />
              <Block ellipsis flex>{displayName}</Block>
            </Card>
            <Card {...headerProps} ml={expanded ? 0 : 12} minWidth={138}>
              <Block circle='7' bg={getColor(average / max)} mr='16' hide={poll} />
              <Block flex>
                {poll ? '–' : average + ' / ' + max}
              </Block>
              <Icon name={`expand_${expanded ? 'less' : 'more'}`} ml='s' fs='s' />
            </Card>
          </Flex>
          {
            expanded && (
              <Block onClick={stopPropagation} bgColor='white' p='18px 50px 30px 50px'>
                <ActivityQuestion overview object={question} />
              </Block>
            )
          }
        </Block>
      </Block>
    )
  }
}))

/**
 * Helpers
 */

function getColor (average) {
  return average < 0.6
    ? 'red'
    : average < 0.8 ? 'yellow' : 'green'
}
