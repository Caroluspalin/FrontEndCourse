import { useState, useEffect } from 'react'
import { AgGridReact } from '@ag-grid-community/react'
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model'
import { ColDef } from '@ag-grid-community/core'
import '@ag-grid-community/styles/ag-grid.css'
import '@ag-grid-community/styles/ag-theme-alpine.css'
import dayjs from 'dayjs'
import { IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'

type Training = {
  id: number
  date: string
  duration: number
  activity: string
  customerName: string
}

const GET_TRAININGS_URL = 'https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/gettrainings'
const TRAININGS_URL = 'https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/trainings'

export default function TrainingList() {
  const [trainings, setTrainings] = useState<Training[]>([])
  const [search, setSearch] = useState('')

  const fetchTrainings = () => {
    fetch(GET_TRAININGS_URL)
      .then(res => res.json())
      .then((data: any[]) => {
        const rows = data.map((t) => ({
          id: t.id,
          date: t.date,
          duration: t.duration,
          activity: t.activity,
          customerName: t.customer ? `${t.customer.firstname} ${t.customer.lastname}` : '',
        }))
        setTrainings(rows)
      })
      .catch(err => console.error(err))
  }

  useEffect(() => {
    fetchTrainings()
  }, [])

  const handleDelete = (training: Training) => {
    if (window.confirm(`Delete training "${training.activity}"?`)) {
      fetch(`${TRAININGS_URL}/${training.id}`, { method: 'DELETE' })
        .then(() => fetchTrainings())
        .catch(err => console.error(err))
    }
  }

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
    {
      headerName: 'Actions',
      flex: 0.7,
      cellRenderer: (params: any) => (
        <IconButton size="small" color="error" onClick={() => handleDelete(params.data)} title="Delete">
          <DeleteIcon fontSize="small" />
        </IconButton>
      ),
    },
  ]

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
