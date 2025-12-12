import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Box, Typography, Stack, Chip } from '@mui/material';
import './styles.scss';

const events = [
  { title: 'Present', date: '2025-12-09', className: 'present-event' },
  { title: 'Team Meeting', date: '2025-12-09', className: 'meeting-event' },
  { title: 'Team Meeting', date: '2025-12-09', className: 'meeting-event' },
  { title: 'Team Meeting', date: '2025-12-09', className: 'meeting-event' },
  { title: 'Team Meeting', date: '2025-12-09', className: 'meeting-event' },
  { title: 'Holiday', date: '2025-12-10', className: 'holiday-event' },
  { title: 'Work From Home hdfjdgjghk', date: '2025-12-11', className: 'wfh-event' },
  { title: 'Absent', date: '2025-12-12', className: 'absent-event' },
];

export default function CustomCalendar() {
  const renderEventContent = (eventInfo) => {
    return (
      <div className="event-chip">
        {eventInfo.event.title}
      </div>
    );
  };

  return (
    <Box>
      {/* Legend */}
      <Stack direction="row" spacing={1} mb={2}>
        <Chip label="Present" className="legend-chip present" />
        <Chip label="Holiday" className="legend-chip holiday" />
        <Chip label="WFH" className="legend-chip wfh" />
        <Chip label="Absent" className="legend-chip absent" />
      </Stack>

      {/* Calendar */}
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        eventContent={renderEventContent}
        height="auto"
        editable={true}          // allows drag & drop
      selectable={true}        // allows selecting date ranges
        eventClick={(info) => alert(`Event: ${info.event.title}`)}
        dayMaxEvents={1}          // show 3 events, collapse rest
  moreLinkContent={(args) => `+${args.num} more`} // customize "+x more" text
      />
    </Box>
  );
}
