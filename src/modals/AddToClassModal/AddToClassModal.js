/**
 * Imports
 */

import {Modal, ModalBody, ModalFooter, ModalHeader, Block, Text, Checkbox, Button} from 'vdux-ui'
import {component, element} from 'vdux'
import {form} from 'vdux-containers'
import summon from 'vdux-summon'
import index from '@f/index'

/**
 * <Add To Class Modal/>
 */

export default summon(() => ({
  classes: '/user/classes'
}))(
  form(() => ({
    fields: ['selected']
  }))(component({
  render ({props, actions, context}) {
  	const {classes, user, fields} = props
  	const {value, loaded} = classes

  	if(!loaded) return <Block/>

  	const classIds = index(({_id}) => _id, value.items)
  	const selected = (fields.selected.value || []).filter(id => classIds[id])
    const selMap = index(selected)

    return (
    	<Modal onDismiss={context.closeModal}>
    		<ModalBody pb='l' w='col_l' mx='auto'>
    			<ModalHeader>
    				Add to Class
  				</ModalHeader>
  				<Block textAlign='center' pb='l'>
  					Select the classes you want to add 
  					{ 
  						user.length > 1 
  						? <Text>
  								&nbsp;these <Text color='blue' bold>{user.length}</Text> students&nbsp;
								</Text>
  						: <Text color='blue' bold>
  								&nbsp;{user[0].displayName}&nbsp;
								</Text>
  					}
  					to.
					</Block>
  				<Block overflow='auto' border='1px solid grey_light' maxHeight='200' boxShadow='inset 0 2px 1px rgba(grey,0.1), inset 0 -2px 1px rgba(grey,0.1)'>
	  				{
	  					loaded && value.items.map((item, i) => <Item last={i === value.items.length - 1} item={item} selected={!!selMap[item._id]} />)
	  				}
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
  }
})))

const Item = component({
	render ({props}) {
		const {item, i, last, selected} = props

		return (
			<Block tag='label' align='start center' p borderBottom={last ? 0 : '1px solid grey_light'}>
				<Checkbox mr name='selected[]' value={item._id} checked={selected}/>
				{item.displayName}
			</Block>
		)
	}
})
