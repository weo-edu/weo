/**
 * Imports
 */

import {component, element} from 'vdux'
import {Toggle} from 'vdux-containers'
import {Block, Card} from 'vdux-ui'
import getProp from '@f/get-prop'
import summon from 'vdux-summon'

/**
 * <AccountEmail/>
 */

export default summon(({currentUser}) => ({
  togglePref: pref => ({
    savingPreference: {
      url: '/preference/' + encodeURIComponent(pref),
      method: 'PUT',
      body: {
        value: !getProp(pref, currentUser.preferences)
      }
    }
  })
}))(component({
  render ({props}) {
    const {currentUser, togglePref} = props

    return (
      <Card>
        <Block fs='m' color='blue' pt='l' pb px>
          Email Notifications
        </Block>
        {
          emailPrefs.map(({message, prop}, i) => <Toggle onChange={togglePref(prop)} checked={!getProp(prop, currentUser.preferences)} {...rowProps} label={message} tWidth='20' borderBottomWidth={(i + 1) === emailPrefs.length ? 0 : 1} />)
        }
      </Card>
    )
  }
}))

/**
 * Constants
 */

const rowProps = {
  hoverProps: {bgColor: 'rgba(blue_light, .06)'},
  activeProps: {bgColor: 'rgba(blue_light, .1)', uiProps: {squished: true, toggleProps: {mr: 54}}},
  borderBottom: '1px solid grey_light',
  pointer: true,
  fw: 'lighter',
  p: 'l',
  fs: 's',
  uiProps: {toggleProps: {mr: 54}}
}

const emailPrefs = [
  {
    message: 'Likes one of my activities',
    prop: 'email.disableLikes'
  },
  {
    message: 'Repins one of my activities',
    prop: 'email.disableRepins'
  },
  {
    message: 'Follows me',
    prop: 'email.disableFollowedUser'
  },
  {
    message: 'Follows one of my boards',
    prop: 'email.disableFollowedBoard'
  },
  {
    message: 'Comments on one of my activities',
    prop: 'email.disableCommentedOn'
  },
  {
    message: 'Joins my class',
    prop: 'email.disableJoinedClass'
  },
  {
    message: 'Turns in an activity',
    prop: 'email.disableTurnedIn'
  }
]
