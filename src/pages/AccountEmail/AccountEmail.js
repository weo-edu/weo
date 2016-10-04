/**
 * Imports
 */

import {Block, Flex, Card} from 'vdux-ui'
import {Toggle} from 'vdux-containers'
import element from 'vdux/element'
import getProp from '@f/get-prop'
import summon from 'vdux-summon'

/**
 * <AccountEmail/>
 */

function render ({props}) {
  const {currentUser, togglePref} = props
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

  return (
    <Card>
      <Block fs='m' color='blue' pt='l' pb px>
        Email Notifications
      </Block>
      {
        emailPrefs.map(({message, prop}, i) => <Toggle onChange={() => togglePref(prop)} checked={!getProp(prop, currentUser.preferences)} {...rowProps} label={message} tWidth='20' borderBottomWidth={(i+1) === emailPrefs.length ? 0 : 1}/>)
      }
    </Card>
  )
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
    prop: 'email.disableJoinedClass',
  },
  {
    message: 'Turns in an activity',
    prop: 'email.disableTurnedIn',
  }
]

/**
 * Exports
 */

export default summon(({currentUser}) => ({
  togglePref: (pref) => ({
    savingPreference:  {
      url: '/preference/' + encodeURIComponent(pref),
      invalidates: '/user',
      method: 'PUT',
      body: {
        value: !getProp(pref, currentUser.preferences)
      }
    }
  })
}))({
  render
})
