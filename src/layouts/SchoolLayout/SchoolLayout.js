/**
 * Imports
 */

import SchoolSidebar from 'components/SchoolSidebar'
import PageTitle from 'components/PageTitle'
import AppLayout from 'layouts/AppLayout'
import {component, element} from 'vdux'
import {Block} from 'vdux-ui'

/**
 * <MainLayout/>
 */

export default component({
  render ({props, children}) {
    return (
      <AppLayout {...props} bgColor={props.school.color || 'grey'}>
        <Block align='start' w='col_main' mx='auto' py px='s' mt='s'>
          <SchoolSidebar school={props.school} />
          <Block w='col_xl'>
            {children}
          </Block>
        </Block>
      </AppLayout>
    )
  }
})
