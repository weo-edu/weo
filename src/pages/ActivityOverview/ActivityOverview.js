/**
 * Imports
 */

import QuestionOverview from './QuestionOverview'
import summonChannels from 'lib/summon-channels'
import {totalPoints} from 'lib/activity-helpers'
import FourOhFour from 'pages/FourOhFour'
import {component, element} from 'vdux'
import Loading from 'pages/Loading'
import Histogram from './Histogram'
import getProp from '@f/get-prop'
import {Block} from 'vdux-ui'

/**
 * <ActivityOverview/>
 */

export default summonChannels(
  ({activity}) => `share!${activity._id}.instances`
)(component({
  render ({props}) {
    const {students, activity, activities} = props
    const {value, loading, error} = activities

    if (loading) return <Loading show />
    if (error) return <FourOhFour />

    const instances = value.items
    const data = getData(activity, students)

    return (
      <Block w='col_main' mx='auto'>
        <Histogram data={data} />
        <QuestionOverview instances={instances} {...props} />
      </Block>
    )
  }
}))

/**
 * Helpers
 */

function getData (activity, students) {
  const total = totalPoints(activity)
  const actors = getProp('instances.total.0.actors', activity)
  let averagePoints = 0
  let averagePercent = 0
  let numReturned = 0
  let binMax = 0
  let bins = []

  for (var i = 0; i < 10; i++) {
    bins[i] = []
  }

  students.forEach(function (student) {
    const actor = actors && actors[student._id]

    if (!actor) return

    const {pointsScaled = 0, status = 1} = actor
    const points = pointsScaled * total
    const percent = pointsScaled * 100

    const instance = {
      points: round(points),
      percent: round(percent) + '%',
      displayName: student.displayName
    }

    if (status >= 4) {
      numReturned++
      averagePoints += points
      averagePercent += percent
      const i = percentToIndex(percent)
      bins[i].push(instance)
      binMax = Math.max(bins[i].length, binMax)
    }
  })

  return {
    averagePercent: round(averagePercent / (numReturned || 1)) + '%',
    averagePoints: round(averagePoints / (numReturned || 1)),
    numStudents: students.length,
    totalPoints: total,
    numReturned,
    binMax,
    bins
  }
}

function percentToIndex (percent) {
  return Math.max(Math.min(9, Math.floor(percent / 10)), 0)
}

function round (num) {
  return Math.round(num * 10) / 10
}
