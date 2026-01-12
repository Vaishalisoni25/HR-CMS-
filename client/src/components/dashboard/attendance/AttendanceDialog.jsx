'use client';

import React from 'react';
import { Stack } from '@mui/material';
import EmptyDialog from '@/components/ui/EmptyDialog';
import CustomSelect from '@/components/ui/CustomSelect';
import CustomRadioGroup from '@/components/ui/CustomRadioGroup';
import CustomButton from '@/components/ui/CustomButton';

const AttendanceDialog = ({
  open,
  onClose,
  newEvent,
  handleChange,
  handleAddEvent,
}) => {
  return (
    <EmptyDialog
      open={open}
      onClose={onClose}
      title="Mark Attendance / Leave"
    >
      <Stack spacing={2.5}>
        <CustomSelect
          label="Action"
          name="action"
          value={newEvent.action}
          onChange={handleChange}
          options={[
            { label: 'Mark Attendance', value: 'attendance' },
            { label: 'Mark Leave', value: 'leave' },
          ]}
          helperTextMessage="Select whether to mark attendance or leave"
        />

        {newEvent.action === 'attendance' && (
          <CustomSelect
            label="Attendance Type"
            name="attendanceType"
            value={newEvent.attendanceType}
            onChange={handleChange}
            options={[
              { label: 'Attended', value: 'Attended' },
              { label: 'Absent', value: 'Absent' },
              { label: 'Work From Home', value: 'Work From Home' },
              { label: 'Half-day', value: 'Half-day' },
            ]}
            helperTextMessage="Choose the type of attendance"
          />
        )}

        {newEvent.action === 'leave' && (
          <>
            <CustomSelect
              label="Leave Type"
              name="leaveType"
              value={newEvent.leaveType}
              onChange={handleChange}
              options={[
                { label: 'Leave', value: 'Leave' },
                { label: 'Sick Leave', value: 'Sick Leave' },
              ]}
              helperTextMessage="Select type of leave"
            />

            <CustomRadioGroup
              label="Count this leave in leave policy?"
              name="countInPolicy"
              value={newEvent.countInPolicy}
              onChange={handleChange}
              options={[
                { label: 'Yes', value: 'yes' },
                { label: 'No', value: 'no' },
              ]}
              row
            />
          </>
        )}

        <Stack direction="row" justifyContent="flex-end" spacing={1.5} pt={1}>
          <CustomButton variant="outlined" onClick={onClose}>
            Cancel
          </CustomButton>

          <CustomButton variant="contained" onClick={handleAddEvent}>
            Submit
          </CustomButton>
        </Stack>
      </Stack>
    </EmptyDialog>
  );
};

export default AttendanceDialog;
