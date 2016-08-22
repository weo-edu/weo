/**
 * Imports
 */

import handleActions from '@f/handle-actions'
import createAction from '@f/create-action'
import {Flex, Block} from 'vdux-containers'
import {Checkbox, ErrorTip} from 'vdux-ui'
import mapValues from '@f/map-values'
import element from 'vdux/element'

/**
 * <SubjectSelector/>
 */

function render ({props, state, local}) {
  const {selected, toggle} = props

  return (
    <Block
      focusProps={{
        boxShadow: '0 0 3px rgba(blue, 0.5)',
        borderColor: 'blue_medium'
      }}
      border='1px solid #CCC'
      overflow='auto'
      tabindex='-1'
      w='col_m'
      rounded
      h='200'
      wrap
      p >
      <ErrorTip show={state.tooMany} message='You may only select up to 5 subjects.' placement='left' />
      {
        mapValues((subjects, category) => item(subjects, category, selected, selectSubject), subjectMap)
      }
    </Block>
  )

  function * selectSubject(subject) {
    if(selected.length >= 5 && selected.indexOf(subject) === -1) {
      yield local(setError, true)()
    } else {
      yield toggle(subject)
      yield local(setError, false)()
    }
  }
}

function item (subjects, category, selected, toggle)  {
  return (
    <Block whiteSpace='nowrap' pl='s'>
      <Block capitalize fw='bolder' py='s'>{category}:</Block>
      {
        subjects.map(subject => option(subject, selected.indexOf(subject) !== -1, () => toggle(subject)))
      }
    </Block>
  )
}

function option (subject, selected, toggle)  {
  return (
    <Flex align='start center' px py='s'>
      <Checkbox label={subject} checked={selected} mr onChange={toggle} />
    </Flex>
  )
}


const subjectMap = {
  'Creative Arts': [
    'Art',
    'Dance',
    'Drama',
    'Music'
  ],
  'Health & PE': [
    'Driver\'s Educations',
    'Health Education',
    'Physical Education'
  ],
  'Language Arts': [
    'English',
    'ESL',
    'Journalism',
    'Reading',
    'Speech'
  ],
  'Mathematics': [
    'Algebra',
    'Basic Math',
    'Calculus',
    'Geometry',
    'Statistics',
    'Trigonometry'
  ],
  'Science': [
    'Basic Science',
    'Biology',
    'Chemistry',
    'Environmental Science',
    'Physics',
    'Psychology'
  ],
  'Social Studies': [
    'Economics',
    'European History',
    'Geography',
    'Government',
    'History',
    'U.S. History',
    'World History'
  ],
  'World Languages': [
    'American Sign Language',
    'Chinese (Mandarin)',
    'French',
    'German',
    'Italian',
    'Japanese',
    'Latin',
    'Spanish'
  ],
  'more': [
    'Computer Science',
    'Computer Technology',
    'Professional Development',
    'Special Education',
    'Vocational Studies',
    'Other'
  ]
}

/**
 * Actions
 */

const setError = createAction('<SubjectSelector/>: setError')

/**
 * Reducer
 */

const reducer = handleActions({
  [setError]: (state, tooMany) => ({...state, tooMany})
})


/**
 * Exports
 */

export default {
  render,
  reducer
}
