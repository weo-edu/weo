/**
 * Imports
 */

import {element} from 'vdux'
import RoundedInput from '.'
import vdux from 'vdux/dom'
import test from 'tape'

/**
 * <RoundedInput/> tests
 */

test('<RoundedInput/> should work', t => {
  const {render} = vdux()
  let node, input

  node = render(<RoundedInput />)
  input = node.firstChild.nextSibling

  t.equal(input.style.paddingBottom, '10px', 'paddingBottom')
  t.equal(input.style.paddingTop, '10px', 'paddingTop')
  t.equal(input.style.paddingLeft, '20px', 'paddingLeft')
  t.equal(input.style.paddingRight, '20px', 'paddingRight')

  t.end()
})
