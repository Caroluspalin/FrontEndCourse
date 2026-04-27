import { useState, useEffect } from 'react'
import { AgGridReact } from '@ag-grid-community/react'
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model'
import { ColDef } from '@ag-grid-community/core'
import '@ag-grid-community/styles/ag-grid.css'
import '@ag-grid-community/styles/ag-theme-alpine.css'

type Customer = {
  firstname: string
  lastname: string
  email: string
  phone: string
  streetaddress: string
  city: string
}

const API_URL = 'https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/customers'

const columns: ColDef[] = [
  { field: 'firstname', headerName: 'First Name', sortable: true, filter: true, flex: 1 },
  { field: 'lastname', headerName: 'Last Name', sortable: true, filter: true, flex: 1 },
  { field: 'email', headerName: 'Email', sortable: true, filter: true, flex: 2 },
  { field: 'phone', headerName: 'Phone', sortable: true, filter: true, flex: 1 },
  { field: 'streetaddress', headerName: 'Address', sortable: true, filter: true, flex: 1 },
  { field: 'city', headerName: 'City', sortable: true, filter: true, flex: 1 },
]

export default function CustomerList() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setCustomers(data._embedded.customers))
      .catch(err => console.error(err))
  }, [])

  return (
    <div className="page">
      <h1>Customers</h1>
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
          rowData={customers}
          columnDefs={columns}
          quickFilterText={search}
          pagination={true}
          paginationPageSize={20}
        />
      </div>
    </div>
  )
}
