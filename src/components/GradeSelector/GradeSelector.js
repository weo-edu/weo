/**
 * Imports
 */

import {Checkbox, ErrorTip} from 'vdux-ui'
import {component, element} from 'vdux'
import {Flex} from 'vdux-containers'

/**
 * Constants
 */

const grades = [
  'Pre-K',
  'Kindergarten',
  '1st',
  '2nd',
  '3rd',
  '4th',
  '5th',
  '6th',
  '7th',
  '8th',
  '9th',
  '10th',
  '11th',
  '12th',
  'Higher Education'
]

/**
 * <GradeSelector/>
 */

export default component({
  render ({props, state, actions}) {
    const {selected} = props

    return (
      <Flex
        focusProps={{
          boxShadow: '0 0 3px rgba(blue, 0.5)',
          borderColor: 'blue_medium'
        }}
        border='1px solid #CCC'
        tabindex='-1'
        w='420px'
        rounded
        h='200'
        column
        wrap
        p>
        <ErrorTip show={state.tooMany} message='You may only select up to 5 grades.' placement='left' />
        {
          grades.map(grade => item(grade, selected.indexOf(grade) !== -1, actions.selectGrade(grade)))
        }
      </Flex>
    )
  },

  controller: {
    * selectGrade ({actions, props}, grade) {
      const {toggle, selected} = props

      if (selected.length >= 5 && selected.indexOf(grade) === -1) {
        yield actions.setError(true)
      } else {
        yield toggle(grade)
        yield actions.setError(false)
      }
    }
  },

  reducer: {
    setError: (state, tooMany) => ({tooMany})
  }
})

/**
 * Helpers
 */

function item (grade, selected, toggle) {
  return (
    <Flex align='start center' flex='20%' w='33%' maxWidth='33%' whiteSpace='nowrap' pl='s'>
      <Checkbox label={grade} checked={selected} mr onChange={toggle} />
    </Flex>
  )
}
