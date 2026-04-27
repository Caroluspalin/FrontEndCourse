import { useState, useEffect } from 'react'
import { AgGridReact } from '@ag-grid-community/react'
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model'
import { ColDef } from '@ag-grid-community/core'
import '@ag-grid-community/styles/ag-grid.css'
import '@ag-grid-community/styles/ag-theme-alpine.css'
import dayjs from 'dayjs'

type Training = {
  date: string
  duration: number
  activity: string
  customerName: string
}

const TRAININGS_URL = 'https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/trainings'
const CUSTOMERS_URL = 'https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/customers'

const columns: ColDef[] = [
  {
    field: 'date',
    headerName: 'Date',
    sortable: true,
    filter: true,
    flex: 1.5,
    valueFormatter: (params) =>
      params.value ? dayjs(params.value).format('DD.MM.YYYY HH:mm') : '',
  },
  { field: 'duration', headerName: 'Duration (min)', sortable: true, filter: true, flex: 1 },
  { field: 'activity', headerName: 'Activity', sortable: true, filter: true, flex: 1 },
  { field: 'customerName', headerName: 'Customer', sortable: true, filter: true, flex: 1.5 },
]

export default function TrainingList() {
  const [trainings, setTrainings] = useState<Training[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    Promise.all([
      fetch(TRAININGS_URL).then(r => r.json()),
      fetch(CUSTOMERS_URL).then(r => r.json()),
    ])
      .then(([trainingData, customerData]) => {
        const customerMap: Record<string, string> = {}
        customerData._embedded.customers.forEach((c: any) => {
          customerMap[c._links.self.href] = `${c.firstname} ${c.lastname}`
        })

        const rows = trainingData._embedded.trainings.map((t: any) => ({
          date: t.date,
          duration: t.duration,
          activity: t.activity,
          customerName: customerMap[t._links.customer.href] || '',
        }))

        setTrainings(rows)
      })
      .catch(err => console.error(err))
  }, [])

  return (
    <div className="page">
      <h1>Trainings</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <div className="grid-wrapper ag-theme-alpine">
        <AgGridReact
          modules={[ClientSideRowModelModule]}
          rowData={trainings}
          columnDefs={columns}
          quickFilterText={search}
          pagination={true}
          paginationPageSize={20}
        />
      </div>
    </div>
  )
}
