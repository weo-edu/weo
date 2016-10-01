/**
 * Imports
 */

import CommoncoreBadge from 'components/CommoncoreBadge'
import ActivitySidebar from 'components/ActivitySidebar'
import ActivityObject from 'components/ActivityObject'
import ActivityHeader from 'components/ActivityHeader'
import {setUrl} from 'redux-effects-location'
import AttachmentMenu from './AttachmentMenu'
import handleActions from '@f/handle-actions'
import createAction from '@f/create-action'
import {Block, Icon, Card} from 'vdux-ui'
import {Button} from 'vdux-containers'
import {lookup} from 'redux-ephemeral'
import findIndex from '@f/find-index'
import deepEqual from '@f/deep-equal'
import element from 'vdux/element'
import debounce from '@f/debounce'
import getProp from '@f/get-prop'
import summon from 'vdux-summon'
import index from '@f/index'
import map from '@f/map'

/**
 * onCreate
 */

function onCreate ({path, props}) {
  return (dispatch, getState) => {
    window.onbeforeunload = function (e) {
      const state = lookup(getState().ui, path)
      if (state && state.dirty) {
        e.returnValue = 'You have unsaved changes. Are you sure you want to exit?'
        return e.returnValue
      }
    }
  }
}

/**
 * initialState
 */

function initialState ({props, local, path}) {
  const {activity, save} = props
  let debouncedSave
  let cancelSave = () => {}

  return {
    synced: true,
    numSaves: 0,
    editedActivity: activity,
    editing: 'header',
    open: local(open),
    change: local(change),
    moveObject: local(moveObject),
    changeObject: local(changeObject),
    removeObject: local(removeObject),
    insertObject: local(insertObject),
    mergeSaved: local(mergeSaved),
    setDragging: local(setDragging),
    clearDragging: local(clearDragging),
    setMax: (qid, max) => (dispatch, getState) => {
      const state = lookup(getState().ui, path)
      const idx = findIndex(state.editedActivity._object[0].attachments, ({_id}) => _id === qid)

      if (idx === -1) return

      const obj = state.editedActivity._object[0].attachments[idx]

      dispatch(state.changeObject({
        ...obj,
        points: {
          ...(obj.points || {}),
          max
        }
      }))
    },
    toggleEdit: id => (dispatch, getState) => {
      const state = lookup(getState().ui, path)
      const parentState = lookup(getState().ui, path.slice(0, path.lastIndexOf('.')))

      if (state.editing && state.dirty) {
        dispatch(local(openNext)(id))
        return dispatch(state.save(id))
      } else if (!(parentState.saving && parentState.saving.loading)) {
        dispatch(state.open(id))
      } else {
        dispatch(local(openNext)(id))
      }
    },
    save: id => (dispatch, getState) => {
      // XXX Hack until we find a good solution to avoid
      // creating new event handlers whenever anything changes
      const state = lookup(getState().ui, path)

      if (!state || !state.dirty) return
      if (!state.synced) {
        dispatch(state.debouncedSave())
        return
      }

      dispatch(local(clearDirty)())
      dispatch(local(beginSave)())

      return dispatch(props.save(state.editedActivity))
    },
    debouncedSave: () => (dispatch, getState) => {
      if (!debouncedSave) {
        const state = lookup(getState().ui, path)
        debouncedSave = debounce(() => dispatch(state.save()), 1000)
      }

      cancelSave = debouncedSave()
    }
  }
}

/**
 * <ActivityEditor/>
 */

