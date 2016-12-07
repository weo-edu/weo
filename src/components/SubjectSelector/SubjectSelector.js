/**
 * Imports
 */

import {Flex, Block} from 'vdux-containers'
import {Checkbox, ErrorTip} from 'vdux-ui'
import {component, element} from 'vdux'
import mapValues from '@f/map-values'

/**
 * <SubjectSelector/>
 */

export default component({
  render ({props, state, actions}) {
    const {selected, max = 5} = props

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
        p>
        <ErrorTip show={state.tooMany} message={`You may only select up to ${max} subjects.`} placement='left' />
        {
          mapValues((subjects, category) => item(subjects, category, selected, actions.selectSubject), subjectMap)
        }
      </Block>
    )
  },

  controller: {
    * selectSubject ({props, actions}, subject) {
      const {selected, toggle, max = 5} = props

      if (selected.length >= max && selected.indexOf(subject) === -1) {
        yield actions.setError(true)
      } else {
        yield toggle(subject)
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

function item (subjects, category, selected, toggle) {
  return (
    <Block whiteSpace='nowrap' pl='s'>
      <Block capitalize fw='bolder' py='s'>{category}:</Block>
      {
        subjects.map(subject => option(subject, selected.indexOf(subject) !== -1, toggle(subject)))
      }
    </Block>
  )
}

function option (subject, selected, toggle) {
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
