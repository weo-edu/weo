/**
 * Imports
 */

import EmptyClassGradebook from './EmptyClassGradebook'
import PageTitle from 'components/PageTitle'
import Loading from 'components/Loading'
import {component, element} from 'vdux'
import Gradebook from './Gradebook'
import summon from 'vdux-summon'
import {Block} from 'vdux-ui'

/**
 * <ClassGradebook/>
 */

export default summon(({group}) => ({
  students: `/group/students?group=${group._id}`
}))(component({
  render ({props}) {
    const {group, students, currentUser} = props
    const {value, loading, loaded} = students

    if (!loaded && loading) return <Loading show h='200' />

    const {items: studentList} = value

    return (
      <Block>
        <PageTitle title={`${group.displayName} | Gradebook`} />
        {
          loaded && studentList.length
            ? <Gradebook group={group} students={studentList} currentUser={currentUser} />
            : <EmptyClassGradebook group={group} />
        }
      </Block>
    )
  }
}))
