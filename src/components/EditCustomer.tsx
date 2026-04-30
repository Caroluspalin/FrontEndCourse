import { useState, useEffect } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material'

type CustomerData = {
  firstname: string
  lastname: string
  email: string
  phone: string
  streetaddress: string
  postcode: string
  city: string
  _links: { self: { href: string } }
}

type Props = {
  open: boolean
  customer: CustomerData | null
  onClose: () => void
  onSaved: () => void
}

export default function EditCustomer({ open, customer, onClose, onSaved }: Props) {
  const [data, setData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    streetaddress: '',
    postcode: '',
    city: '',
  })

  useEffect(() => {
    if (customer) {
      setData({
        firstname: customer.firstname,
        lastname: customer.lastname,
        email: customer.email,
        phone: customer.phone,
        streetaddress: customer.streetaddress,
        postcode: customer.postcode,
        city: customer.city,
      })
    }
  }, [customer])

  const handleChange = (field: string, value: string) => {
    setData({ ...data, [field]: value })
  }

  const handleSave = () => {
    if (!customer) return
    fetch(customer._links.self.href, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
      .then(() => {
        onSaved()
        onClose()
      })
      .catch(err => console.error(err))
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit customer</DialogTitle>
      <DialogContent>
        <TextField margin="dense" label="First name" fullWidth value={data.firstname} onChange={e => handleChange('firstname', e.target.value)} />
        <TextField margin="dense" label="Last name" fullWidth value={data.lastname} onChange={e => handleChange('lastname', e.target.value)} />
        <TextField margin="dense" label="Email" fullWidth value={data.email} onChange={e => handleChange('email', e.target.value)} />
        <TextField margin="dense" label="Phone" fullWidth value={data.phone} onChange={e => handleChange('phone', e.target.value)} />
        <TextField margin="dense" label="Address" fullWidth value={data.streetaddress} onChange={e => handleChange('streetaddress', e.target.value)} />
        <TextField margin="dense" label="Post code" fullWidth value={data.postcode} onChange={e => handleChange('postcode', e.target.value)} />
        <TextField margin="dense" label="City" fullWidth value={data.city} onChange={e => handleChange('city', e.target.value)} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  )
}
