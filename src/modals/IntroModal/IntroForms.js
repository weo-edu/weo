/**
 * Imports
 */

import SubjectSelector from 'components/SubjectSelector'
import {Flex, Icon, ModalHeader, Block} from 'vdux-ui'
import {Button, Text, Tooltip} from 'vdux-containers'
import GradeSelector from 'components/GradeSelector'
import BlockInput from 'components/BlockInput'
import SchoolLogo from 'components/SchoolLogo'
import JoinSchool from 'components/JoinSchool'
import LineInput from 'components/LineInput'
import {component, element} from 'vdux'
import summon from 'vdux-summon'
import Form from 'vdux-form'

/**
 * Constants
 */

const ttProps = {
  placement: 'bottom',
  tooltipProps: {
    fw: 'lighter',
    p: true,
    fs: 'xs',
    maxWidth: '300px'
  }
}

const btnProps = {
  boxShadow: 'card',
  bgColor: 'green',
  color: 'white',
  lh: '3.5em',
  h: '3.5em',
  px: '35px',
  mt: 'l',
  fs: 's'
}

const textLinkProps = {
  color: 'grey_medium',
  textAlign: 'center',
  display: 'block',
  fs: 'xxs',
  pointer: true,
  mb: 'l'
}

/**
 * <IntroForms/>
 */

export default summon(({currentUser}) => ({
  saveGrades: gradeLevels => ({
    savingGrades: {
      url: `/user/${currentUser._id}/gradeLevels`,
      method: 'PUT',
      body: {
        gradeLevels
      }
    }
  }),
  saveSubjects: subjects => ({
    savingSubjects: {
      url: `/user/${currentUser._id}/subjects`,
      method: 'PUT',
      body: {
        subjects
      }
    }
  }),
  finishedIntroModal: () => ({
    savingPreference: {
      url: '/preference/' + encodeURIComponent('slideshow.done'),
      method: 'PUT',
      body: {
        value: true
      }
    }
  }),
  createSchool: body => ({
    creatingSchool: {
      url: '/school',
      method: 'POST',
      body
    }
  })
}))(component({
  initialState: ({props}) => ({
    grades: [],
    subjects: [],
    step: 0,
    schoolState: props.currentUser.school ? 'invited' : 'join'
  }),

  render ({props, state, actions, context}) {
    const {saveGrades, savingSubjects, savingPreference, creatingSchool = {}, createSchool, school} = props
    const {step, grades, subjects, schoolState} = state

    return (
      <Flex column align='center center' tall wide>
        <Block hide={step !== 0}>
          <Flex column align='center center' tall wide hide={schoolState !== 'invited'}>
            <ModalHeader color='text'>
              You were invited to join
            </ModalHeader>
            <Block w={350} h={200} align='center center'>
              <Block textAlign='center'>
                <SchoolLogo school={school} circle='75px' boxShadow='z1' border='2px solid white' mb />
                <Block fs='m' lighter color='blue' bolder mb='s'>{school.name}</Block>
                <Block fs='s' color='grey_medium' lighter>{school.city + ', ' + school.state}</Block>
              </Block>
            </Block>
            <Block align='center center'>
              <Button {...btnProps} fs='xs' bgColor='grey' mr onClick={actions.setSchoolState('join')}>
                Change School
              </Button>
              <Button {...btnProps} fs='xs' onClick={actions.step(step + 1)}>
                Accept
              </Button>
            </Block>
            <Block h={84} />
          </Flex>
          <Flex column align='center center' tall wide hide={schoolState !== 'join'}>
            <ModalHeader>
              Find My School
            </ModalHeader>
            <Block w={350} h={200} align='start center' column>
              <Icon name='school' fs='80px' mb='l'/>
              <JoinSchool mb wide fn={actions.step(step + 1)} noSchoolFn={actions.setSchoolState('create')} />
              <Text onClick={actions.setSchoolState('create')} underline {...textLinkProps}>
                Can't find your school? Click to create it!
              </Text>
            </Block>
            <Block h={84}/>
          </Flex>
          <Flex column align='center center' tall wide  hide={schoolState !== 'create'}>
            <ModalHeader>
              Create a New School
            </ModalHeader>
            <Form column align='center center' onSubmit={createSchool} onSuccess={actions.step(step + 1)}>
              <Block w={350} h={200} align='center center' column>
                <Block w='300' m='28px auto 24px'>
                  <LineInput autofocus name='name' placeholder='School Name' mb='l' />
                  <Block align='start center'>
                    <LineInput name='city' placeholder='City' mr />
                    <LineInput name='state' placeholder='State' w='100' maxlength='2' />
                  </Block>
                </Block>
                <Text onClick={actions.setSchoolState('join')} {...textLinkProps} align='center center'>
                  <Icon name='keyboard_arrow_left' fs='xxs' mr='xs' textDecoration='none' />
                  <Text underline>
                    Back to Find My School.
                  </Text>
                </Text>
              </Block>
              <Button {...btnProps} type='submit' busy={creatingSchool.loading}>
                <Flex align='center center' fw='lighter'>
                  Next
                  <Icon name='keyboard_arrow_right' />
                </Flex>
              </Button>
            </Form>
          </Flex>
        </Block>
        <Flex column align='center center' tall wide hide={step !== 1}>
          <ModalHeader>
            What Grades Do You Teach?
          </ModalHeader>
          <GradeSelector toggle={actions.toggleGrade} selected={grades} />
          <Tooltip message={!grades.length && 'Please select one or more grades'} {...ttProps}>
            <Button {...btnProps} onClick={[saveGrades(grades), actions.step(step + 1)]} disabled={!grades.length}>
              <Flex align='center center' fw='lighter'>
                Next
                <Icon name='keyboard_arrow_right' />
              </Flex>
            </Button>
          </Tooltip>
        </Flex>

        <Flex column align='center center' tall wide hide={step !== 2}>
          <ModalHeader>
            What Subjects Do You Teach?
          </ModalHeader>
          <SubjectSelector toggle={actions.toggleSubject} selected={subjects} />
          <Tooltip message={!subjects.length && 'Please select one or more subjects'} {...ttProps}>
            <Button {...btnProps} onClick={actions.submit} disabled={!subjects.length} busy={(savingSubjects || savingPreference || {}).loading}>
              <Flex align='center center' fw='lighter'>
                <Icon name='check' mr />
                Let's Get Started
              </Flex>
            </Button>
          </Tooltip>
        </Flex>

        <Text hide={step === 0} pointer onClick={actions.skip} absolute bottom right m color='grey' hoverProps={{underline: true}}>
          Skip
        </Text>
      </Flex>
    )
  },

  controller: {
    * skip ({props, context}) {
      yield props.finishedIntroModal()
      yield context.closeModal()
    },

    * submit ({props, state, context}, grades, subjects) {
      yield props.saveSubjects(state.subjects)
      yield props.finishedIntroModal()
      yield context.closeModal()
    }
  },

  reducer: {
    step: (state, step) => ({step}),
    setSchoolState: (state, schoolState) => ({schoolState}),
    toggleGrade: (state, grade) => ({
      grades: state.grades.indexOf(grade) === -1
        ? [...state.grades, grade]
        : state.grades.filter(g => g !== grade)
    }),
    toggleSubject: (state, subject) => ({
      subjects: state.subjects.indexOf(subject) === -1
        ? [...state.subjects, subject]
        : state.subjects.filter(s => s !== subject)
    })
  }
}))
