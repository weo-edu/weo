/**
 * Imports
 */

import JoinSchoolModal from 'modals/JoinSchoolModal'
import {Card, Icon, Block, Divider} from 'vdux-ui'
import ProfileWidget from './ProfileWidget'
import ClassesWidget from './ClassesWidget'
import DraftsWidget from './DraftsWidget'
import {component, element} from 'vdux'
import Link from 'components/Link'

/**
 * Constants
 */

const linkProps = {
  borderWidth: '0px',
  boxShadow: '0 0',
  borderLeft: '3px solid transparent',
  currentProps: {
    highlight: 0.03,
    color: 'text',
    borderColor: 'blue'
  }
}

/**
 * <FeedWidgets/>
 */

export default component({
  render ({props, context}) {
    const {user, ...rest} = props
    const cardMargin = '8px 6px 12px 0'
    const isTeacher = user.userType === 'teacher'
    const draftCount = user.drafts.canonicalTotal.items
    const joinedSchool = !user.school || !(props.school && props.school._id)

    return (
      <Block mr {...rest}>
        <Card w='230px' hide={!isTeacher}>
          <Link ui={Card} onClick={context.openModal(() => <JoinSchoolModal />)} w={230} m={cardMargin} my={0} align='start center' {...linkProps} pointer p hide={user.userType === 'student' || joinedSchool}>
            <Icon fs='m' mr name='school' />
            <Block flex>Join a School</Block>
          </Link>
          <Divider m={0} color='#EEE'/>
          <Link ui={Card} w={230} m={cardMargin} my={0} align='start center' {...linkProps} pointer p href='/feed' hide={user.userType === 'student'}>
            <Icon fs='m' mr name='dashboard' />
            <Block flex>My Feed</Block>
          </Link>
          <Divider m={0} color='#EEE' hide={!draftCount} />
          <DraftsWidget boxShadow='0 0' w={230} {...linkProps} m={cardMargin} my={0} draftCount={draftCount} user={user} />
        </Card>
        <ClassesWidget user={user} w={230} m={cardMargin}  mt={isTeacher ? true : 0}/>
      </Block>
    )
  }
})