function render ({props, local, state}) {
  const {debouncedSave, selectedObject, selectObject, save, saving = {}, currentUser, setSpeaking, speakingId, speechRate} = props
  const defaultPoints = getProp('preferences.max_points', currentUser)
  const {editing, editedActivity} = state
  const {attachments} = editedActivity._object[0]
  let idx = 0

  return (
    <Block align='center start'>
      <Block align='end start'>
        <Block>
          <Card w={756} mr>
            <ActivityHeader
              editable
              clickableTags
              activity={editedActivity}
              editing={editing === 'header'}
              open={() => state.toggleEdit('header')}
              onEdit={header => local(change)({...editedActivity, ...header})} />
            <Block>
              {
                map((object, i) => (
                  <Block
                    draggable
                    key={object._id}
                    onDragOver={onDragOver(object._id)}
                    onDragEnd={state.clearDragging}
                    onMouseDown={local(setMouseDown)}
                    onDragStart={e => onDragStart(e, object._id)}
                    bgColor={state.dragging === object._id ? '#e2f4fb' : undefined}>
                    <ActivityObject
                      editable
                      showAnswers
                      object={object}
                      saving={state.openNext !== undefined && state.editing === object._id && saving.loading}
                      opening={state.openNext === object._id && saving.loading}
                      open={state.toggleEdit}
                      selectObject={selectObject}
                      remove={state.removeObject}
                      insert={state.insertObject}
                      onEdit={state.changeObject}
                      isDragging={!!state.dragging}
                      editing={editing === object._id}
                      speechEnabled={editedActivity.textToSpeech}
                      hidden={state.dragging === object._id}
                      isSelected={selectedObject === object._id}
                      setSpeaking={setSpeaking}
                      speechRate={speechRate}
                      speakingId={speakingId}
                      pos={i}
                      idx={object.objectType === 'question' ? idx++ : null} />
                  </Block>), attachments)
              }
            </Block>
          </Card>
          <Block mr>
            <Block h={18} onDrop={e => e.preventDefault()} onDragOver={onDragOver()} />
            <AttachmentMenu attach={state.insertObject} startsOpen={!attachments.length} defaultPoints={defaultPoints} />
          </Block>
        </Block>
        <Block w={200} relative fixed={{top: 53}} float='right'>
          <ActivitySidebar canSetMax setMax={state.setMax} activity={editedActivity} selectObject={selectObject} selectedObject={selectedObject} />
        </Block>
        <Block w={200} />
      </Block>
    </Block>
  )

  function onDragStart (e, id) {
    const cls = [].slice.call(state.target ? state.target.classList : [])

    if(cls.indexOf('handle') === -1) {
      e.preventDefault()
    } else {
      e._rawEvent.dataTransfer.setData('weo_attachment', id)
      return local(setDragging, id)()
    }
  }

  function onDragOver (id) {
    return e => {
      if (e._rawEvent.dataTransfer.types.indexOf('weo_attachment') === -1) return
      e.preventDefault()

      if (id === state.dragging || !state.dragging) return

      return state.moveObject({src: state.dragging, target: id})
    }
  }

  function beforeUnload () {
    if (state.dirty) {
      return 'test'
    }
  }
}

/**
 * onUpdate
 */

function onUpdate (prev, next) {
  const {saving = {}} = next.props
  const {dirty} = next.state
  const indicator = saving.loading
    ? 'Saving...'
    : dirty ? '' : 'Saved'

  const actions = []

  if (next.props.savingIndicator !== indicator) {
    actions.push(next.props.setIndicator(indicator))
  }

  if (prev.props.activity !== next.props.activity) {
    actions.push(next.state.mergeSaved(next.props.activity))
  }

  if (prev.state.editedActivity !== next.state.editedActivity && next.state.dirty) {
    actions.push(next.state.debouncedSave(next.state.editedActivity))
  }

  return actions
}

/**
 * onRemove
 */

function onRemove ({props, state}) {
  window.onbeforeunload = null

  if (state.dirty) {
    return props.save(state.editedActivity)
  }
}

/**
 * Actions
 */

const open = createAction('<ActivityEditor/>: open')
const change = createAction('<ActivityEditor/>: change')
const beginSave = createAction('<ActivityEditor/>: begin save')
const changeObject = createAction('<ActivityEditor/>: change object')
const removeObject = createAction('<ActivityEditor/>: remove object')
const insertObject = createAction('<ActivityEditor/>: insert object')
const moveObject = createAction('<ActivityEditor/>: move object')
const mergeSaved = createAction('<ActivityEditor/>: merge saved')
const setDragging = createAction('<ActivityEditor/>: set dragging')
const clearDragging = createAction('<ActivityEditor/>: clear dragging')
const clearDirty = createAction('<ActivityEditor/>: clear dirty')
const setMouseDown = createAction('<ActivityEditor/>: set mouse down', e => e.target)
const openNext = createAction('<ActivityEditor/>: open next')

/**
 * Reducer
 */

