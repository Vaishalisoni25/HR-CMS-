'use client';

import DateRangePicker from "@/components/ui/DateRangePicker";
import { SearchInput } from "@/components/ui/SearchInput";
import { Button, Stack, TextField, Typography, MenuItem } from "@mui/material";
import { PlusIcon } from "@phosphor-icons/react";
import { useState, useRef, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployees } from "@/redux/store/employees/employeeThunk";
import SalaryTable from "@/components/dashboard/salary/SalaryTable";
import SalaryForm from "@/components/dashboard/salary/SalaryForm";
import { fetchSalaries, addSalary, fetchSalaryById, updateSalary, deleteSalary } from "@/redux/store/salaries/salaryThunk";
import CustomSnackbar from "@/components/ui/CustomSnackbar";
import ConfirmationDialog from "@/components/ui/ConfirmationDialog";

export default function SalaryPage() {
  const dispatch = useDispatch();
  const employees = useSelector((state) => state.employees.list || []);
  const loadingEmployees = useSelector((state) => state.employees.loading);

  const salaries = useSelector((state) => state.salaries.list || []);
  const loadingSalaries = useSelector((state) => state.salaries.loading);

  const [openAddModal, setOpenAddModal] = useState(false);

  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const [addingSalary, setAddingSalary] = useState(false);
  const [editSalaryId, setEditSalaryId] = useState(null);

  const editSalaryData = useMemo(() => {
    return salaries.find(s => s._id === editSalaryId);
  }, [editSalaryId, salaries]);

  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    row: null,
  });


  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchEmployees()).unwrap();
        await dispatch(fetchSalaries()).unwrap();
      } catch (err) {
        console.error("Error fetching data:", err);
        setSnackbar({
          open: true,
          message: err.message || "Failed to load employees or salaries",
          severity: "error",
        });
      }
    };
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    if (!loadingEmployees) {
      console.log("Employees from backend:", employees);
    }
  }, [employees, loadingEmployees]);

  const handleSubmitSalary = async (payload) => {
    const { employeeId, basicPay, startMonth, endMonth } = payload;

    if (!employeeId)
      return setSnackbar({ open: true, message: "Please select an employee", severity: "error" });

    if (!basicPay || basicPay <= 0)
      return setSnackbar({ open: true, message: "Please enter a valid salary", severity: "error" });

    if (!startMonth || !endMonth)
      return setSnackbar({ open: true, message: "Please select a valid date range", severity: "error" });

    if (addingSalary) return;

    setAddingSalary(true);

    try {
      const employee = employees.find(e => e._id === employeeId);
      if (!employee) throw new Error("Selected employee not found");

      const payloadWithName = {
        ...payload,
        employeeName: employee.name,
      };

      if (editSalaryId) {
        // UPDATE
        await dispatch(
          updateSalary({
            id: editSalaryId,
            data: payloadWithName,
          })
        ).unwrap();

        setSnackbar({
          open: true,
          message: "Salary updated successfully!",
          severity: "success",
        });
      } else {
        // ADD
        await dispatch(
          addSalary(payloadWithName)
        ).unwrap();

        setSnackbar({
          open: true,
          message: "Salary added successfully!",
          severity: "success",
        });
      }

      setOpenAddModal(false);
      setEditSalaryId(null);
      dispatch(fetchSalaries());
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || "Something went wrong",
        severity: "error",
      });
    } finally {
      setAddingSalary(false);
    }
  };

  const handleEditSalary = (row) => {
    setEditSalaryId(row._id);
    setOpenAddModal(true);
  };

  const handleDeleteSalary = (row) => {
    setConfirmDialog({ open: true, row });
  };
  const handleConfirmDelete = async () => {
    if (!confirmDialog.row?._id) return;

    try {
      const result = await dispatch(deleteSalary({ id: confirmDialog.row._id })).unwrap();
      console.log("Delete result:", result);

      setSnackbar({
        open: true,
        message: `Salary for ${confirmDialog.row.employeeName} deleted successfully!`,
        severity: "success",
      });

      dispatch(fetchSalaries());
    } catch (err) {
      console.error("Delete error:", err);
      setSnackbar({
        open: true,
        message: err.message || "Failed to delete salary",
        severity: "error",
      });
    } finally {
      setConfirmDialog({ open: false, row: null });
    }
  };

  const handleCloseSnackbar = () => setSnackbar(prev => ({ ...prev, open: false }));
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
            setEditSalaryId(null);
            setDateRange({ startDate: null, endDate: null });
            setOpenAddModal(true);
          }}
        >
          Add Salary
        </Button>
      </Stack>
      <SearchInput />
      <SalaryTable
        rows={salaries}
        employees={employees}
        loading={loadingSalaries}
        onEdit={handleEditSalary}
        onDelete={handleDeleteSalary}
      />

      <ConfirmationDialog
        open={confirmDialog.open}
        title="Delete Salary"
        message={`Are you sure you want to delete salary for ${confirmDialog.row?.employeeName}?`}
        onClose={(open) => setConfirmDialog(prev => ({ ...prev, open }))}
        onConfirm={handleConfirmDelete}
        confirmText="Delete"
        cancelText="Cancel"
      />

      <SalaryForm
        open={openAddModal}
        onClose={() => {
          setOpenAddModal(false);
          setEditSalaryId(null);
        }}
        onSubmit={handleSubmitSalary}
        employees={employees}
        loadingEmployees={loadingEmployees}
        dateRange={dateRange}
        setDateRange={setDateRange}
        submitting={addingSalary}
        initialData={editSalaryData}
        editSalaryId={editSalaryId}
      />

      <CustomSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={handleCloseSnackbar}
      />
    </Stack>
  );
}