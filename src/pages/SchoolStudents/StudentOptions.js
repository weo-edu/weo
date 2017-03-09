/**
 * Imports
 */

import AddToClassModal from 'modals/AddToClassModal'
import PrintLoginModal from 'modals/PrintLoginModal'
import RoundedInput from 'components/RoundedInput'
import PasswordModal from 'modals/PasswordModal'
import {Button, Tooltip} from 'vdux-containers'
import {component, element} from 'vdux'
import {Block, Icon} from 'vdux-ui'

/**
 * <Student Options/>
 */

export default component({
	render({props, actions}) {
		const {selected} = props
		const {length: count} = selected
		const btnProps = {
		  h: '30',
		  fs: 'xxs',
		  px: 'm',
		  mr: 's',
		  bgColor: 'white',
		  color: 'text',
		  hoverProps: {highlight: 0.02},
		  disabled: !count
		}


		return(
			<Block mb align='start center'>
				<Tooltip message={!count && 'Select Students to Enable'}>
					<Button {...btnProps} onClick={actions.addToClassModal}>
						<Icon fs='s' mr='s' name='add'/>
						Add To Class
					</Button>
				</Tooltip>
				<Tooltip message={!count && 'Select Students to Enable'}>
					<Button {...btnProps} onClick={actions.passwordModal}>
						<Icon fs='s' mr='s' name='lock'/>
						Reset Password
					</Button>
				</Tooltip>
				<Tooltip message={!count && 'Select Students to Enable'}>
					<Button {...btnProps} onClick={actions.printLoginModal}>
						<Icon fs='s' mr='s' name='print'/>
						Print Login Info
					</Button>
				</Tooltip>
				<Block flex align='end'>
					<RoundedInput 
						placeholder='Find students...'
            inputProps={{textAlign: 'left', appearance: 'none', h: '17px', lh: '17px'}} 
            type='search'
            icon='search'
            w='242px'
            py='8px'
            mb={0} />
          </Block>
			</Block>
		)
	},

  controller: {
    * addToClassModal ({props, context}) {
    	const {students, selected} = props
			const users = students.filter(({_id}) => selected.indexOf(_id) !== -1)
      yield context.openModal(() => <AddToClassModal user={users} />)
    },

		* passwordModal ({props, context}) {
			const {students, selected} = props
			const users = students.filter(({_id}) => selected.indexOf(_id) !== -1)
      yield context.openModal(() => <PasswordModal user={users} />)
    },    

    * printLoginModal ({props, context}) {
    	const {students, selected} = props
			const users = students.filter(({_id}) => selected.indexOf(_id) !== -1)
      yield context.openModal(() => <PrintLoginModal user={users} />)
    }
  }
})