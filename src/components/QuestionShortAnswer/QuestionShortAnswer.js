/**
 * Imports
 */

import ShortAnswerOverview from './ShortAnswerOverview'
import ShortAnswerEdit from './ShortAnswerEdit'
import LineInput from 'components/LineInput'
import {component, element} from 'vdux'
import {Tooltip} from 'vdux-containers'
import {Block, Icon} from 'vdux-ui'

/**
 * <QuestionShortAnswer/>
 */

export default component({
  render ({props}) {
    const {
      answerable, showAnswers, answer = [], object,
      overview, editing, editable, submit
    } = props

    if (overview) return <ShortAnswerOverview {...props} />

    const filterAnswers = object.correctAnswer.filter(Boolean)

    return (
      <Block relative wide>
        {
          editing
            ? <ShortAnswerEdit {...props} />
            : answerable
              ? <Block align='start center'>
                  <LineInput
                    onInput={submit}
                    placeholder='Enter your answer...'
                    defaultValue={answer[0] || ''}
                    borderColor='grey_light'
                    borderStyle='solid'
                    opacity={1}
                    w='30%'
                    fs='s' />
                </Block>
              : <Block align='start center'>
                  <Block
                    border='1px dotted grey_light'
                    borderWidth='0 0 1px 0'
                    p='7px 0 8px'
                    w={editable ? '30%' : '50%'}
                    color={editable ? 'grey_medium' : 'text'}
                    fs='s'>
                    {answer[0] || 'Enter your answer...'}
                  </Block>
                  {
                    editable &&
                    <Tooltip ml='s' message='Responses that match any solution from the list below will automatically be marked correct.' tooltipProps={{whiteSpace: 'normal'}} placement='right'>
                      <Icon mt={1} name='help' fs='s' pr />
                    </Tooltip>
                  }
                </Block>
        }
        {
          showAnswers && (
            <Block>
              {
                filterAnswers.length
                  ? <Block>
                      <Block my='s'>
                          Correct Answers:
                      </Block>
                      <Block align='start center'>
                        {
                            filterAnswers.map(answer => (
                              <Block lh='18px' px='s' mr='s' pill bgColor='blue' color='white' fs='12px' fw='normal'>
                                {answer}
                              </Block>
                            ))
                          }
                      </Block>
                    </Block>
                  : <Block mt>No Answers Specified</Block>
              }
            </Block>
          )
        }
      </Block>
    )
  }
})
