/**
 * Imports
 */

import CreateClassModal from 'modals/CreateClassModal'
import JoinClassModal from 'modals/JoinClassModal'
import RoundedInput from 'components/RoundedInput'
import {Icon, Block, Card, Text} from 'vdux-ui'
import {MenuItem} from 'vdux-containers'
import {component, element} from 'vdux'
import Link from 'components/Link'
import summon from 'vdux-summon'

/**
 * Constants
 */

const itemCurrentProps = {borderLeftColor: 'blue', highlight: 0.05, color: 'text'}
const allClasses = {_id: 'all', displayName: 'All Classes'}
const alignLeft = {textAlign: 'left'}

/**
 * <ClassesWidget/>
 */

export default summon(() => ({
  classes: '/user/classes'
}))(component({
  render ({props, context, state, actions}) {
    const {classes, user} = props
    const {value, loading} = classes
    const clsLength = !loading && value.items.length

    return (
      <Card {...props}>
        <Block p uppercase boxShadow={clsLength > 5 && '0 2px 1px rgba(75,82,87,0.1)'} z='1' relative align='space-between center'>
          <Block>Classes</Block>
          <RoundedInput type='search' onInput={actions.setFilter} placeholder='Filter…' py='s' px={10} m={0} bgColor='#FDFDFD' inputProps={alignLeft} w={120} hide={clsLength < 7} />
        </Block>
        <Block maxHeight='247px' overflow='auto' border='1px solid rgba(75,82,87,0.05)' borderWidth='1px 0'>
          {[
            !state.filter && <Item cls={allClasses} />,
            !loading && value.items.filter(search(state.filter)).sort(cmp).map(item => <Item cls={item} />),
            user.userType === 'student'
              ? <AddClassItem Modal={JoinClassModal} text='Join Class' />
              : <AddClassItem Modal={CreateClassModal} text='New Class' />
          ]}
        </Block>
        <Block boxShadow={clsLength > 5 && '0 -2px 1px rgba(75,82,87,0.1)'} z='1' relative p />
      </Card>
    )
  },

  reducer: {
    setFilter: (state, filter) => ({filter})
  }
}))

/**
 * <Item/>
 */

function Item ({props}) {
  const {cls} = props
  const {_id, displayName} = cls

  return (
    <Link
      currentProps={itemCurrentProps}
      borderLeft='3px solid transparent'
      href={`/class/${_id}`}
      align='start center'
      ui={MenuItem}
      p>
      <Block circle='25px' lh='25px' mr textAlign='center' bg='green' color='white' uppercase>{displayName[0]}</Block>
      <Text capitalize>{displayName}</Text>
    </Link>
  )
}

/**
 * <AddClassItem/>
 */

const AddClassItem = component({
  render ({props, actions}) {
    const {text} = props

    return (
      <MenuItem onClick={actions.openModal} py='m' color='text_color' display='flex' align='start center'>
        <Icon name='add' fs='s' mr='m' sq='25' textAlign='center' />
        {text}
      </MenuItem>
    )
  },

  events: {
    * openModal ({props, context}) {
      yield context.openModal(() => <Modal />)
    }
  }
})

/**
 * Helpers
 */

function cmp (a, b) {
  return a.displayName.toUpperCase() > b.displayName.toUpperCase()
    ? 1
    : -1
}

function search (text = '') {
  text = text.toUpperCase()
  return cls => !text
    ? true
    : cls.displayName.toUpperCase().indexOf(text) !== -1
}
