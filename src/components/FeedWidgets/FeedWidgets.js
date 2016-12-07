/**
 * Imports
 */

import ProfileWidget from './ProfileWidget'
import ClassesWidget from './ClassesWidget'
import DraftsWidget from './DraftsWidget'
import {Card, Icon, Block, Divider} from 'vdux-ui'
import {component, element} from 'vdux'
import Link from 'components/Link'

/**
 * Constants
 */

const currentProps = {highlight: 0.05, color: 'text'}

/**
 * <FeedWidgets/>
 */

export default component({
  render ({props}) {
    const {user, ...rest} = props
    const cardMargin = '8px 6px 12px 0'
    const draftCount = user.drafts.canonicalTotal.items

    return (
      <Block mr {...rest}>
        <ProfileWidget user={user} w={230} m={cardMargin} my={0} />
        <Divider m={0} mr='s' color='#EEE' hide={!draftCount} />
        <DraftsWidget w={230} m={cardMargin} my={0} draftCount={draftCount} user={user} />
        <Divider m={0} mr='s' color='#EEE'/>
        <Link ui={Card} w={230} m={cardMargin} mt={0} align='start center' currentProps={currentProps} pointer p href='/feed' hide={user.userType === 'student'}>
          <Icon fs='m' mr name='dashboard' />
          <Block flex>My Feed</Block>
        </Link>
        <ClassesWidget user={user} w={230} m={cardMargin} />
      </Block>
    )
  }
})
