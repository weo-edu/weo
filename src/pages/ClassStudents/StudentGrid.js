/**
 * Imports
 */

import {Checkbox, Table, TableHeader, TableCell, Block, Icon} from 'vdux-ui'
import {wrap, CSSContainer, TableRow, Text} from 'vdux-containers'
import {preventDefault, component, element} from 'vdux'
import StudentDropdown from './StudentDropdown'
import summonPrefs from 'lib/summon-prefs'
import Avatar from 'components/Avatar'
import Link from 'components/Link'
import getProp from '@f/get-prop'
import index from '@f/index'
import map from '@f/map'

/**
 * <StudentGrid/> in class -> students page
 */

export default summonPrefs()(component({
  render ({props, actions}) {
    const {students, selected, group, toggleAll, currentUser, prefs} = props
    const isStudent = currentUser.userType === 'student'
    const selMap = index(selected)
    const allSelected = students.length === selected.length
    const indeterminate = !allSelected && selected.length
    const sort = prefs.peopleSort || {dir: 1, property: 'name.givenName'}
    const sortedStudents = students.sort(cmp)

    return (
      <Table bgColor='white' wide tall>
        <TableRow py bgColor='grey' color='white'>
          <TableHeader p w='50' hide={isStudent}>
            <Checkbox checked={allSelected} indeterminate={indeterminate} onChange={toggleAll('selected')} />
          </TableHeader>
          <TableHeader w='40' />
          <StudentHeader text='First Name' prop='name.givenName' sort={sort} setSort={actions.setSort} />
          <StudentHeader text='Last Name' prop='name.familyName' sort={sort} setSort={actions.setSort} />
          <StudentHeader text='Username' prop='username' sort={sort} setSort={actions.setSort} />
          <TableHeader hide={isStudent} />
        </TableRow>
        {
          map(student => (
            <StudentRow group={group} student={student} highlight={!!selMap[student._id]} selected={!!selMap[student._id]} isStudent={isStudent} />
          ), sortedStudents)
        }
      </Table>
    )

    function cmp (a, b) {
      if (!sort) return
      const prop = sort.property

      return getProp(prop, a).toUpperCase() > getProp(prop, b).toUpperCase()
        ? 1 * sort.dir
        : -1 * sort.dir
    }
  },

  controller: {
    * setSort ({props}, prop) {
      const {setPref, prefs} = props
      const sort = prefs.peopleSort || {dir: 1, property: 'name.givenName'}

      yield setPref('peopleSort', {
        property: prop,
        dir: prop === sort.property ? sort.dir * -1 : 1
      })
    }
  }
}))

/**
 * <StudentHeader/>
 */

const StudentHeader = wrap(CSSContainer, {p: true, textAlign: 'left', hoverProps: {hover: true}})({
  render ({props}) {
    const {hover, sort, prop, text, setSort, ...rest} = props

    return (
      <TableHeader pointer onClick={setSort(prop)} {...rest}>
        <Block align='start center'>
          <Text underline={hover}>
            {text}
          </Text>
          <Icon
            name={'arrow_drop_' + (sort.dir === 1 ? 'down' : 'up')}
            hidden={sort.property !== prop}
            ml='s'
            fs='s' />
        </Block>
      </TableHeader>
    )
  }
})

/**
 * Constants
 */

const underline = {underline: true}
const cellProps = {p: '10px 12px'}

/**
 * <StudentRow/>
 */

const StudentRow = wrap(CSSContainer, {
  hoverProps: {
    highlight: true,
    showSettings: true
  }
})(component({
  render ({props, actions}) {
    const {student, selected, group, highlight, showSettings, isStudent} = props
    const {name, username} = student
    const {givenName, familyName} = name

    return (
      <TableRow tag={isStudent ? 'tr' : 'label'} display='table-row' py bgColor={highlight && !isStudent ? '#fafdfe' : 'white'} borderBottom='1px solid grey_light'>
        <TableCell {...cellProps} hide={isStudent}>
          <Checkbox name='selected[]' value={student._id} checked={selected} />
        </TableCell>
        <TableCell {...cellProps}>
          <Avatar display='flex' actor={student} mr='s' sq='26' />
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
          <Link hoverProps={underline} href={`/${username}`}>
            {username}
          </Link>
        </TableCell>
        <TableCell {...cellProps} textAlign='right' hide={isStudent}>
          <StudentDropdown
            group={group}
            onClick={preventDefault}
            showSettings={showSettings}
            student={student} />
        </TableCell>
      </TableRow>
    )
  }
}))
