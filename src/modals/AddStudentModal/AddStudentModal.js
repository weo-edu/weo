/**
 * Imports
 */

import {Modal, ModalBody, ModalFooter, ModalHeader, Block, Text, Icon} from 'vdux-ui'
import InviteStudentsModal from 'modals/InviteStudentsModal'
import CreateStudentModal from 'modals/CreateStudentModal'
import {Button, Tooltip} from 'vdux-containers'
import BlockInput from 'components/BlockInput'
import {component, element} from 'vdux'

/**
 * <Add Student Modal/>
 */

export default component({
  render ({props, actions, context}) {
  	const btnProps = {py: 's', flex: true, px: 0}
    return (
    	<Modal onDismiss={context.closeModal}>
    		<ModalBody pb='l' w='col_m' mx='auto'>
    			<ModalHeader>
    				Add Students
  				</ModalHeader>
  				<BlockInput placeholder='Find students in your school…' autofocus />
  				<Block align='center center' mt='l'>
	  				<Button mr {...btnProps} onClick={actions.inviteStudentsModal}>
	            <Icon name='mail' mr fs='s' />
	            Invite
	            <Tooltip message='Send an email to your students that will instruct them on how to join your class.' align='center center' tooltipProps={{whiteSpace: 'normal', w: '200'}}>
	              <Icon name='info' ml='s' fs='xs' />
	            </Tooltip>
	          </Button>
	          <Button {...btnProps} onClick={actions.createStudentModal}>
	            <Icon name='edit' mr fs='s' />
	            Create New
	            <Tooltip message='Create a new account for students who have never used Weo before.' align='center center' tooltipProps={{whiteSpace: 'normal', w: '200'}}>
	              <Icon name='info' ml='s' fs='xs' />
	            </Tooltip>
	          </Button>
          </Block>
    		</ModalBody>
				<ModalFooter bg='grey'>
					<Text fs='xxs'>
            <Text pointer underline onClick={context.closeModal}>cancel</Text>
            <Text mx>or</Text>
          </Text>
          <Button type='submit'>Add</Button>
				</ModalFooter>
    	</Modal>
    )
  },

  controller: {
    * createStudentModal ({props, context}) {
      yield context.openModal(() => <CreateStudentModal groupId={props.group._id} />)
    },

    * inviteStudentsModal ({props, context}) {
      yield context.openModal(() => <InviteStudentsModal group={props.group} />)
    }
  }
})
