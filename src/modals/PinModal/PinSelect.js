/**
 * Imports
 */

import NewMenuItem from 'components/NewMenuItem'
import {Block, Button} from 'vdux-containers'
import WeoIcon from 'components/WeoIcon'
import {component, element} from 'vdux'
import flox, {fork} from '@flox/fork'
import validate from 'lib/validate'
import map from '@f/map'

/**
 * <PinSelect/>
 */

export default component({
  render ({props, actions, context, state}) {
    const {boards, busy, ...rest} = props

    return (
      <Block overflowY='auto' {...rest}>
        {
          map(board => <BoardItem busy={busy} board={board} onClick={actions.selectBoard(board)} selected={state.selected === board._id} />, boards)
        }
        <NewMenuItem key='newMenuItem' validate={validate.board} onSubmit={actions.handleSubmit} loading={busy} type='Board' />
      </Block>
    )
  },

  middleware: [
    flox
  ],

  controller: {
    * selectBoard ({actions, props}, board) {
      yield actions.select(board._id)
      yield props.onSelectBoard(board)
    },

    * handleSubmit ({props, actions}, board) {
      const newBoard = yield props.createBoard(board)
      yield fork(props.onSelectBoard(newBoard))
    }
  },

  reducer: {
    select: (state, selected) => ({selected})
  }
})

/**
 * Constants
 */

const outerHover = {highlight: 0.03}
const innerHover = {highlight: 0.01}

/**
 * <BoardItem/>
 */

function BoardItem ({props}) {
  const {onClick, board, busy, selected} = props

  return (
    <Block
      hoverProps={outerHover}
      align='start center'
      bgColor='white'
      pointer={!busy}
      onClick={!busy && onClick}
      p>
      <Button
        hoverProps={innerHover}
        focusProps={innerHover}
        border='1px solid blue'
        bgColor='white'
        color='blue'
        darkSpinner
        busy={selected && busy}
        disabled={busy}
        h='32px'
        w='38px'
        p='0'
        mr>
        <WeoIcon fs='s' name='pin' />
      </Button>
      {board.displayName}
    </Block>
  )
}
