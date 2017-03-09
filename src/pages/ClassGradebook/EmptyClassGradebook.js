/**
 * Imports
 */

import EmptyState from 'components/EmptyState'
import {component, element} from 'vdux'
import {Button} from 'vdux-containers'
import {Icon, Block} from 'vdux-ui'

/**
 * <EmptyClassStudents/>
 */

export default component({
  render ({props, context}) {
    const {group} = props

    return (
      <EmptyState icon='book' color='green' wide fill mt>
        <Block lh='30px' mt>
          You don't have any students in your class. Add students and assign them Activities.
        </Block>
        <Button
          onClick={context.setUrl(`/class/${group._id}/students`)}
          boxShadow='z2'
          bgColor='green'
          px='35px'
          lighter
          h='3em'
          fs='s'
          my='l'>
          <Block align='center center'>
            <Icon name='person_add' mr />
            Add Students
          </Block>
        </Button>
      </EmptyState>
    )
  }
})
