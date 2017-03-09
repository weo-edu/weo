/**
 * Imports
 */

import InviteTeacherModal from 'modals/InviteTeacherModal'
import {Block, Card, Divider, MenuItem} from 'vdux-ui'
import SchoolLogo from 'components/SchoolLogo'
import {Button, Icon} from 'vdux-containers'
import {component, element} from 'vdux'
import Link from 'components/Link'
import summon from 'vdux-summon'

/**
 * <School Sidebar/>
 */

export default component({
  render ({props, actions}) {
  	const school = props.school || {}
  	
    return (
    	<Block mr>
	    	<Card w={230} mb>
	    		<Block bg={school.color || 'blue'} h='60' />
	    		<Block align='start' p='s'>
	    			<SchoolLogo school={school} circle='75px' m='-37.5px 6px 0 0' boxShadow='z1' border='2px solid white' />
        		<Block overflow='hidden' flex>
	            <Block ellipsis fw='bolder'>
	              {school.name}
	            </Block>
	            <Block ellsipis fs='xxs'>
	              {school.city}, {school.state}
	            </Block>
	          </Block>
          </Block>
	    		<Divider m='s' color='#EEE'/>
	    		<Block align='center center' p pb='18px'>
	    			<Button py='s' px='32px' onClick={actions.inviteTeacher}>
	    				<Icon fs='s' name='local_activity' mr />
	    				Invite Colleagues
	    			</Button>
					</Block>
	    	</Card>
	    	<Card>
	    		<Block boxShadow='0 2px 1px rgba(grey,0.1)' z='1' relative p />
	    			<Item icon='forum' href='/school/discussion'>
		        	Discussion
		        </Item>
		        <Item icon='school' href='/school/teachers'>
		        	Teachers
		        </Item>
		        <Item icon='people' href='/school/students'>
		        	Students
		        </Item>
		        <Item icon='settings' href='/school/settings'>
		        	Settings
		        </Item>
	    		<Block boxShadow='0 -2px 1px rgba(grey,0.1)' z='1' relative p />
	    	</Card>
	    </Block>
    )
  },

  controller: {
    * inviteTeacher ({context}) {
      yield context.openModal(() => <InviteTeacherModal />)
    },
  }
})

/**
 * Constants
 */

const currentProps = {borderLeftColor: 'blue', highlight: 0.05, color: 'text'}
const hoverProps = {color: 'text'}

/**
 * <Item/>
 */

const Item = component({
	render({props, children}) {
		const {icon, href} = props
		return (
			<Link currentProps={currentProps}
		  	borderLeft='3px solid transparent'
		  	href={href}
			  align='start center'
			  ui={MenuItem}
			  color='grey_medium'
			  hoverProps={hoverProps}
			  p>
				<Icon name={icon} fs='s' mr />
				{ children }
			</Link>
		)
	}
})
