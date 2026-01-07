'use client';

import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Stack, Typography, Button, Snackbar } from "@mui/material";
import { PlusIcon } from "@phosphor-icons/react";
import { SearchInput } from "@/components/ui/SearchInput";
import FormModal from "@/components/ui/FormModal";
import { fetchEmployees } from "@/redux/store/employees/employeeThunk";
import AdjustmentForm from "@/components/dashboard/adjustments/AdjustmentForm";
import AdjustmentTable from "@/components/dashboard/adjustments/AdjustmentTable";
import { addAdjustment, fetchAdjustments, deleteAdjustment, updateAdjustment } from "@/redux/store/adjustments/adjustmentThunk";
import CustomSnackbar from "@/components/ui/CustomSnackbar";
import ConfirmationDialog from "@/components/ui/ConfirmationDialog";

export default function AdjustmentsPage() {
  const dispatch = useDispatch();
  const employees = useSelector((state) => state.employees.list);
  const adjustments = useSelector((state) => state.adjustments.list);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [modalState, setModalState] = useState({
    open: false,
    isEditMode: false,
    editingAdjustment: null,
  });
  const [confirmDeleteState, setConfirmDeleteState] = useState({
    open: false,
    adjustmentId: null,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const getErrorMessage = (error) => {
    return (
      error?.response?.data?.message ||
      error?.message ||
      "Failed to load data"
    );
  };

  const handleSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const formSubmitRef = useRef(null);
  const filteredAdjustments = React.useMemo(() => {
    if (!searchQuery) return adjustments;
    return adjustments.filter(adj => {
      const employeeName = employees.find(e => e._id === adj.employeeId)?.name || "";
      return (
        employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        adj.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (adj.description || "").toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [searchQuery, adjustments, employees]);

  const fetchInitialData = React.useCallback(async () => {
    try {
      await Promise.all([
        dispatch(fetchEmployees()).unwrap(),
        dispatch(fetchAdjustments()).unwrap(),
      ]);
    } catch (error) {
      handleSnackbar(getErrorMessage(error), "error");
    }
  }, [dispatch]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);


  const resetModal = () => {
    setModalState({ open: false, isEditMode: false, editingAdjustment: null });
  };

  const prepareFormData = (payload) => {
    const formData = new FormData();
    formData.append("employeeId", payload.employeeId);
    formData.append("month", payload.month);
    formData.append("year", payload.year);
    formData.append("type", payload.type.toUpperCase());
    formData.append("amount", payload.amount);
    formData.append("description", payload.description || "");

    if (payload.image instanceof File) formData.append("image", payload.image);

    return formData;
  };

  const handleAddOrUpdateAdjustment = async (payload, reset) => {
    if (isSubmitting) return;
    if (!payload.employeeId) {
      return handleSnackbar("Please select an employee", "error");
    }

    setIsSubmitting(true);

    if (modalState.isEditMode && modalState.editingAdjustment?._id) {
      const original = modalState.editingAdjustment;

      // Compare field by field
      const isUnchanged =
        original.employeeId === payload.employeeId &&
        original.month === payload.month &&
        original.year === payload.year &&
        original.type.toUpperCase() === payload.type.toUpperCase() &&
        original.amount === payload.amount &&
        (original.description || "") === (payload.description || "") &&
        (!payload.image || payload.image === original.image);

      if (isUnchanged) {
        return handleSnackbar("No changes detected.", "info"); // Early exit
      }
    } 

    const formData = prepareFormData(payload);

    try {
      if (modalState.isEditMode && modalState.editingAdjustment?._id) {
        // Update the adjustment
        await dispatch(
          updateAdjustment({ id: modalState.editingAdjustment._id, data: formData })
        ).unwrap();

        handleSnackbar("Adjustment updated successfully!");

        await dispatch(fetchAdjustments()).unwrap();


        setModalState({
          open: false,
          isEditMode: false,
          editingAdjustment: null,
        });

        reset?.();
      } else {
        // Add new adjustment
        await dispatch(addAdjustment({ employeeId: payload.employeeId, formData })).unwrap();

        handleSnackbar("Adjustment created successfully!");

        // Refresh adjustments 
        await dispatch(fetchAdjustments()).unwrap();

        resetModal();
        reset?.();
      }
    } catch (error) {
      console.error("Adjustment Error:", error);
      handleSnackbar(error?.message || "Something went wrong", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditAdjustment = (adjustment) => {
    setModalState({ open: true, isEditMode: true, editingAdjustment: adjustment });
  };

  const handleDeleteDialog = (id) => {
    setConfirmDeleteState({ open: true, adjustmentId: id });
  };

  const handleConfirmDelete = async () => {
    if (isDeleting) return;
    const { adjustmentId } = confirmDeleteState;
    if (!adjustmentId) return;
    setIsDeleting(true);

    try {
      await dispatch(deleteAdjustment({ id: adjustmentId })).unwrap();
      dispatch(fetchAdjustments());
      handleSnackbar("Adjustment deleted successfully!");
    } catch (error) {
      console.error("Failed to delete adjustment:", error);
      handleSnackbar(error?.message || "Failed to delete adjustment", "error");
    } finally {
      setIsDeleting(false);
      setConfirmDeleteState({ open: false, adjustmentId: null });
    }
  };

  return (
    <Stack spacing={3}>

      <Stack direction="row" spacing={3} alignItems="center">
        <Typography variant="h4" sx={{ flex: 1 }}>Adjustments</Typography>
        <Button
          variant="contained"
          startIcon={<PlusIcon />}
          onClick={() => setModalState({ ...modalState, open: true })}
        >
          Add Adjustment
        </Button>
      </Stack>

      <SearchInput
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <FormModal
        open={modalState.open}
        onClose={resetModal}
        title={modalState.isEditMode ? "Edit Adjustment" : "Add Adjustment"}
        submitText={modalState.isEditMode ? "Update" : "Save"}
        onSubmit={() => formSubmitRef.current?.()}
        isSubmitting={isSubmitting}
      >
        <AdjustmentForm
          employees={employees}
          onSubmit={handleAddOrUpdateAdjustment}
          onFormSubmitRef={formSubmitRef}
          initialValues={
            adjustments.find(a => a._id === modalState.editingAdjustment?._id) || modalState.editingAdjustment
          }
          isEditMode={modalState.isEditMode}
        />
      </FormModal>

      <AdjustmentTable
        rows={filteredAdjustments}
        employees={employees}
        onEdit={handleEditAdjustment}
        onDelete={handleDeleteDialog}
      />

      <CustomSnackbar
        message={snackbar.message}
        severity={snackbar.severity}
        open={snackbar.open}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />

      <ConfirmationDialog
        open={confirmDeleteState.open}
        title="Delete Adjustment"
        message="Are you sure you want to delete this adjustment?"
        onClose={() => setConfirmDeleteState({ ...confirmDeleteState, open: false })}
        onConfirm={handleConfirmDelete}
        confirmText="Delete"
        cancelText="Cancel"
        isDeleting={isDeleting}
      />
    </Stack>
  );
}