/**
 * Imports
 */

import {Block, TableRow, TableCell} from 'vdux-ui'
import {Button, Checkbox} from 'vdux-containers'
import {component, element} from 'vdux'
import statusMap from 'lib/status'
import moment from 'moment'

/**
 * <ActivityProgressRow/>
 */

export default component({
  render ({props, context}) {
    const {instance, activityId, selected} = props
    const {
      status, turnedInAt, givenName, userId,
      familyName, points, total, percent, instanceId
    } = instance
    const statProps = statusMap[status]
    const url = `/activity/${activityId}/instance/${userId}`
    const p = '10px 12px'

    return (
      <TableRow bg='#FDFDFD' borderBottom='1px solid rgba(black, .1)'>
        <TableCell p={p}>
          <Checkbox pointer name='selected[]' value={instanceId} checked={selected} />
        </TableCell>
        <TableCell p={p}>
          {givenName}
        </TableCell>
        <TableCell p={p}>
          {familyName}
        </TableCell>
        <TableCell p={p}>
          {Math.round(points * 100) / 100} / {total} ({percent})
        </TableCell>
        <TableCell p={p}>
          <Block pill h={26} fs='14' align='center center' bg={statProps.teacherColor} color='white' capitalize w='108'>
            { statProps.displayName }
          </Block>
        </TableCell>
        <TableCell p={p}>
          {
            turnedInAt ? moment(turnedInAt).format('M/D/YY h:mm A') : '–'
          }
        </TableCell>
        <TableCell py={p.split(' ')[0]} w='68'>
          <Button text='Open' onClick={context.setUrl(url)} px='0' h='30' w='56' />
        </TableCell>
      </TableRow>
    )
  }
})