const reducer = handleActions({
  [open]: (state, id) => ({
    ...state,
    editing: id === state.editing
      ? null
      : id
  }),
  [beginSave]: state => ({
    ...state,
    synced: false
  }),
  [clearDirty]: state => ({
    ...state,
    dirty: false
  }),
  [openNext]: (state, id) => ({
    ...state,
    openNext: id
  }),
  [mergeSaved]: (state, activity) => ({
    ...state,
    synced: true,
    openNext: undefined,
    editing: state.openNext !== undefined
      ? state.openNext
      : state.editing,
    numSaves: state.numSaves + 1,
    editedActivity: {
      ...state.editedActivity,
      __v: activity.__v,
      _object: [{
        ...state.editedActivity._object[0],
        attachments: mergeAttachments(state.editedActivity._object[0].attachments, activity._object[0].attachments)
      }]
    }
  }),
  [change]: (state, editedActivity) => ({
    ...state,
    dirty: true,
    editedActivity
  }),
  [changeObject]: changeAttachments((attachments, object) => attachments.map(replaceById(object))),
  [removeObject]: changeAttachments((attachments, object) => attachments.filter(({_id}) => _id !== object._id)),
  [moveObject]: changeAttachments((attachments, {src, target}) => {
    attachments = attachments.slice()

    const srcIdx = findIndex(attachments, ({_id}) => _id === src)
    const [obj] = attachments.splice(srcIdx, 1)

    if (target) {
      const targetIdx = findIndex(attachments, ({_id}) => _id === target)
      attachments.splice(targetIdx, 0, obj)
    } else {
      attachments.push(obj)
    }

    return attachments
  }),
  [insertObject]: (state, {object, idx}) => {
    let att = [...state.editedActivity._object[0].attachments]
    att.splice(idx === undefined ? att.length : idx, 0, object)
    return (
      {
        ...state,
        dirty: true,
        editing: object._id,
        editedActivity: {
          ...state.editedActivity,
          _object: [{
            ...state.editedActivity._object[0],
            attachments: att
          }]
        }
      }
    )
  },
  [setDragging]: (state, dragging) => ({
    ...state,
    dragging
  }),
  [clearDragging]: (state, dragging) => ({
    ...state,
    dragging: null
  }),
  [setMouseDown]: (state, target) => ({
    ...state,
    target
  })
})

/**
 * Helpers
 */

function replaceById (newObject) {
  return object => object._id === newObject._id
    ? newObject
    : object
}

function changeAttachments (fn, clearDirty) {
  return (state, payload) => ({
    ...state,
    dirty: clearDirty ? false : true,
    editedActivity: {
      ...state.editedActivity,
      _object: [{
        ...state.editedActivity._object[0],
        attachments: fn(state.editedActivity._object[0].attachments, payload)
      }]
    }
  })
}

const media = ['video', 'image', 'document', 'link']

function mergeAttachments (edited, saved) {
  const result = []
  const idMap = index(({_id}) => _id, saved)

  for (let i = 0; i < edited.length; i++) {
    const att = edited[i]

    idMap[att._id]
      ? result.push(mergeAttachment(att, idMap[att._id]))
      : result.push(att)
  }

  return result
}

function mergeAttachment (edited, saved) {
  if (deepEqual(edited, saved)) {
    return edited
  }

  if (media.indexOf(edited.objectType) !== -1) {
    return {
      ...saved,
      originalContent: edited.originalContent,
      zoom: edited.zoom,
      justify: edited.justify
    }
  }

  const idMap = index(({_id}) => _id, saved.attachments)

  return {
    ...edited,
    content: saved.content,
    displayName: saved.displayName || '',
    points: saved.points,
    attachments: (edited.attachments || []).map((att, i) => ({
      ...edited.attachments[i],
      displayName: idMap[att._id]
        ? idMap[att._id].displayName
        : att.displayName,
      content: idMap[att._id]
        ? idMap[att._id].content
        : att.content
    }))
  }
}

/**
 * Exports
 */

export default summon(({activity}) => ({
  save: body => ({
    saving: {
      url: `/share/${activity._id}`,
      serialize: true,
      method: 'PUT',
      invalidates: false,
      body
    }
  })
}))({
  onCreate,
  initialState,
  render,
  onUpdate,
  reducer,
  onRemove
})
