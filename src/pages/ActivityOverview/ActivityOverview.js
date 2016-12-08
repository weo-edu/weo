/**
 * Imports
 */

import {totalPoints, getOverviewQuestions} from 'lib/activity-helpers'
import QuestionOverview from './QuestionOverview'
import summonChannels from 'lib/summon-channels'
import datauriDownload from 'datauri-download'
import FourOhFour from 'pages/FourOhFour'
import {component, element} from 'vdux'
import {Button} from 'vdux-containers'
import Loading from 'pages/Loading'
import Histogram from './Histogram'
import {Block, Icon} from 'vdux-ui'
import getProp from '@f/get-prop'
import toCsv from 'to-csv'
import map from '@f/map'


/**
 * <ActivityOverview/>
 */

export default summonChannels(
  ({activity}) => `share!${activity._id}.instances`
)(component({
  render ({props, actions}) {
    const {students, activity, activities} = props
    const {value, loading, error} = activities

    if (loading) return <Loading show />
    if (error) return <FourOhFour />

    const instances = value.items
    const data = getData(activity, students)

    return (
      <Block w='col_main' mx='auto'>
        <Block align='end'>
          <Button w={138} mb my='s' onClick={actions.exportOverview}>
            Export Data
            <Icon name='file_download' ml='s' fs='xs' />
          </Button>
        </Block>
        <Histogram data={data} />
        <QuestionOverview instances={instances} {...props} />
      </Block>
    )
  },
  controller: {
    exportOverview ({props}) {
      let scores = {}
      const {activity, instances, students} = props
      const questions = getOverviewQuestions(activity._object[0].attachments, instances)
        .filter(q => !q.poll)
      const actors = getProp('instances.total.0.actors', activity)

      instances.forEach(inst => {
        inst._object[0].attachments.forEach(q => {
          const actor = actors[inst.actor.id]
          let response = undefined
          if(!scores[inst.actor.id]) {
            scores[inst.actor.id] = {
              percent: Math.round(actor.pointsScaled * 1000) / 10 + '%',
              points: []
            }
          }

          if(q.objectType === 'question' && !q.poll) {
            const score = actor.status >=4
              ? q.points.max * q.points.scaled
              : ''
            scores[inst.actor.id].points.push(isNaN(score) ? '' : score)
          }
        })
      })

      const csv = [
        ['First Name', 'Last Name', 'Total Average', ...map(q => q.displayName, questions)],
        [,,, ...map(toAverage, questions)],
        [,,, ...map(q => q.points.max, questions)],
        ...map(s => studentRow(s, scores[s._id]), students)
      ]

      downloadCsv(activity.displayName, csv)
    }
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

function toAverage(question) {
  const {total, numAnswered, points} = question
  const average = (total / (numAnswered || 1))
  return Math.round(average / points.max * 100) + '%'
}

function studentRow({name, _id}, scores) {
  return [name.givenName, name.familyName, scores.percent, ...scores.points]
}

function downloadCsv (filename, data) {
  datauriDownload(filename + '-' + today() + '.csv', 'text/csv;charset=utf-8', toCsv(data))
}

function today () {
  var d = new Date()
  return [d.getFullYear(), d.getMonth() + 1, d.getDate()].join('-')
}

function percentToIndex (percent) {
  return Math.max(Math.min(9, Math.floor(percent / 10)), 0)
}

function round (num) {
  return Math.round(num * 10) / 10
}
