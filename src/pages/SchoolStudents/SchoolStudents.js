/**
 * Imports
 */

import {Checkbox, Table, TableHeader, TableCell, Block, Icon} from 'vdux-ui'
import {wrap, CSSContainer, TableRow, Button, Text, form} from 'vdux-containers'
import InfiniteScroll from 'components/InfiniteScroll'
import StudentDropdown from './StudentDropdown'
import EmptyState from 'components/EmptyState'
import SortHeader from 'components/SortHeader'
import StudentOptions from './StudentOptions'
import PageTitle from 'components/PageTitle'
import UserTile from 'components/UserTile'
import summonPrefs from 'lib/summon-prefs'
import Loading from 'components/Loading'
import {component, element} from 'vdux'
import Avatar from 'components/Avatar'
import Link from 'components/Link'
import getProp from '@f/get-prop'
import summon from 'vdux-summon'
import index from '@f/index'
import map from '@f/map'

/**
 * Constants
 */

const headProps = {p: '10px 12px', align: 'start center'}
const defaultSort = {property: 'name.givenName', dir: 1}

/**
 * <School Students/>
 */

export default summonPrefs()(
  summon(({userSearch: query, school, prefs: {schoolStudentSort = {}}}) => ({
    students: {
      url: `/school/${school._id}/students?maxResults=10&sort=${encodeURIComponent(schoolStudentSort.property || '')}&dir=${schoolStudentSort.dir || ''}`,
      clear: false
    },
    more: pageToken => ({
      students: {
        params: pageToken && {pageToken}
      }
    })
  }))(
  form(({students}) => ({
    fields: ['selected']
  }))(component({
  render ({props, actions}) {
  	const {students, currentUser, more, prefs, fields} = props
	  const {value, loaded, loading} = students
    const sort = prefs.schoolStudentSort || defaultSort

  	if (!loaded && loading || !value) return <Loading show h={200} />
    if (!value.items || !value.items.length) {
      return (
        <EmptyState icon='people' color='blue' fill>
          <PageTitle title={props.school.name + ' | Students'} />
          No Students Have Joined Your School Yet
        </EmptyState>
      )
    }

    const studentIds = index(({_id}) => _id, value.items)
    const selected = (fields.selected.value || []).filter(id => studentIds[id])
    const selMap = index(selected)

    return (
    	<Block>
        <PageTitle title={props.school.name + ' | Students'} />
    		<InfiniteScroll more={more(value.nextPageToken)}>
          <StudentOptions selected={selected} students={value.items} />
	        <Table bg='white' boxShadow='card' wide tall>
            <TableRow bg='grey' color='white' textAlign='left'>
              <TableHeader colspan='2' />
              <SortHeader text='First Name' prop='name.givenName' sort={sort} setSort={actions.setSort} p ta='left' />
              <SortHeader text='Last Name' prop='name.familyName' sort={sort} setSort={actions.setSort} p ta='left' />
              <SortHeader text='Username' prop='username' sort={sort} setSort={actions.setSort} p ta='left' />
              <TableHeader/>
            </TableRow>
	          {
	            loaded &&
                map(user => <Row currentUser={currentUser} user={user} highlight={!!selMap[user._id]} selected={!!selMap[user._id]} />, value.items)
	          }
	        </Table>
	      </InfiniteScroll>
    	</Block>
    )
  },

  controller: {
    * setSort ({props}, sort, prop) {
      const {setPref, prefs} = props

      yield setPref('schoolStudentSort', {
        property: prop,
        dir: prop === sort.property ? sort.dir * -1 : 1
      })
    }
  }
}))))

const underline = {underline: true}
const cellProps = {p: '10px 12px'}

const Row = wrap(CSSContainer, {
  hoverProps: {
    highlight: true,
    showSettings: true
  }
})(component({
  render ({props}) {
    const {user, highlight, showSettings, selected} = props
    const {name: {givenName}, name: {familyName}, username} = user
    return (
      <TableRow tag='label' display='table-row' borderBottom='1px solid grey_light' bgColor={highlight ? '#fafdfe' : 'white'}>
        <TableCell p w='50'>
          <Checkbox name='selected[]' value={user._id} checked={selected} />
        </TableCell>
        <TableCell {...cellProps}>
          <Avatar display='flex' actor={user} mr='s' sq='26' />
        </TableCell>
        <TableCell {...cellProps}>
          <Link hoverProps={underline} href={`/${username}`}>
            {givenName}
          </Link>
        </TableCell>
        <TableCell {...cellProps}>
          <Link hoverProps={underline} href={`/${username}`}>
            {familyName}
          </Link>
        </TableCell>
        <TableCell {...cellProps}>
          {username}
        </TableCell>
        <TableCell>
          <StudentDropdown student={user} showSettings={showSettings} />
        </TableCell>
      </TableRow>
    )
  }
}))
