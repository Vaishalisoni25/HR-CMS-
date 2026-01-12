import createApiThunk from '../createApiThunk';

// Add attendance for a specific employee
export const addAttendance = createApiThunk(
  'attendance/addAttendance',
  ({ employeeId, attendanceData }) => ({
    url: `/attendance/${employeeId}`,  // employee ID in URL
    method: 'POST',
    data: attendanceData,
    successMessage: 'Attendance added successfully',
  })
);

export const fetchAttendance = createApiThunk(
  'attendance/fetchAttendance',
  ({ employeeId, attendanceData, month, year }) => ({
    url: `/attendance/${employeeId}?month=${month}&year=${year}`, // include query params
    method: 'GET',
    // data: attendanceData,
    successMessage: 'Attendance fetched successfully',
  })
);