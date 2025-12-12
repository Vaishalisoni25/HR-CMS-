'use client';

import React, { useState, useMemo } from 'react';
import CustomTextField from '@/components/ui/CustomTextField';
import CustomButton from '@/components/ui/CustomButton';
import CustomSelect from '@/components/ui/CustomSelect';
import CustomCheckbox from '@/components/ui/CutsomCheckbox';
import CustomRadioGroup from '@/components/ui/CustomRadioGroup';
import CustomSwitch from '@/components/ui/CustomSwitch';
import CustomModal from '@/components/ui/CustomModal';
import CustomSnackbar from '@/components/ui/CustomSnackbar';
// import CustomTable from '@/components/ui/CustomTable';
import DateRangePicker from '@/components/ui/DateRangePicker';
import CustomDatePicker from '@/components/ui/CustomDatePicker';
import { Box } from '@mui/material';
import { CustomTable } from '@/components/ui/CustomTable';
import CustomSearchBar from '@/components/ui/CustomSearchBar'
import CustomForm from '@/components/ui/CustomForm';
import CustomCalendar from '@/components/ui/CustomCalendar';
import HRCalendar from '@/components/ui/HrCalendar';
 


export default function ComponentsDemoPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [birthDate, setBirthDate] = useState(null);
const [startDate, setStartDate] = useState(null);
const [endDate, setEndDate] = useState(null);
const [query, setQuery] = useState("");

  const rows = [
    { id: 1, name: "John Doe", age: 30 },
    { id: 2, name: "Jane Smith", age: 25 },
    { id: 3, name: "Michael", age: 28 },
  ];

  // 🟦 Step 2: Filter rows based on search text
  const filteredRows = useMemo(() => {
    if (!query.trim()) return rows;

    return rows.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(query.toLowerCase())
      )
    );
  }, [query, rows]);

  return (
    <>
    <div style={{ padding: '20px', display: 'grid', gap: '20px',  maxWidth: '500px', margin: '0 auto', justifyItems: 'start' }}>
      <h1>Components Demo</h1>

      <CustomTextField label="Name" helperTextMessage="Enter your name" />
      <CustomSelect
        label="Role"
        options={[
          { value: 'admin', label: 'Admin' },
          { value: 'user', label: 'User' },
        ]}
      />
      <CustomCheckbox label="I agree to terms" />
      <CustomRadioGroup
        label="Choose role"
        options={[
          { value: 'admin', label: 'Admin' },
          { value: 'user', label: 'User' },
        ]}
      />
      <CustomSwitch label="Enable notifications" />
      <CustomButton color="info" onClick={() => setModalOpen(true)}>Open Modal</CustomButton>
      <CustomButton color="success" onClick={() => setSnackbarOpen(true)}>Show Snackbar</CustomButton>
      <CustomButton>Click Me</CustomButton>

      <CustomModal
        open={modalOpen}
        title="Demo Modal"
        onClose={() => setModalOpen(false)}
        actions={[ { label: "Submit", onClick: () => formRef.current.submit() }, { label: 'Close', onClick: () => setModalOpen(false) }]}
      >
        <p>This is modal content.</p>
        <CustomForm
    initialValues={{ name: "", email: "" }}
    onSubmit={(data) => {
      console.log("Form submitted:", data);
      setModalOpen(false);
    }}
    layout="grid"
    columns={2}
  >
    <CustomTextField
      name="name"
      label="Name"
    variant="outlined"
      validate={(v) => (!v ? "Name is required" : "")}
    />

    <CustomTextField
      name="email"
      label="Email"
    variant="outlined"
      validate={(v) => (!v ? "Email is required" : "")}
    />
  </CustomForm>
      </CustomModal>

      <CustomSnackbar
        message="Operation successful!"
        severity="success"
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
      />

      {/* <CustomTable
        columns={[
          { label: 'Name', field: 'name' },
          { label: 'Age', field: 'age' },
        ]}
        rows={[
          { name: 'John', age: 30 },
          { name: 'Jane', age: 25 },
        ]}
      /> */}
      <div style={{ padding: 20 }}>
      <CustomSearchBar value={query} onChange={(e) => setQuery(e.target.value)} />
      <CustomTable
  columns={[
    { key: "name", label: "Name" },
    { key: "age", label: "Age" }
  ]}
  // rows={[
  //   { id: 1, name: "John Doe", age: 30 },
  //   { id: 2, name: "Jane Smith", age: 25 },
  //   { id: 3, name: "Michael", age: 28 },
  // ]}
   rows={filteredRows}
        count={filteredRows.length}
  count={3}
  page={0}
  rowsPerPage={5}
/>
</div>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <CustomDatePicker
          label="Birth Date"
          value={birthDate}
          onChange={(date) => setBirthDate(date)}
        />
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onChange={(start, end) => {
            setStartDate(start);
            setEndDate(end);
          }}
        />
      </Box>
      </div>
      <div style={{width:900, height: 900,  marginLeft:350, marginBottom:180}}>
      <h1>HR Portal Calendar</h1>
      <CustomCalendar />
    </div>
    <div style={{ padding: '20px', width:1100, marginLeft:360 }}>
      <h2>HR Calendar</h2>
      <HRCalendar />
    </div>
      </>
  );
}
