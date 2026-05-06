import { useState, useEffect } from 'react'
import { Calendar, dayjsLocalizer, Views } from 'react-big-calendar'
import dayjs from 'dayjs'
import 'react-big-calendar/lib/css/react-big-calendar.css'

const localizer = dayjsLocalizer(dayjs)

const GET_TRAININGS_URL = 'https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/gettrainings'

type Event = {
  title: string
  start: Date
  end: Date
}

export default function CalendarPage() {
  const [events, setEvents] = useState<Event[]>([])

  useEffect(() => {
    fetch(GET_TRAININGS_URL)
      .then(res => res.json())
      .then((data: any[]) => {
        const evts = data.map(t => {
          const start = new Date(t.date)
          const end = new Date(start.getTime() + t.duration * 60000)
          const customerName = t.customer ? `${t.customer.firstname} ${t.customer.lastname}` : ''
          return {
            title: `${t.activity} / ${customerName}`,
            start,
            end,
          }
        })
        setEvents(evts)
      })
      .catch(err => console.error(err))
  }, [])

  return (
    <div className="page">
      <h1>Calendar</h1>
      <div style={{ height: '75vh', background: '#fff', padding: 12, borderRadius: 8 }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          defaultView={Views.MONTH}
          views={[Views.MONTH, Views.WEEK, Views.DAY]}
        />
      </div>
    </div>
  )
}
