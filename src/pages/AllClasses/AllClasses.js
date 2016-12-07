/**
 * Imports
 */

import ActivityRowStudent from 'components/ActivityRowStudent'
import ClassActivityRow from 'components/ClassActivityRow'
import CreateClassModal from 'modals/CreateClassModal'
import JoinClassModal from 'modals/JoinClassModal'
import summonChannels from 'lib/summon-channels'
import EmptyState from 'components/EmptyState'
import PageTitle from 'components/PageTitle'
import {Block, Card, Text} from 'vdux-ui'
import RowFeed from 'components/RowFeed'
import {component, element} from 'vdux'
import {Button} from 'vdux-containers'

/**
 * Constants
 */

const itemProps = {showClass: true}

/**
 * <AllClasses/>
 */

export default summonChannels(({currentUser}) =>
  currentUser.groups
    .filter(group => group.groupType === 'class' && group.status !== 'archived')
    .map(cls => `group!${cls.id}.board`)
)(component({
  render ({props}) {
    const {currentUser} = props
    const {userType, preferences = {}} = currentUser
    const isTeacher = userType === 'teacher'
    const item = isTeacher ? ClassActivityRow : ActivityRowStudent

    if (!preferences.group_joined) return <Join isTeacher={isTeacher} />

    return (
      <Block maxWidth='714px' mx='auto' relative>
        <PageTitle title='Weo' />
        <Card p fs='s' lighter mb>
          All Classes
        </Card>
        <RowFeed {...props} itemProps={itemProps} item={item} emptyState={<Empty isTeacher={isTeacher} />} />
      </Block>
    )
  }
}))

/**
 * <Join/>
 */

const Join = component({
  render ({props, actions}) {
    const {isTeacher} = props

    return (
      isTeacher
        ? <EmptyState icon='school' color='blue' wide mx='auto' p='24px 12px 80px' bg='grey_light' border='1px solid #D4D4D4'>
            <Block fs='m' m>Welcome to Weo!</Block>
            <Button
              onClick={actions.createClass}
              color='white'
              bgColor='green'
              boxShadow='z2'
              border='1px solid rgba(black, .1)'
              py='16px'
              px='40px'
              lighter
              fs='s'
              m='l'>
              Create My First Class
            </Button>
            <Block>
              <Text bold>Classes </Text> let you deliver engaging, interactive activities to your students. <Text bold>Click the button</Text> above to create your first class.
            </Block>
          </EmptyState>
        : <EmptyState icon='school' color='blue' w='col_xl' mx='auto' p='24px 12px 80px' bg='grey_light' border='1px solid #D4D4D4'>
            You're not in any classes yet!
            <Block fs='xs' my>
              Click the button below to join your first class:
            </Block>
            <Button
              onClick={actions.joinClass}
              bgColor='green'
              boxShadow='z1'
              border='1px solid rgba(black, .1)'
              p='16px 40px'
              lighter
              fs='s'
              mt>
              Join Class
            </Button>
          </EmptyState>
    )
  },

  controller: {
    * joinClass ({context}) {
      yield context.openModal(() => <JoinClassModal />)
    },

    * createClass ({context}) {
      yield context.openModal(() => <CreateClassModal />)
    }
  }
})

/**
 * <Empty/>
 */

function Empty ({props}) {
  return (
    <EmptyState icon='assignment' color='green' w='col_xl' mx='auto' p='60px 12px' bg='grey_light' border='1px solid #D4D4D4'>
      Nothing here yet.
      {
        props.isTeacher
          ? <Block fs='xs' my>
              Once you assign an Activity to any of your classes, it will show up here.
            </Block>
          : <Block fs='xs' my>
              Once your teacher assigns something, it will appear here.
            </Block>
      }
    </EmptyState>
  )
}
