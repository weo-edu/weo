/**
 * Imports
 */

import BlockInput from 'components/BlockInput'
import {MenuItem, Text} from 'vdux-containers'
import {component, element} from 'vdux'
import {debounce} from 'redux-timing'
import {Block, Card} from 'vdux-ui'
import summon from 'vdux-summon'

/**
 * <Join School/>
 */

export default summon(() => ({
  joinSchool: id => ({
    joiningSchool: {
      url: `/school/${id}/join`,
      method: 'PUT'
    }
  }),

  lookup: query => ({
    schools: {
      url: '/school/lookup',
      clear: true,
      params: {
        query
      }
    }
  })
}))(component({
  render ({props, actions}) {
  	const {noSchoolFn, ...rest} = props
  	const schools = (props.schools && props.schools.value && props.schools.value.items) || []

    return (
    	<Block align='start center' relative {...rest}>
        <BlockInput autofocus autocomplete='off' name='name' onInput={actions.debouncedLookup} autofocus placeholder='Search for your school by name…' mb={0}  />
        <Card z={2} mt='-1' absolute top='100%' wide border='grey_light' hide={!schools.length}>
          <Block maxHeight={160} overflow='auto'>
            {
              (schools || []).map(school =>
                <School onClick={actions.join(school._id)} school={school} />
              )
            }
          </Block>
          <Text onClick={noSchoolFn} color='blue' hoverProps={{opacity: .8}} textAlign='center' fs='xxs' pointer={true} bold py='10' bg='white' wide display='block' borderTop='1px solid grey_light' mt='-1' relative boxShadow='0 -1px 1px rgba(black, .1)'>
            Can't find your school? Click to create one!
          </Text>
        </Card>
      </Block>

    )
  },

  middleware: [
    debounce('debouncedLookup', 250)
  ],

  controller: {
    * debouncedLookup ({props}, query) {
      yield props.lookup(query)
    },

    * join ({props, context}, id) {
      yield props.joinSchool(id)
      yield props.fn()
    }
  }
}))


const School = component({
  render ({props}) {
    const {school} = props

    return (
      <MenuItem wide p {...props} borderBottom='1px solid grey_light'>
        <Block color='blue' bold mb='s' ellipsis>{school.name}</Block>
        <Block lighter>{school.city}, {school.state}</Block>
      </MenuItem>
    )
  }
})
