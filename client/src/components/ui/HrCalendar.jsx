import React, { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Tooltip, Box, Chip } from '@mui/material';
import AttendanceDialog from '../dashboard/attendance/AttendanceDialog';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAttendance, addAttendance } from '@/redux/store/attendance/attendanceThunk';
import { toast } from 'react-toastify';

// Event types and colors
const eventTypes = [
  { label: 'Attended', color: '#81C784' },
  { label: 'Absent', color: '#E57373' },
  { label: 'Work From Home', color: '#64B5F6' },
  { label: 'Half-day', color: '#FFB74D' },
  { label: 'Leave', color: '#BA68C8' },
  { label: 'Sick Leave', color: '#90A4AE' },
];

const EventLegend = () => (
  <Box component="div" className="event-legend" sx={{ mb: 3 }}>
    {eventTypes.map((type) => (
      <Chip
        key={type.label}
        label={type.label}
        size="small"
        className="chip"
        style={{ backgroundColor: type.color }}
      />
    ))}
  </Box>
);

const HRCalendar = ({ selectedEmployee, selectedMonth, selectedYear }) => {
  const dispatch = useDispatch();
  const attendanceList = useSelector((state) => state.attendance.list);
  const [events, setEvents] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    action: '',
    leaveType: '',
    countInPolicy: '',
  });
  const [selectedDate, setSelectedDate] = useState(null);

  const calendarRef = useRef(null);

  useEffect(() => {
    if (selectedEmployee && selectedMonth && selectedYear) {
      dispatch(fetchAttendance({
        employeeId: selectedEmployee,
        month: selectedMonth,
        year: selectedYear
      }));
    }
  }, [selectedEmployee, selectedMonth, selectedYear, dispatch]);

  useEffect(() => {
    if (selectedMonth && selectedYear && calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      const newDate = new Date(selectedYear, selectedMonth - 1, 1);
      calendarApi.gotoDate(newDate);
    }
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    if (!attendanceList) return;

    const typeColorMap = {
      Attended: '#81C784',
      Absent: '#E57373',
      'Work From Home': '#64B5F6',
      'Half-day': '#FFB74D',
      Leave: '#BA68C8',
      'Sick Leave': '#90A4AE',
    };

    const mappedEvents = attendanceList.map(att => ({
      id: att._id,
      title: att.status,
      start: att.date.split('T')[0],
      allDay: true,
      backgroundColor: typeColorMap[att.status] || '#90A4AE',
      employeeId: att.employeeId,
    }));

    setEvents(mappedEvents);
  }, [attendanceList]);

  const handleDateClick = (info) => {
    setSelectedDate(info.dateStr);
    setNewEvent({
      action: '',
      attendanceType: '',
      leaveType: '',
    });
    setOpenModal(true);
  };

  const handleDialogChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    console.log('Attendance list:', attendanceList);
    console.log('Mapped events:', events);
  }, [attendanceList, events]);

  const handleDialogAddEvent = async () => {
    if (newEvent.action === 'attendance' && !newEvent.attendanceType) {
      toast.error('Please select attendance type');
      return;
    }

    if (
      newEvent.action === 'leave' &&
      !newEvent.leaveType
    ) {
      toast.error('Please select leave type');
      return;
    }

    const attendanceData = {
      date: selectedDate,
      status:
        newEvent.action === 'attendance'
          ? newEvent.attendanceType
          : newEvent.leaveType,
      leaveType:
        newEvent.action === 'leave'
          ? newEvent.leaveType
          : null,
      isPaidLeave: true,
    };

    try {
      await dispatch(
        addAttendance({
          employeeId: selectedEmployee,
          attendanceData,
        })
      ).unwrap();

      setOpenModal(false);

      dispatch(
        fetchAttendance({
          employeeId: selectedEmployee,
          month: selectedMonth,
          year: selectedYear,
        })
      );
      toast.success('Attendance added successfully!');
    } catch (error) {
      console.error('Add attendance failed', error);
      toast.error('Failed to add attendance');
    }
  };

  return (
    <>
      <div className="hr-calendar-wrapper">
        <EventLegend />

        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          height="auto"
          contentHeight="auto"
          expandRows={false}
          dayMaxEvents={true}
          dateClick={handleDateClick}
          events={
            selectedEmployee
              ? events.filter((e) => e.employeeId === selectedEmployee)
              : events
          }
          eventContent={(eventInfo) => (
            <Tooltip title={eventInfo.event.title} arrow>
              <div
                className="calendar-event"
                style={{
                  backgroundColor:
                    eventInfo.event.backgroundColor || eventInfo.event.color,
                }}
              >
                {eventInfo.event.title}
              </div>
            </Tooltip>
          )}
        />
      </div>

      <AttendanceDialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        newEvent={newEvent}
        handleChange={handleDialogChange}
        handleAddEvent={handleDialogAddEvent}
      />
    </>
  );
};

export default HRCalendar;
