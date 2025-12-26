'use client';

import CustomForm from "@/components/ui/CustomForm";
import CustomModal from "@/components/ui/CustomModal";
import DateRangePicker from "@/components/ui/DateRangePicker";
import { SearchInput } from "@/components/ui/SearchInput";
import { Button, Stack, TextField, Typography, MenuItem } from "@mui/material";
import { PlusIcon } from "@phosphor-icons/react";
import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployees } from "@/redux/store/employees/employeeThunk";
import { Height } from "@mui/icons-material";
import { height, maxHeight } from "@mui/system";
import SalaryTable from "../../../components/dashboard/salary/SalaryTable";
import SalaryForm from "@/components/dashboard/salary/SalaryForm";

export default function SalaryPage() {
  const dispatch = useDispatch();
  const employees = useSelector((state) => state.employees.list);
  const loadingEmployees = useSelector((state) => state.employees.loading);

  const [openAddModal, setOpenAddModal] = useState(false);
  const formRef = useRef(null);

  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });

  // Fetch employees on mount
  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  // Example rows
  const rows = [
    { id: '1', employeeName: 'John Doe', startMonth: 'Jan 2025', endMonth: 'Dec 2025', salary: '5000' },
    { id: '2', employeeName: 'Jane Smith', startMonth: 'Feb 2025', endMonth: 'Nov 2025', salary: '4500' },
    { id: '3', employeeName: 'Alice Johnson', startMonth: 'Mar 2025', endMonth: 'Oct 2025', salary: '6000' },
  ];

  const handleAddSalary = (data) => {
    console.log("New salary added:", data);
    setOpenAddModal(false);
    // Optionally update rows state here
  };
  const handleEditSalary = (row) => {
    console.log('Edit salary:', row);
    // later: set selected salary + open modal
  };

  const handleDeleteSalary = (row) => {
    console.log('Delete salary:', row);
    // later: open confirm dialog or dispatch delete
  };
  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Salaries</Typography>
        </Stack>
        <Button
          variant="contained"
          startIcon={<PlusIcon />}
          onClick={() => {
            formRef.current?.resetForm();
            setDateRange({ startDate: null, endDate: null });
            setOpenAddModal(true);
          }}
        >
          Add Salary
        </Button>
      </Stack>
      <SearchInput />
      <SalaryTable
        rows={rows}
        onEdit={handleEditSalary}
        onDelete={handleDeleteSalary}
      />
      <CustomModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        title="Add Salary"
        actions={[]}
        PaperProps={{
          sx: { width: '500px', maxWidth: '90vw', height: '350px', maxHeight: '90vh' },
        }}
      >
        <SalaryForm
          formRef={formRef}
          initialValues={{ employeeName: "", salary: "" }}
          onSubmit={handleAddSalary}
          employees={employees}
          loadingEmployees={loadingEmployees}
          dateRange={dateRange}
          setDateRange={setDateRange}
        />
      </CustomModal>
    </Stack>
  );
}