/**
 * Imports
 */

import RemoveFromClassModal from 'modals/RemoveFromClassModal'
import InviteStudentsModal from 'modals/InviteStudentsModal'
import ClassActivityRow from 'components/ClassActivityRow'
import EmptyClassStudents from './EmptyClassStudents'
import AddStudentModal from 'modals/AddStudentModal'
import PrintLoginModal from 'modals/PrintLoginModal'
import {Button, form, Tooltip} from 'vdux-containers'
import {Icon, Flex, Block, Checkbox} from 'vdux-ui'
import PasswordModal from 'modals/PasswordModal'
import PageTitle from 'components/PageTitle'
import Loading from 'components/Loading'
import StudentGrid from './StudentGrid'
import {openModal} from 'reducer/modal'
import element from 'vdux/element'
import summon from 'vdux-summon'
import index from '@f/index'

/**
 * <ClassStudents/>
 */

function render ({props}) {
  const {group, students, toggleAll, fields, currentUser} = props
  const {value, loading, loaded} = students

  if (!loaded && loading) return <Loading show={true} h='200' />

  const {items: studentList} = value
  const studentIds = index(({_id}) => _id, studentList)
  const selected = (fields.selected.value || []).filter(id => studentIds[id])

  return (
    <Block w='col_main' mx='auto' relative my py>
      <PageTitle title={`${group.displayName} | Students`} />
      {
        loaded && studentList.length
          ? <Block>
              <StudentMenu students={studentList} group={group} selected={selected} currentUser={currentUser} />
              <StudentGrid students={studentList} group={group} selected={selected} toggleAll={toggleAll} currentUser={currentUser} />
            </Block>
          : <EmptyClassStudents group={group} />
      }
    </Block>
  )
}

function StudentMenu ({props}) {
  const {students, selected, group, currentUser} = props
  const isStudent = currentUser.userType === 'student'
  const {length: count} = selected
  const users = students.filter(({_id}) => selected.indexOf(_id) !== -1)
  const btnProps = {
    color: 'white',
    h: '30',
    fs: 'xxs',
    px: 'm',
    mr: 's'
  }

  if(isStudent) return <span/>

  return (
    <Flex align='space-between center' mb>
      <Button bgColor='blue' {...btnProps} onClick={() => openModal(() => <AddStudentModal groupId={group._id} />)}>
        <Icon name='people' mr='s' fs='s'/>Add Student
      </Button>
      <Button bgColor='green' {...btnProps} onClick={() => openModal(() => <InviteStudentsModal group={group} />)}>
        <Icon name='send' mr='s' fs='s'/>Invite Students
      </Button>
      <Tooltip message={!count && 'Select Students to Enable'}>
        <Button disabled={!count} bgColor='white' {...btnProps} hoverProps={{highlight: 0.02}} focusProps={{highlight: 0.02}} color='text' onClick={() => openModal(() => <PasswordModal user={users} group={group} />)}>
          <Icon name='lock' mr='s' fs='s'/>Reset Password
        </Button>
      </Tooltip>
      <Tooltip message={!count && 'Select Students to Enable'}>
        <Button disabled={!count} bgColor='white' {...btnProps} hoverProps={{highlight: 0.02}} focusProps={{highlight: 0.02}} color='text' onClick={() => openModal(() => <PrintLoginModal user={users} />)}>
          <Icon name='print' mr='s' fs='s'/>Print Login Info
        </Button>
      </Tooltip>
      <Tooltip message={!count && 'Select Students to Enable'}>
        <Button disabled={!count} bgColor='red' color='white' {...btnProps} onClick={() => openModal(() => <RemoveFromClassModal user={users} group={group} />)}>
          <Icon name='delete' mr='s' fs='s'/>Remove from Class
        </Button>
      </Tooltip>
      <Flex flex align='end center'>
        <Block color='blue' align='center center' hide={!count}>
          {count} selected
          <Block mx='s' color='text'>|</Block>
        </Block>
        {students.length} students
      </Flex>
    </Flex>
  )
}

/**
 * Exports
 */

export default summon(({group}) => ({
  students: `/group/students?group=${group._id}`
}))(
  form(({students}) => ({
    fields: ['selected']
  }))({
    render
  })
)
