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
import ConfirmationDialog from "@/components/ui/ConfirmationDialog";
import { showToast } from "@/utils/toast";
import { debounce, filter, find, get, includes, isEqual } from "lodash";

export default function SalaryPage() {
  const dispatch = useDispatch();
  const employees = useSelector((state) => state.employees?.list || []);
  const loadingEmployees = useSelector((state) => state.employees?.loading);

  const salaries = useSelector((state) => state.salaries?.list || []);
  const loadingSalaries = useSelector((state) => state.salaries?.loading);
  const [searchQuery, setSearchQuery] = useState("");

  const [openAddModal, setOpenAddModal] = useState(false);

  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });

  const [addingSalary, setAddingSalary] = useState(false);
  const [editSalaryId, setEditSalaryId] = useState(null);

  const editSalaryData = useMemo(() => {
    return salaries?.find(s => s?._id === editSalaryId);
  }, [editSalaryId, salaries]);

  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    row: null,
  });

  const handleSearchChange = useMemo(() =>
    debounce((value) => {
      setSearchQuery(value);
    }, 100),
    []
  );

  useEffect(() => {
    return () => handleSearchChange.cancel();
  }, [handleSearchChange]);

  const filteredSalaries = useMemo(() => {
    if (!searchQuery) return salaries;

    const query = searchQuery.toLowerCase();

    return filter(salaries, salary => {
      const employeeName = get(find(employees, { _id: salary.employeeId }), 'name', '').toLowerCase();
      return includes(employeeName, query) ||
        includes((salary.employeeName || '').toLowerCase(), query) ||
        includes((salary.description || '').toLowerCase(), query);
    });
  }, [searchQuery, salaries, employees]);

  // Fetch employees and salaries
  const fetchAllData = async () => {
    try {
      await Promise.all([
        dispatch(fetchEmployees()).unwrap(),
        dispatch(fetchSalaries()).unwrap(),
      ]);
    } catch (err) {
      console.error("Error fetching data:", err);
      showToast(err?.message || "Failed to load employees and salaries", "error");
    }
  };

  // Call fetch on component mount
  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    if (!loadingEmployees) {
      console.log("Employees from backend:", employees);
    }
  }, [employees, loadingEmployees]);

  const handleSubmitSalary = async (payload) => {
    const { employeeId, basicPay, startMonth, endMonth } = payload;

    if (addingSalary) return;

    setAddingSalary(true);

    try {
      const employee = employees?.find(e => e?._id === employeeId);
      if (!employee) throw new Error("Selected employee not found");

      const finalPayload = { ...payload, employeeName: employee.name };

      const action = editSalaryId
        ? updateSalary({ id: editSalaryId, data: finalPayload })
        : addSalary(finalPayload);

      await dispatch(action).unwrap();

      showToast(editSalaryId ? "Salary updated successfully!" : "Salary added successfully!", "success");

      setOpenAddModal(false);
      setEditSalaryId(null);
      dispatch(fetchSalaries());
    } catch (err) {
      showToast(err?.message || "Something went wrong", "error");
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
    if (!confirmDialog?.row?._id) return;

    try {
      const result = await dispatch(deleteSalary({ id: confirmDialog.row._id }))?.unwrap();
      console.log("Delete result:", result);
      showToast(`Salary for ${confirmDialog.row?.employeeName} deleted successfully!`, "success");

      dispatch(fetchSalaries());
    } catch (err) {
      console.error("Delete error:", err);
      showToast(err?.message || "Failed to delete salary", "error");
    } finally {
      setConfirmDialog({ open: false, row: null });
    }
  };

  const handleCloseSnackbar = () => setSnackbar(prev => ({ ...prev, open: false }));

  const handleOpenAddSalary = () => {
  setEditSalaryId(null);   // ensure add mode
  setOpenAddModal(true);  // open modal
};

  return (
    <Stack spacing={3}>
      <SalaryTable
        // rows={salaries}
        rows={filteredSalaries}
        employees={employees}
        loading={loadingSalaries}
        onEdit={handleEditSalary}
        onDelete={handleDeleteSalary}
        title="Salaries"
        showAddButton={true}
        showSearch={true}
        searchPlaceholder="Search by employee"
        onAddClick={handleOpenAddSalary}
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

    </Stack>
  );
}