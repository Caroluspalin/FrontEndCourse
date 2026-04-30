import { useState, useEffect } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material'
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, { Dayjs } from 'dayjs'

type Props = {
  open: boolean
  customerHref: string | null
  customerName: string
  onClose: () => void
  onSaved: () => void
}

export default function AddTraining({ open, customerHref, customerName, onClose, onSaved }: Props) {
  const [date, setDate] = useState<Dayjs | null>(dayjs())
  const [duration, setDuration] = useState('')
  const [activity, setActivity] = useState('')

  useEffect(() => {
    if (open) {
      setDate(dayjs())
      setDuration('')
      setActivity('')
    }
  }, [open])

  const handleSave = () => {
    if (!customerHref || !date) return
    const body = {
      date: date.toISOString(),
      duration: Number(duration),
      activity: activity,
      customer: customerHref,
    }
    fetch('https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/trainings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
      .then(() => {
        onSaved()
        onClose()
      })
      .catch(err => console.error(err))
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add training for {customerName}</DialogTitle>
      <DialogContent>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            label="Date and time"
            value={date}
            onChange={(newValue) => setDate(newValue)}
            sx={{ mt: 1, width: '100%' }}
          />
        </LocalizationProvider>
        <TextField margin="dense" label="Activity" fullWidth value={activity} onChange={e => setActivity(e.target.value)} />
        <TextField margin="dense" label="Duration (minutes)" type="number" fullWidth value={duration} onChange={e => setDuration(e.target.value)} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  )
}
