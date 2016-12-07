/**
 * Imports
 */

import {component, element} from 'vdux'
import {Flex, Text} from 'vdux-ui'
import reduce from '@f/reduce'

/**
 * <ClassActivityBadge/>
 */

export default component({
  render ({props}) {
    const {activity, ...rest} = props
    const {actors = {}} = activity.instances.total[0] || {}
    const counts = reduce((acc, actor) => {
      const type = actor.status <= 2
        ? 'notDone'
        : actor.status === 5 ? 'returned' : 'turnedIn'

      acc[type]++
      return acc
    }, {returned: 0, turnedIn: 0, notDone: 0}, actors)

    return (
      <Flex align='space-between center' wide mt mx fs='xxs' {...rest}>
        <Flex column align='center center' mr='s'>
          <Text>Returned</Text>
          <Text>{counts.returned}</Text>
        </Flex>
        <Flex column align='center center' mr='s'>
          <Text>Turned In</Text>
          <Text>{counts.turnedIn}</Text>
        </Flex>
        <Flex column align='center center'>
          <Text>Not Done</Text>
          <Text>{counts.notDone}</Text>
        </Flex>
      </Flex>
    )
  }
})
