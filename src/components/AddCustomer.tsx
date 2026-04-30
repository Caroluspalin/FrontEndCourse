import { useState } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material'

type Props = {
  open: boolean
  onClose: () => void
  onSaved: () => void
}

const empty = {
  firstname: '',
  lastname: '',
  email: '',
  phone: '',
  streetaddress: '',
  postcode: '',
  city: '',
}

export default function AddCustomer({ open, onClose, onSaved }: Props) {
  const [customer, setCustomer] = useState(empty)

  const handleChange = (field: string, value: string) => {
    setCustomer({ ...customer, [field]: value })
  }

  const handleSave = () => {
    fetch('https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customer),
    })
      .then(() => {
        setCustomer(empty)
        onSaved()
        onClose()
      })
      .catch(err => console.error(err))
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>New customer</DialogTitle>
      <DialogContent>
        <TextField margin="dense" label="First name" fullWidth value={customer.firstname} onChange={e => handleChange('firstname', e.target.value)} />
        <TextField margin="dense" label="Last name" fullWidth value={customer.lastname} onChange={e => handleChange('lastname', e.target.value)} />
        <TextField margin="dense" label="Email" fullWidth value={customer.email} onChange={e => handleChange('email', e.target.value)} />
        <TextField margin="dense" label="Phone" fullWidth value={customer.phone} onChange={e => handleChange('phone', e.target.value)} />
        <TextField margin="dense" label="Address" fullWidth value={customer.streetaddress} onChange={e => handleChange('streetaddress', e.target.value)} />
        <TextField margin="dense" label="Post code" fullWidth value={customer.postcode} onChange={e => handleChange('postcode', e.target.value)} />
        <TextField margin="dense" label="City" fullWidth value={customer.city} onChange={e => handleChange('city', e.target.value)} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  )
}
