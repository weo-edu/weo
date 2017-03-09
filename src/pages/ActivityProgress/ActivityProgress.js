/**
 * Imports
 */

import {combineInstancesAndStudents, activitySort} from 'lib/activity-helpers'
import {Block, Table, TableHeader, TableRow, Icon} from 'vdux-ui'
import ActivityProgressActions from './ActivityProgressActions'
import ActivityProgressRow from './ActivityProgressRow'
import {Checkbox, form, Button} from 'vdux-containers'
import EmptyState from 'components/EmptyState'
import SortHeader from 'components/SortHeader'
import summonPrefs from 'lib/summon-prefs'
import {component, element} from 'vdux'
import index from '@f/index'

/**
 * <ActivityProgress/>
 */

export default summonPrefs()(
  form(({students}) => ({
    fields: ['selected']
  }))(
component({
  render ({props, context, actions}) {
    const {
    activity, students, setStatus, settingStatus, prefs,
    toggleAll, fields, instances, classId
  } = props
    const sort = prefs.shareStudentSort || {property: 'name.givenName', dir: 1}

    const instanceList = combineInstancesAndStudents(activity, students, instances)
    .sort(activitySort(sort))

    const headProps = {sort, setSort: actions.setSort, lighter: true, p: true}

    // Multi Select Variables
    const instanceIds = index(({instanceId}) => instanceId, instanceList)
    const selected = (fields.selected.value || []).filter(id => instanceIds[id])
    const selMap = index(selected)
    const allSelected = instanceList.length === selected.length && students.length
    const indeterminate = !allSelected && selected.length

    return (
      <Block w='col_main' m='auto' bgColor='white' boxShadow='card' p mb>
        <ActivityProgressActions
          settingStatus={settingStatus}
          setStatus={setStatus}
          activity={activity}
          selected={selected} />
        <Table wide border='1px solid rgba(black, .1)' fs='s' lighter>
          <TableRow bgColor='grey' color='white'>
            <TableHeader {...headProps}>
              <Checkbox pointer checked={allSelected} indeterminate={indeterminate} onChange={toggleAll('selected')} />
            </TableHeader>
            <SortHeader {...headProps} prop='givenName' text='First' />
            <SortHeader {...headProps} prop='familyName' text='Last' />
            <SortHeader {...headProps} prop='percent' text='Score' />
            <SortHeader {...headProps} prop='status' text='Status' />
            <SortHeader {...headProps} prop='turnedInAt' text='Turned In' />
            <TableHeader {...headProps} />
          </TableRow>
          {
          instanceList.length
          ? instanceList.map(instance =>
            <ActivityProgressRow
              selected={!!selMap[instance.instanceId]}
              instance={instance}
              activityId={activity._id} />
            )
          : <tr>
            <EmptyState tag='td' icon='person' color='green' colspan='100' pb='l'>
              <Block>
                You must add students to your class in order to view results.
              </Block>
              <Button onClick={context.setUrl(`/class/${classId}/students`)} fs='s' lighter py boxShadow='z2' bgColor='green' mt='l'>
                <Icon name='person_add' mr='s' fs='s' />
                  Add Students
              </Button>
            </EmptyState>
          </tr>
        }
        </Table>
      </Block>
  )
  },

  controller: {
    * setSort ({props}, sort, property) {
      yield props.setPref('shareStudentSort', {
        property,
        dir: property === sort.property ? sort.dir * -1 : 1
      })
    }
  }
})))
