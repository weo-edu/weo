/**
 * Imports
 */

import CreateActivityModal from 'modals/CreateActivityModal'
import CreateClassModal from 'modals/CreateClassModal'
import {Block, Card, Icon} from 'vdux-ui'
import {component, element} from 'vdux'
import {Button} from 'vdux-containers'
import getProp from '@f/get-prop'
import find from '@f/find'

/**
 * <Get Started/>
 */

export default component({
  render ({props, context}) {
    const {currentUser} = props
    const steps = getSteps(context, currentUser)

    return (
      <Block w='col_xl' mx='auto' my='l' pb='l'>
        <Block fs='l' lighter my>Welcome to Weo!</Block>
        <Block fs='s' lighter mb='xl'>Complete all the following steps to get started using Weo in your classroom today!</Block>
        {
          steps.map((step, idx) => <Step step={step} user={currentUser} idx={idx} len={steps.length} />)
        }
      </Block>
    )
  }
})

const Step = component({
  render({props}) {
    const {step, user, idx, len} = props
    const {icon, title, text, color, prop = '', action = []} = step
    const done = getProp(prop, user.preferences)

    return (
      <Card my align='start stretch' opacity={done ? .3 : 1} boxShadow={done ? '' : 'card'}>
        <Block bg={color} align='center center' w={120}>
          <Icon name={icon} fs='xl' color={`${color}_light`}/>
        </Block>
        <Block column align='space-around' p='l' flex>
          <Block mb='s' fs='m' lighter>{title}</Block>
          <Block>{text}</Block>
        </Block>
        <Block p column align='space-between end'>
          <Block color='grey_medium'>Step {idx + 1} of {len}</Block>
          <Button text='Continue' disabled={done} bgColor={done ? 'grey_medium' : 'blue'} onClick={action} />
        </Block>
      </Card>
    )
  }
})

function getSteps(ctx, user) {
  const cls = find(
    user.groups,
    ({groupType, status}) =>  groupType === 'class' && status === 'active'
  )

  return [
    {
      icon: 'school',
      title: 'Create your First Class',
      text: 'Classes allow you to assign Activities to your students. Create your first class to start using Weo!',
      color: 'green',
      prop: 'group_joined',
      action: ctx.openModal(() => <CreateClassModal />)
    },
    {
      icon: 'people',
      title: 'Add Students to your Class',
      text: 'In order for students to receive Activities, they must join your class.  Create a class and then add or invite students to join.',
      color: 'yellow',
      prop: 'onboard.add_students',
      action: ctx.setUrl( cls ? `/class/${cls.id}/students` : '/class/all' )
    },
    {
      icon: 'assignment',
      title: 'Create your First Activity',
      text: 'Create an Activity to test or teach your students.  Activities are interactive lessons that can include text, questions, videos, images, or links!',
      color: 'red',
      prop: 'onboard.create_share',
      action: ctx.openModal(() => <CreateActivityModal currentUser={user} />)
    },
    {
      icon: 'assignment_ind',
      title: 'Assign an Activity',
      text: 'Students will only see Activities that you assign to their class.  Create or search for one to assign to your class!',
      color: 'blue',
      prop: 'onboard.assign_share',
      action: ctx.setUrl(`/${user.username}/boards/all`)
    },
    {
      icon: 'edit',
      title: 'Fill Out your Profile',
      text: 'Weo will recommend activities teachers for you to follow. Fill out your profile so we can make better recommendationd for you.',
      color: 'grey',
      prop: 'onboard.profile_set',
      action: ctx.setUrl('/account/profile')
    },
    {
      icon: 'person_add',
      title: 'Follow Someone',
      text: 'Follow fellow teachers to see new Activities whenever they create and share them.',
      color: 'green',
      prop: 'onboard.follow',
      action: ctx.setUrl('/connect')
    }
  ]
}
