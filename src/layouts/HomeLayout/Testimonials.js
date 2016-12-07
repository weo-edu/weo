/**
 * Imports
 */

import {Block, Flex, Icon, Text, Image} from 'vdux-ui'
import {component, element} from 'vdux'
import map from '@f/map'

/**
 * Assets
 */

const cloudFS = require('cloud-fs')
const lauren = cloudFS.url('./files/testimonials/lahey.jpg')
const jon = cloudFS.url('./files/testimonials/jon.png')
const ari = cloudFS.url('./files/testimonials/ari.jpg')

/**
 * <Testimonials/>
 */

export default component({
  render ({props, children}) {
    return (
      <Block maxWidth='1100' p='50px 12px' m='50px auto 0' relative>
        <Block absolute top right left h='1' maxWidth='600' bg='grey_light' m='auto' />
        <Icon name='favorite' color='red' fs='66' absolute top='-33' right left m='0 auto' w='132' bg='white' textAlign='center' />
        <Flex mt='50'>
          { map(testimonial, people) }
        </Flex>
      </Block>
    )
  }
})

function testimonial (person) {
  return (
    <Flex column textAlign='center' px='l'>
      <Image src={person.image} circle='150' boxShadow='card' display='block' m='12px auto' border='3px solid white' />
      <Text fs='s' lh='32px' mb='m' fw='lighter'>“{person.text}”</Text>
      <Text uppercase my='m' fw='bolder'>{person.name}</Text>
      <Text uppercase color='blue' fw='lighter'>{person.school}</Text>
    </Flex>
  )
}

const people = [
  {
    image: ari,
    text: 'Weo is a godsend! I love being able to see exactly where my kids are struggling so I can go over whatever they need the most help on.',
    name: 'Arianna Gonzalez',
    school: 'St. Anthony\'s Elementary School'
  },
  {
    image: lauren,
    text: 'This is literally going to revolutionize teaching and classroom organization. Weo has made that process totally streamlined.',
    name: 'Lauren Lahey',
    school: 'Special Education'
  },
  {
    image: jon,
    text: 'I save countless hours every week with Weo. It has really given me the time to focus on what matters most – my students!',
    name: 'Jon Blumenfeld',
    school: 'NEA Community Learning Center'
  }
]
