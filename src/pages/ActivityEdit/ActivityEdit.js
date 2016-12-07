/**
 * Imports
 */

import {decodeRaw, preventDefault, component, element} from 'vdux'
import ActivitySidebar from 'components/ActivitySidebar'
import ActivityObject from 'components/ActivityObject'
import ActivityHeader from 'components/ActivityHeader'
import {Toast, Block, Icon, Card, Text} from 'vdux-ui'
import AttachmentMenu from './AttachmentMenu'
import findIndex from '@f/find-index'
import deepEqual from '@f/deep-equal'
import {debounce} from 'redux-timing'
import getProp from '@f/get-prop'
import summon from 'vdux-summon'
import index from '@f/index'
import map from '@f/map'

/**
 * <ActivityEdit/>
 */

export default summon(({activity}) => ({
  setPref: () => ({
    settingPref: {
      url: '/preference/onboard.create_share',
      invalidates: '/user',
      method: 'PUT',
      body: {
        value: true
      }
    }
  }),
  save: body => ({
    saving: {
      url: `/share/${activity._id}`,
      serialize: true,
      method: 'PUT',
      invalidates: false,
      body
    }
  })
}))(component({
  * onCreate ({path, props, actions}) {
    yield (dispatch, getState) => {
      window.onbeforeunload = function (e) {
        const state = getState()
        if (state && state.dirty) {
          e.returnValue = 'You have unsaved changes. Are you sure you want to exit?'
          return e.returnValue
        }
      }
    }
    yield actions.updatePref()
  },

  initialState: ({props}) => ({
    synced: true,
    numSaves: 0,
    editedActivity: props.activity,
    editing: 'header'
  }),

  render ({props, actions, state}) {
    const {selectedObject, selectObject, saving = {}, currentUser, setSpeaking, speakingId, speechRate} = props
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
                open={actions.toggleEdit('header')}
                onEdit={actions.changeHeader} />
              <Block>
                {
                  map((object, i) => (
                    <Block
                      key={object._id}
                      draggable={editing !== object._id}
                      onDragOver={decodeRaw(actions.onDragOver(object._id))}
                      onDragEnd={actions.clearDragging}
                      onMouseDown={decodeRaw(actions.setMouseDown)}
                      onDragStart={decodeRaw(actions.onDragStart(object._id))}
                      bgColor={state.dragging === object._id ? '#e2f4fb' : undefined}>
                      <ActivityObject
                        editable
                        showAnswers
                        object={object}
                        saving={state.openNext !== undefined && state.editing === object._id && saving.loading}
                        opening={state.openNext === object._id && saving.loading}
                        open={actions.toggleEdit}
                        selectObject={selectObject}
                        remove={actions.removeObject}
                        insert={actions.insertObject}
                        onEdit={actions.changeObject}
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
              <Block h={18} onDrop={preventDefault} onDragOver={decodeRaw(actions.onDragOver(null))} />
              <AttachmentMenu attach={actions.insertObject} startsOpen={!attachments.length} defaultPoints={defaultPoints} />
            </Block>
          </Block>
          <Block w={200} relative fixed={{top: 53}} float='right'>
            <ActivitySidebar canSetMax setMax={actions.setMax} activity={editedActivity} selectObject={selectObject} selectedObject={selectedObject} />
          </Block>
          <Block w={200} />
        </Block>
      </Block>
    )
  },

  * onUpdate (prev, next) {
    const {context, actions} = next
    const {saving = {}} = next.props
    const {dirty} = next.state
    const indicator = saving.loading
      ? 'Saving...'
      : dirty ? '' : 'Saved'

    if (next.props.savingIndicator !== indicator) {
      yield next.props.setIndicator(indicator)
    }

    if (prev.props.activity !== next.props.activity) {
      yield actions.mergeSaved(next.props.activity)
    }

    if (prev.state.editedActivity !== next.state.editedActivity && next.state.dirty) {
      yield actions.debouncedSave(next.state.editedActivity)
    }

    if (saving.error && !(prev.props.saving || {}).error) {
      yield context.showToast(
        <Toast key='a' bg='red' color='white' align='center center' w={520}>
          <Block align='center center'>
            <Icon name='error' fs='m' mr />
            <Text fw='bolder' mr>SAVE FAILED:</Text>
            <Text fw='lighter'>Please check your internet connection or refresh your page.</Text>
          </Block>
        </Toast>
      )
    }

    if (!saving.error && (prev.props.saving || {}).error) {
      yield context.hideToast()
    }
  },

  * onRemove ({props, context, state}) {
    const {saving = {}} = props
    window.onbeforeunload = null

    if (state.dirty) {
      yield props.save(state.editedActivity)
    }

    if (saving.error) {
      yield context.hideToast()
    }
  },

  middleware: [
    debounce('debouncedSave', 1000)
  ],

  controller: {
    * onDragOver ({actions, state}, id, e) {
      const types = [].slice.call(e._rawEvent.dataTransfer.types)
      if (types.indexOf('weo_attachment') === -1) return
      e.preventDefault()

      if (id === state.dragging || !state.dragging) return

      yield actions.moveObject({src: state.dragging, target: id})
    },

    * onDragStart ({actions, state}, id, e) {
      const cls = [].slice.call(state.target ? state.target.classList : [])

      if (cls.indexOf('handle') === -1) {
        e.preventDefault()
      } else {
        e._rawEvent.dataTransfer.setData('weo_attachment', id)
        yield actions.setDragging(id)
      }
    },

    * setMax ({state, actions}, qid, max) {
      const idx = findIndex(state.editedActivity._object[0].attachments, ({_id}) => _id === qid)

      if (idx === -1) return

      const obj = state.editedActivity._object[0].attachments[idx]

      yield actions.changeObject({
        ...obj,
        points: {
          ...(obj.points || {}),
          max
        }
      })
    },

    * toggleEdit ({props, state, actions}, id) {
      if (state.editing && state.dirty) {
        yield actions.openNext(id)
        yield actions.save(id)
      } else if (!(props.saving && props.saving.loading)) {
        yield actions.open(id)
      } else {
        yield actions.openNext(id)
      }
    },

    * save ({props, state, actions}) {
      if (!state || !state.dirty) return
      if (!state.synced) {
        yield actions.debouncedSave()
        return
      }

      yield actions.clearDirty()
      yield actions.beginSave()

      try {
        yield props.save(state.editedActivity)
      } catch (err) {
        yield actions.saveFailed()
        yield actions.debouncedSave()

        if (err && err.value && err.value.name === 'VersionError') {
          yield props.summonInvalidate('refresh_activity')
        }
      }
    },
    * debouncedSave ({actions}) {
      yield actions.save()
    },
    * updatePref ({props}) {
      const {currentUser, setPref, settingPref = {}} = props
      const value = getProp('preferences.onboard.create_share', currentUser)

      if (!settingPref.loading && !value) {
        yield setPref()
      }
    }
  },

  reducer: {
    open: (state, id) => ({
      editing: id === state.editing
        ? null
        : id
    }),
    beginSave: () => ({synced: false}),
    saveFailed: () => ({
      synced: true,
      dirty: true
    }),
    clearDirty: () => ({dirty: false}),
    openNext: (state, openNext) => ({openNext}),
    mergeSaved: (state, activity) => ({
      synced: true,
      openNext: undefined,
      editing: state.openNext !== undefined
        ? (state.openNext === state.editing ? null : state.openNext)
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
    changeHeader: (state, header) => ({
      dirty: true,
      editedActivity: {
        ...state.editedActivity,
        ...header
      }
    }),
    changeObject: changeAttachments((attachments, object) => attachments.map(replaceById(object))),
    removeObject: changeAttachments((attachments, object) => attachments.filter(({_id}) => _id !== object._id)),
    moveObject: changeAttachments((attachments, {src, target}) => {
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
    insertObject: (state, object, idx) => {
      let att = [...state.editedActivity._object[0].attachments]
      att.splice(idx === undefined ? att.length : idx, 0, object)
      return (
        {
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
    setDragging: (state, dragging) => ({dragging}),
    clearDragging: (state, dragging) => ({dragging: null}),
    setMouseDown: (state, e) => ({target: e.target})
  }
}))

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
    dirty: !clearDirty,
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
