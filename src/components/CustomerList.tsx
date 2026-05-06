import { useState, useEffect } from 'react'
import { AgGridReact } from '@ag-grid-community/react'
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model'
import { ColDef } from '@ag-grid-community/core'
import '@ag-grid-community/styles/ag-grid.css'
import '@ag-grid-community/styles/ag-theme-alpine.css'
import { Button, IconButton, Stack } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import AddCustomer from './AddCustomer'
import EditCustomer from './EditCustomer'
import AddTraining from './AddTraining'

type Customer = {
  firstname: string
  lastname: string
  email: string
  phone: string
  streetaddress: string
  postcode: string
  city: string
  _links: { self: { href: string } }
}

const API_URL = 'https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/customers'

const exportCsv = (rows: Customer[]) => {
  const headers = ['firstname', 'lastname', 'email', 'phone', 'streetaddress', 'postcode', 'city']
  const escape = (val: string) => `"${(val ?? '').replace(/"/g, '""')}"`
  const lines = [
    headers.join(','),
    ...rows.map(r => headers.map(h => escape((r as any)[h])).join(',')),
  ]
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'customers.csv'
  link.click()
  URL.revokeObjectURL(url)
}

export default function CustomerList() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [search, setSearch] = useState('')

  const [addOpen, setAddOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [trainingOpen, setTrainingOpen] = useState(false)
  const [selected, setSelected] = useState<Customer | null>(null)

  const fetchCustomers = () => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setCustomers(data._embedded.customers))
      .catch(err => console.error(err))
  }

  useEffect(() => {
    fetchCustomers()
  }, [])

  const handleDelete = (customer: Customer) => {
    if (window.confirm(`Delete ${customer.firstname} ${customer.lastname}?`)) {
      fetch(customer._links.self.href, { method: 'DELETE' })
        .then(() => fetchCustomers())
        .catch(err => console.error(err))
    }
  }

  const columns: ColDef[] = [
    { field: 'firstname', headerName: 'First Name', sortable: true, filter: true, flex: 1 },
    { field: 'lastname', headerName: 'Last Name', sortable: true, filter: true, flex: 1 },
    { field: 'email', headerName: 'Email', sortable: true, filter: true, flex: 1.5 },
    { field: 'phone', headerName: 'Phone', sortable: true, filter: true, flex: 1 },
    { field: 'streetaddress', headerName: 'Address', sortable: true, filter: true, flex: 1 },
    { field: 'city', headerName: 'City', sortable: true, filter: true, flex: 1 },
    {
      headerName: 'Actions',
      flex: 1.2,
      cellRenderer: (params: any) => (
        <Stack direction="row" spacing={0.5}>
          <IconButton size="small" color="primary" onClick={() => { setSelected(params.data); setTrainingOpen(true) }} title="Add training">
            <FitnessCenterIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => { setSelected(params.data); setEditOpen(true) }} title="Edit">
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" color="error" onClick={() => handleDelete(params.data)} title="Delete">
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Stack>
      ),
    },
  ]

  return (
    <div className="page">
      <h1>Customers</h1>
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Button variant="contained" onClick={() => setAddOpen(true)}>Add customer</Button>
        <Button variant="outlined" onClick={() => exportCsv(customers)}>Export CSV</Button>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ padding: '8px 12px', border: '1px solid #ccc', borderRadius: 6, width: 280 }}
        />
      </Stack>
      <div className="grid-wrapper ag-theme-alpine">
        <AgGridReact
          modules={[ClientSideRowModelModule]}
          rowData={customers}
          columnDefs={columns}
          quickFilterText={search}
          pagination={true}
          paginationPageSize={20}
        />
      </div>

      <AddCustomer
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSaved={fetchCustomers}
      />
      <EditCustomer
        open={editOpen}
        customer={selected}
        onClose={() => setEditOpen(false)}
        onSaved={fetchCustomers}
      />
      <AddTraining
        open={trainingOpen}
        customerHref={selected?._links.self.href ?? null}
        customerName={selected ? `${selected.firstname} ${selected.lastname}` : ''}
        onClose={() => setTrainingOpen(false)}
        onSaved={() => {}}
      />
    </div>
  )
}
