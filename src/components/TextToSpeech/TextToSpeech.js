/**
 * Imports
 */

import speechSynthMw, * as speechSynth from 'middleware/speechSynth'
import {stopPropagation, component, element} from 'vdux'
import {Button, Block} from 'vdux-ui'
import noop from '@f/noop'
import map from '@f/map'

/**
 * <TextToSpeech/>
 */

export default component({
  render ({props, state, actions}) {
    const {rate, onEnd = noop, ...rest} = props
    const text = makeReadable(props.text)
    const {playState = 'stopped'} = state
    const isStopped = playState === 'stopped'
    const isPlaying = playState === 'playing'
    const isPaused = playState === 'paused'
    const btnProps = {
      color: 'text',
      mr: 's',
      fs: 's',
      disabled: isStopped
    }

    const handleEnd = [
      actions.cancelSpeech,
      onEnd(),
      actions.setState('stopped')
    ]

    return (
      <Block align='start center' mr='s' onClick={stopPropagation} {...rest}>
        <Button
          icon={isPlaying || isPaused ? 'volume_off' : 'volume_up'}
          onClick={
            isStopped
              ? [
                actions.setState('playing'),
                actions.playSpeech({
                  text,
                  rate,
                  onEnd: handleEnd
                })
              ]
              : [handleEnd, actions.setState('stopped')]
          }
          {...btnProps}
          disabled={false} />
        {
          text.length >= 4 && (
            <Block align='start center' disabled={isStopped}>
              <Button
                icon='fast_rewind'
                onClick={actions.rwSpeech}
                {...btnProps} />
              <Button
                icon={isPaused ? 'play_arrow' : 'pause'}
                onClick={
                  isPaused
                    ? [actions.resumeSpeech, actions.setState('playing')]
                    : [actions.pauseSpeech, actions.setState('paused')]
                }
                {...btnProps} />
              <Button
                icon='fast_forward'
                onClick={actions.ffSpeech}
                {...btnProps} />
            </Block>
          )
        }
      </Block>
    )
  },

  onRemove ({props, state, actions}) {
    if (state.playState === 'playing') {
      return actions.cancelSpeech()
    }
  },

  middleware: [
    speechSynthMw
  ],

  controller: {
    ...map(fn => function * (model, ...args) {
      yield fn(...args)
    }, speechSynth)
  },

  reducer: {
    setState: (state, playState) => ({playState})
  }
})

/**
 * Helpers
 */

function makeReadable (text) {
  if (text) {
    return text.replace(/__+/g, ', blank,')
      .replace(/&amp;/g, 'and')
      .split(/[\.!\?]”?\s|[\n\r]/)
      .filter(t => !!t)
  } else {
    return ['Text is not readable.']
  }
}
