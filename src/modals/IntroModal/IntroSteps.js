/**
 * Imports
 */

import {Block, Image, Text, Icon} from 'vdux-ui'
import {component, element} from 'vdux'

/**
 * Assets
 */

const cloudFS = require('cloud-fs')
const assign = cloudFS.url('./images/assign.gif')
const create = cloudFS.url('./images/create.gif')
const feed = cloudFS.url('./images/feed.jpg')
const feedback = cloudFS.url('./images/feedback.gif')
const grades = cloudFS.url('./images/grades.gif')
const invite = cloudFS.url('./images/invite.gif')

/**
 * Constants
 */

const steps = [
  {
    icon: 'grade',
    image: feed,
    text: 'Welcome to Weo. Start creating and sharing activities with your colleagues and students.'
  },
  {
    icon: 'edit',
    image: create,
    text: 'Easily make engaging interactive activities and assessments for your class.'
  },
  {
    icon: 'send',
    image: assign,
    text: 'Assign auto-graded activities to all your classes with one click.'
  },
  {
    icon: 'insert_chart',
    image: grades,
    text: 'Get grades and performance overviews as soon as students turn in their work.'
  },
  {
    icon: 'message',
    image: feedback,
    text: 'Leave feedback so students know how they’re doing and how they can improve.'
  },
  {
    icon: 'local_play',
    image: invite,
    text: 'Invite friends to share and collaborate on activities to use in your classroom.'
  }
]

const numSteps = steps.length

/**
 * <IntroSteps/>
 */

export default component({
  render ({props}) {
    const {cur, counts} = props

    return (
      <Block bg='linear-gradient(#00a79d, #92bd9d)' wide tall color='white'>
        <Block w='80%' m='0 auto' >
          <Text pt='30' pb fs='23' fw='200' align='start center'>
            <Icon name={steps[cur].icon} fs='70' mr='16' />
            {steps[cur].text}
          </Text>
          {
            steps.map((step, i) => stepItem(step, i, cur, counts))
          }
        </Block>
      </Block>
    )
  }
})

export {
  numSteps
}

/**
 * Helpers
 */

function stepItem (step, i, cur, counts) {
  const url = step.image + '?v=' + (counts[i] || 0)

  return (
    <Block relative>
      <Image src={url} wide my='l' absolute top right left bottom opacity={+(cur === i)} transition='opacity .35s' />
    </Block>
  )
}
