/**
 * Imports
 */

import CreateActivityModal from 'modals/CreateActivityModal'
import {Block, Button, Tooltip} from 'vdux-containers'
import EmptyState from 'components/EmptyState'
import {component, element} from 'vdux'
import summon from 'vdux-summon'
import {Icon} from 'vdux-ui'

/**
 * Constants
*/

const introId = process.env.SHARE_INTRO_ID

/**
 * <EmptyClassFeed/>
 */

export default summon(props => ({
  copyTemplate: () => ({
    copyingTemplate: {
      url: `/share/template/${introId}`,
      method: 'POST'
    }
  })
}))(component({
  render ({actions, props}) {
    const {currentUser, copyingTemplate = {}} = props

    if (currentUser.userType === 'student') {
      return (
        <EmptyState icon='assignment' color='green' m='auto' wide>
          Your teacher hasn't assigned anything yet.  Check back here for future Activities.
        </EmptyState>
      )
    }

    return (
      <Block p textAlign='center'>
        <Icon name='assignment' fs='xxl' color='green' />
        <Block my fs='m' lighter>
          This is your class Activity Feed
        </Block>
        <Button busy={copyingTemplate.loading} onClick={actions.createIntro} fs='s' lighter py my boxShadow='z2' relative>
          <Block align='center center'>
            Assign an Intro Activity
            <Tooltip message='Assign a tutorial Activity to teach your students the basics of Weo.' align='center center' tooltipProps={{whiteSpace: 'normal', w: '200'}}>
              <Icon name='info' ml='s' fs='s' />
            </Tooltip>
          </Block>
        </Button>
        <Block underline pointer hoverProps={{opacity: 0.8}} onClick={actions.createActivity}>
          or create your own!
        </Block>
        <Block fs='s' lighter mx='auto' mt='l' w='col_m'>
          Activities are interactive worksheets. Assign them to your class and they'll appear here for you and your students.
        </Block>
      </Block>
    )
  },

  controller: {
    * createActivity ({props, context}) {
      yield context.openModal(() => <CreateActivityModal currentUser={props.currentUser} />)
    },

    * createIntro ({props, context}) {
      const activity = yield props.copyTemplate()
      yield context.setUrl(`/activity/${activity._id}/edit`)
    }
  }
}))
