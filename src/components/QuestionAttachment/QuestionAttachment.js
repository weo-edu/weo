/**
 * Imports
 */

import QuestionFreeResponse from 'components/QuestionFreeResponse'
import QuestionShortAnswer from 'components/QuestionShortAnswer'
import QuestionPollChoice from 'components/QuestionPollChoice'
import QuestionChoice from 'components/QuestionChoice'
import {component, element} from 'vdux'

/**
 * <QuestionAttachment/>
 */

export default component({
  render ({props}) {
    const {object, poll} = props

    switch (object.objectType) {
      case 'choice':
        return poll
          ? <QuestionPollChoice {...props} />
          : <QuestionChoice {...props} />
      case 'shortAnswer':
        return <QuestionShortAnswer {...props} />
      case 'text':
        return <QuestionFreeResponse {...props} />
      default:
        throw new Error('Unknown question attachment type: ' + object.objectType)
    }
  }
})
