/**
 * Imports
 */

import {Block, Image, Text, Flex} from 'vdux-ui'
import element from 'vdux/element'
import map from '@f/map'

const cloudFS = require('cloud-fs')
const speedGrades = cloudFS.url('./files/speed-grades.png')
const teacherTalk = cloudFS.url('./files/teacher-talk.png')
const telepathy = cloudFS.url('./files/telepathy.png')
const students = cloudFS.url('./files/students.png')
const target = cloudFS.url('./files/target.png')
const spark = cloudFS.url('./files/spark.png')
const comp = cloudFS.url('./files/comp.png')
const bolt = cloudFS.url('./files/bolt.png')
const xray = cloudFS.url('./files/xray.png')


/**
 * Render
 */

function render () {
  return (
    <Block id='info' w='col_main' m='0 auto'>
      <Flex column align='center center' py='50'>
        <Image src={spark} w='150' my='12px'/>
        <Text fs='l' my='l' fw='bold'>
          We Believe Teachers are Superheroes
        </Text>
        <Text fs='m'>
          Enhance your powers with Weo!
        </Text>
      </Flex>
      { map(infoItem, info) }
    </Block>
  )
}

function infoItem (info, i) {
  return (
    <Flex py='50'>
      <Flex column align='center' flex='50%' px='l' order={i%2}>
        <Image src={info.image} m='0 auto' maxWidth='90%' display='block' />
      </Flex>
      <Flex column align='center center' flex='50%' px='l' textAlign='center'>
        <Image src={info.icon} m='12px' />
        <Text uppercase fs='m' fw='bolder' my='m'>{info.title}</Text>
        <Text fs='s' fw='200' lh='30px'>{info.description}</Text>
      </Flex>
    </Flex>
  )
}

const info = [
  {
    title: 'Super Captivating Activities',
    description: 'Eliminate distraction with engaging activities. Effortlessly include links, images, and videos in your teaching material to grab your students’ attention.',
    icon: target,
    image: comp
  },
  {
    title: 'Lightning Speed Grading',
    description: 'Save hours every week with super-fast speed grading. Have all your multiple choice and short answer questions graded automatically so you can spend more time doing what matters – connecting with your students.',
    icon: bolt,
    image: speedGrades
  },
  {
    title: 'Telepathic Feedback',
    description: 'Provide feedback to better connect and communicate with your students. Leave comments on any response to ensure students get the help and attention they need.',
    icon: telepathy,
    image: teacherTalk
  },
  {
    title: 'X-Ray Student Insight',
    description: 'Peek inside the minds of your students. Use assignment overviews to quickly understand where your students are struggling so you can help them more effectively.',
    icon: xray,
    image: students
  },
]


/**
 * Exports
 */

export default {
  render
}
