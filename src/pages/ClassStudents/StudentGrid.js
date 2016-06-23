/**
 * Imports
 */

import {Flex, Checkbox, Table, TableHeader, TableCell, Block, Icon} from 'vdux-ui'
import {wrap, CSSContainer, TableRow, Button, Text} from 'vdux-containers'
import StudentDropdown from './StudentDropdown'
import Avatar from 'components/Avatar'
import Link from 'components/Link'
import element from 'vdux/element'
import getProp from '@f/get-prop'
import summon from 'vdux-summon'
import index from '@f/index'
import map from '@f/map'

/**
 * <StudentGrid/> in class -> students page
 */

function render ({props}) {
  const {students, selected, group, toggleAll, currentUser, setSort} = props
  const isStudent = currentUser.userType === 'student'
  const selMap = index(selected)
  const allSelected = students.length === selected.length
  const indeterminate = !allSelected && selected.length
  const headerProps = {}
  const sort = getProp('preferences.peopleSort', currentUser)
    || {dir: 1, property: 'name.givenName'}
  const sortedStudents = students.sort(cmp)

  return (
    <Table bgColor='white' wide tall>
      <TableRow py bgColor='grey' color='white'>
        <TableHeader p w='40' hide={isStudent}>
          <Checkbox checked={allSelected} indeterminate={indeterminate} onChange={() => toggleAll('selected')} />
        </TableHeader>
        <TableHeader w='40'/>
        <StudentHeader text='First Name' prop='name.givenName' sort={sort} setPref={setPref} />
        <StudentHeader text='Last Name' prop='name.familyName' sort={sort} setPref={setPref} />
        <StudentHeader text='Username' prop='username' sort={sort} setPref={setPref} />
        <TableHeader hide={isStudent} />
      </TableRow>
      {
        map(student => (
          <StudentRow group={group} student={student} highlight={!!selMap[student._id]} selected={!!selMap[student._id]} isStudent={isStudent} />
        ), sortedStudents)
      }
    </Table>
  )

  function * setPref(prop) {
    yield setSort({
      property: prop,
      dir: prop === sort.property ? sort.dir * -1 : 1
    })
  }

  function cmp (a, b) {
    if(!sort) return
    const prop = sort.property

    return getProp(prop, a).toUpperCase() > getProp(prop, b).toUpperCase()
    ? 1 * sort.dir
    : -1 * sort.dir
  }
}

const StudentHeader = wrap(CSSContainer, {p: true, textAlign: 'left', hoverProps: {hover: true}})({
  render ({props}) {
    const {hover, sort, prop, text, setPref, ...rest} = props
    return (
      <TableHeader pointer onClick={() => setPref(prop)} {...rest}>
        <Block align='start center'>
          <Text underline={hover}>
            {text}
          </Text>
          <Icon
            name={'arrow_drop_' + (sort.dir === 1 ? 'down' : 'up')}
            hidden={sort.property !== prop}
            ml='s'
            fs='s'/>
        </Block>
      </TableHeader>
    )
  }
})

const StudentRow = wrap(CSSContainer, {
  hoverProps: {
    highlight: true,
    showSettings: true
  }
})({
  render ({props}) {
    const {student, selected, group, highlight, showSettings, isStudent} = props
    const {name, username} = student
    const {givenName, familyName} = name
    const cellProps = {p: '10px 12px'}

    return (
      <TableRow tag={isStudent ? 'tr' : 'label'} display='table-row' py bgColor={highlight && !isStudent ? '#fafdfe' : 'white'} borderBottom='1px solid grey_light'>
        <TableCell {...cellProps} hide={isStudent}>
          <Checkbox name='selected[]' value={student._id} checked={selected}/>
        </TableCell>
        <TableCell {...cellProps}>
          <Avatar display='flex' actor={student} mr='s' sq='26' />
        </TableCell>
        <TableCell {...cellProps}>
          <Link hoverProps={{underline: true}} href={`/${username}`}>
            {givenName}
          </Link>
        </TableCell>
        <TableCell {...cellProps}>
          <Link hoverProps={{underline: true}} href={`/${username}`}>
            {familyName}
          </Link>
        </TableCell>
        <TableCell {...cellProps}>
          <Link hoverProps={{underline: true}} href={`/${username}`}>
            {username}
          </Link>
        </TableCell>
        <TableCell {...cellProps} textAlign='right' hide={isStudent}>
          <StudentDropdown
            group={group}
            onClick={e => e.preventDefault()}
            showSettings={showSettings}
            student={student}/>
        </TableCell>
      </TableRow>
    )
  }
})


/**
 * Exports
 */

export default summon(() => ({
  setSort: pref => ({
    settingSort:  {
      url: '/preference/peopleSort',
      invalidates: '/user',
      method: 'PUT',
      body: {
        value: pref
      }
    }
  })
}))({
  render
})
