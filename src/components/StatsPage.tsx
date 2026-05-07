import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts'
import _ from 'lodash'

const GET_TRAININGS_URL = 'https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/gettrainings'

type Row = {
  activity: string
  minutes: number
}

export default function StatsPage() {
  const [data, setData] = useState<Row[]>([])

  useEffect(() => {
    fetch(GET_TRAININGS_URL)
      .then(res => res.json())
      .then((trainings: any[]) => {
        const grouped = _.groupBy(trainings, 'activity')
        const rows = _.map(grouped, (items, activity) => ({
          activity,
          minutes: _.sumBy(items, 'duration'),
        }))
        setData(rows)
      })
      .catch(err => console.error(err))
  }, [])

  return (
    <div className="page">
      <h1>Statistics</h1>
      <p>Total minutes booked per activity</p>
      <div style={{ height: '70vh', background: '#fff', padding: 16, borderRadius: 8 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="activity" />
            <YAxis label={{ value: 'minutes', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Bar dataKey="minutes" fill="#1976d2" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
