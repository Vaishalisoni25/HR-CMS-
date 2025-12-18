import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Tooltip,
} from '@mui/material';
import CustomButton from './CustomButton';
import CustomDatePicker from './CustomDatePicker';

// Event types and colors
const eventTypes = [
  { label: 'Present', color: '#81C784' },        
  { label: 'Absent', color: '#E57373' },         
  { label: 'Work From Home', color: '#64B5F6' }, 
  { label: 'Half-day', color: '#FFB74D' },       
  { label: 'Holiday', color: '#BA68C8' },        
  { label: 'Meeting', color: '#90A4AE' },           
];

const HRCalendar = () => {
  const [events, setEvents] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
   const [selectedEventId, setSelectedEventId] = useState(null);
//   const [selectedDate, setSelectedDate] = useState('');
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    color: '',
    description: '',
  });

  // Handle clicking a date
  const handleDateClick = (info) => {
    // setSelectedDate(info.dateStr);
    // setNewEvent({ ...newEvent, date: info.dateStr });
    setIsEditing(false);
    setSelectedEventId(null);
    setNewEvent({ title: '', date: info.dateStr, color: '', description: '' });
    setOpenModal(true);
  };

  // Click on an event → Edit modal
  const handleEventClick = (info) => {
    const event = info.event;
    setIsEditing(true);
    setSelectedEventId(event.id.toString());

    setNewEvent({
      title: event.title,
      date: event.startStr,
      color: event.backgroundColor,
      description: event.extendedProps.description || '',
    });

    setOpenModal(true);
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    // setNewEvent({ ...newEvent, [name]: value });
    setNewEvent((prev) => ({ ...prev, [name]: value }));

  if (name === 'title') {
    const type = eventTypes.find((t) => t.label === value);
    if (type) {
      setNewEvent((prev) => ({ ...prev, color: type.color, backgroundColor: type.color }));
    }
  }
  };

  // Add new event
//   const handleAddEvent = () => {
//     if (!newEvent.title || !newEvent.date) return alert('Please select event type and date');
//     setEvents([...events, newEvent]);
//     setNewEvent({ title: '', date: '', color: '', description: '' });
//     setOpenModal(false);
//   };

// Add new event
  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.date)
      return alert('Please select event type and date');

    const newItem = {
      id: Date.now().toString(),
      title: newEvent.title,
      // date: newEvent.date,
      start: newEvent.date,
      backgroundColor: newEvent.color,
      description: newEvent.description,
    };

    setEvents([...events, newItem]);
    setOpenModal(false);
  };

  // Save edited event
  const handleUpdateEvent = () => {
    setEvents((prev) =>
      prev.map((ev) =>
        ev.id === selectedEventId
          ? {
              ...ev,
              title: newEvent.title,
              date: newEvent.date,
              backgroundColor: newEvent.color,
              description: newEvent.description,
            }
          : ev
      )
    );

    setOpenModal(false);
  };

  // Delete event
  const handleDeleteEvent = () => {
    if (!window.confirm('Delete this event?')) return;

    setEvents((prev) => prev.filter((ev) => ev.id !== selectedEventId));
    setOpenModal(false);
  };

  return (
    <>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        dayMaxEvents={true}
        dateClick={handleDateClick}
        eventClick={handleEventClick} 
        eventContent={(eventInfo) => (
          <Tooltip title={eventInfo.event.extendedProps.description || ''} arrow>
            <div
              style={{
                backgroundColor: eventInfo.event.backgroundColor || eventInfo.event.color,
                padding: '2px 4px',
                borderRadius: '4px',
                color: '#fff',
                fontSize: '0.75rem',
                textAlign: 'center',
                marginBottom: '2px',
              }}
            >
              {eventInfo.event.title}
            </div>
          </Tooltip>
        )}
      />

      {/* Modal for adding new events */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
       
        <DialogTitle>{isEditing ? 'Edit Event' : 'Add Event'}</DialogTitle>
        <DialogContent>
          <TextField
            select
            label="Event Type"
            name="title"
            value={newEvent.title}
            onChange={handleChange}
            fullWidth
            margin="dense"
          >
            {eventTypes.map((type) => (
              <MenuItem
                key={type.label}
                value={type.label}
                // onClick={() => setNewEvent({ ...newEvent, color: type.color })}
              >
                {type.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Date"
            name="date"
            type="date"
            value={newEvent.date}
            onChange={handleChange}
            fullWidth
            margin="dense"
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="Description"
            name="description"
            value={newEvent.description}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
            {isEditing && (
            <CustomButton color="error" variant='outlined' onClick={handleDeleteEvent}>
              Delete
            </CustomButton>
          )}
          <CustomButton variant="outlined" onClick={() => setOpenModal(false)}>Cancel</CustomButton>
           {isEditing ? (
            <CustomButton variant="contained" onClick={handleUpdateEvent}>
              Save Changes
            </CustomButton>
          ) : (
          <CustomButton variant="contained" onClick={handleAddEvent}>
            Add
          </CustomButton>
           )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default HRCalendar;
