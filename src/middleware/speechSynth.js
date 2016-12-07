/**
 * Imports
 */

import createAction from '@f/create-action'
import Confirm from 'modals/Confirm'

/**
 * Speech Synth.
 */

function middleware ({dispatch, getContext}) {
  let text = ''
  let rate = 1
  let sentence = 0
  let cb = () => {}
  let msg
  const speechSynthesis = window.speechSynthesis

  return next => action => {
    switch (action.type) {
      case playSpeech.type:
        if (!('speechSynthesis' in window)) {
          dispatch(getContext().openModal(() => <Confirm header='Browser Incompatible' message='Your browser does not support reading text. Please use the most up to date versions of Chrome or Safari to enable this feature.' />))
          dispatch(cb())
          return
        }

        speechSynthesis.cancel()
        if (msg) msg.onend = null
        dispatch(cb())

        text = action.payload.text
        rate = action.payload.rate
        cb = action.payload.onEnd
        sentence = 0

        speak()
        break
      case pauseSpeech.type:
        speechSynthesis.pause()
        break
      case resumeSpeech.type:
        speechSynthesis.resume()
        break
      case ffSpeech.type:
        speechSynthesis.cancel()
        break
      case rwSpeech.type:
        sentence = Math.max(sentence - 2, -1)
        speechSynthesis.cancel()
        break
      case cancelSpeech.type:
        cb = () => {}
        if (msg) msg.onend = null
        speechSynthesis.cancel()
        break
      default:
        return next(action)
    }
  }

  function speak () {
    msg = new SpeechSynthesisUtterance(text[sentence])

    msg.lang = 'en-US'
    msg.rate = rate
    speechSynthesis.speak(msg)

    msg.onend = () => {
      if (sentence === text.length - 1) dispatch(cb())
      else {
        sentence++
        speak()
      }
    }
  }
}

/**
 * Actions
 */

const rwSpeech = createAction('Speech Synthesis: rewind speech')
const playSpeech = createAction('Speech Synthesis: play speech')
const pauseSpeech = createAction('Speech Synthesis: pause speech')
const cancelSpeech = createAction('Speech Synthesis: cancel speech')
const resumeSpeech = createAction('Speech Synthesis: resume speech')
const ffSpeech = createAction('Speech Synthesis: fast forward speech')

/**
 * Exports
 */

export default middleware
export {
  playSpeech,
  pauseSpeech,
  resumeSpeech,
  ffSpeech,
  rwSpeech,
  cancelSpeech
}
