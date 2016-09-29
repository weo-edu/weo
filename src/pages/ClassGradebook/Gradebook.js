/**
 * Imports
 */

import {Table, TableRow, Block, Icon} from 'vdux-ui'
import {totalPoints} from 'lib/activity-helpers'
import summonChannels from 'lib/summon-channels'
import GradebookHeader from './GradebookHeader'
import datauriDownload from 'datauri-download'
import handleActions from '@f/handle-actions'
import createAction from '@f/create-action'
import summonPrefs from 'lib/summon-prefs'
import GradebookNav from './GradebookNav'
import GradebookRow from './GradebookRow'
import Loading from 'components/Loading'
import findIndex from '@f/find-index'
import element from 'vdux/element'
import getProp from '@f/get-prop'
import reduce from '@f/reduce'
import toCsv from 'to-csv'
import map from '@f/map'

/**
 * Constants
 */

const pageSize = 7
let hasData = false

/**
 * initialState
 */

function initialState ({props}) {
  const {page} = props

  return {
    page: 0
  }
}

/**
 * <Gradebook/>
 */

function render ({props, local, state}) {
  const {group, students, activities, currentUser, setPref, prefs} = props
  const {page} = state
  const sort = prefs.gradebookSort || {property: 'name.givenName', dir: 1}
  const displayPercent = getProp('gradebook.displayPercent', prefs)
  const {value, loading, loaded} = activities

  if (!loaded && loading) return <Loading show={true} h='200' />

  const totals = []
  const activityList = value.items.filter(activity => {
    const total = totalPoints(activity)
    if(total)
      return totals.push(total)
  })

  const numPages = Math.ceil(activityList.length / pageSize)
  const studentList = students.sort(cmp)
  const usersData = map(user => getUsersData(user._id, activityList, totals), studentList)

  return (
    <Block w='col_main' mx='auto' my='l' relative>
      <GradebookNav setPref={setPref} next={local(next, numPages)} prev={local(prev, numPages)} exportAll={exportAll} asPercent={displayPercent} page={page} numPages={numPages} hasData={hasData}/>
      <Block boxShadow='card' overflow='auto' relative bg='linear-gradient(to bottom, grey 0px, grey 55px, off_white 55px)'>
        <Table overflow='auto'>
          <GradebookHeader setPref={setPref} activities={curArr(activityList)} exportActivity={exportActivity} totals={totals} sort={sort}/>
          {
            map((student, i) => <GradebookRow
              data={usersData[i]}
              scores={curArr(usersData[i].scores)}
              asPercent={displayPercent}
              student={student}
              odd={i%2}
              page={page}
              currentUser={currentUser}
              last={studentList.length === (i+1)} />, studentList)
          }
        </Table>
      </Block>
    </Block>
  )

  function curArr (arr) {
    return arr.slice(page * pageSize, (page + 1) * pageSize)
  }

  function exportAll () {
    const headers = ['Id', 'Name', 'Total', ...activityList.map(({displayName}) => displayName)]
    const content = map((user, i) => [
      user.sisId,
      user.displayName,
      usersData[i].percent,
      ...map(score =>
        score.percent === '-'
          ? ''
          : displayPercent ? score.percent : score.points,
        usersData[i].scores
      )
    ], studentList)

    downloadCsv(group.displayName, [headers, ...content])
  }

  function exportActivity (activity) {
    const idx = findIndex(activityList, ({_id}) => _id === activity._id)
    const headers = ['Id', 'Name', 'Grade']
    const content = map((user, i) => {
      const score = usersData[i].scores[idx]

      return [
        user.sisId,
        user.displayName,
        score.percent === '-'
          ? ''
          : displayPercent ? score.percent : score.points
      ]
    }, studentList)

    downloadCsv(activity.displayName, [headers, ...content])
  }

  function cmp (a, b) {
    if(!sort) return
    const {property, dir} = sort

    return getProp(property, a).toUpperCase() > getProp(property, b).toUpperCase()
      ? 1 * dir
      : -1 * dir
  }
}

/**
 * Helpers
 */

function downloadCsv (filename, data) {
  datauriDownload(filename + '-' + today() + '.csv', 'text/csv;charset=utf-8', toCsv(data))
}

function today () {
  var d = new Date()
  return [d.getFullYear(), d.getMonth() + 1, d.getDate()].join('-')
}

function getUsersData (id, activities, totals) {
  return reduce((acc, {instances: {total}}, i) => {
    const inst = total.length ? total[0].actors[id] : false

    acc.total += totals[i]

    if (!inst || inst.status < 5) {
      acc.scores.push({
        points: '-',
        percent: '-',
        total: totals[i]
      })
      acc.percent = Math.round((acc.points / acc.total) * 100) + '%'
      return acc
    }
    hasData = true
    const points = inst.pointsScaled * totals[i]
    const percent = Math.round(inst.pointsScaled * 100) + '%'

    acc.points += points

    acc.percent = Math.round((acc.points / acc.total) * 100) + '%'
    acc.scores.push({total: totals[i], points, percent})

    return acc
  }, {points: 0, total: 0, scores: []}, activities)
}

/**
 * Actions
 */

const next = createAction('<Gradebook/>: next')
const prev = createAction('<Gradebook/>: prev')

/**
 * Reducer
 */

const reducer = handleActions({
  [next]: (state, numPages) => ({
    ...state,
    page: Math.min(state.page + 1, (numPages - 1))
  }),
  [prev]: state => ({
    ...state,
    page: Math.max(state.page - 1, 0)
  })
})

/**
 * Exports
 */

export default summonChannels(({group}) => `group!${group._id}.board`)(summonPrefs()({
  initialState,
  render,
  reducer
}))
