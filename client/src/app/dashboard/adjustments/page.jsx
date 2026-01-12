'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Stack, Typography, Button } from "@mui/material";
import { PlusIcon } from "@phosphor-icons/react";
import { SearchInput } from "@/components/ui/SearchInput";
import FormModal from "@/components/ui/FormModal";
import { fetchEmployees } from "@/redux/store/employees/employeeThunk";
import AdjustmentForm from "@/components/dashboard/adjustments/AdjustmentForm";
import AdjustmentTable from "@/components/dashboard/adjustments/AdjustmentTable";
import { addAdjustment, fetchAdjustments, deleteAdjustment, updateAdjustment } from "@/redux/store/adjustments/adjustmentThunk";
import ConfirmationDialog from "@/components/ui/ConfirmationDialog";
import { toast } from 'react-toastify';
import { showToast } from "@/utils/toast";
import { filter, find, get, includes, debounce, isEqual } from "lodash";
import { CustomTable } from "@/components/ui/CustomTable";

const isAdjustmentUnchanged = (original, payload) => {
  if (!original) return false;

  const { image: origImage, ...originalData } = original;
  const { image: payloadImage, ...payloadData } = payload;

  const normalize = obj => ({
    ...obj,
    type: obj.type?.toUpperCase(),
    description: obj.description || "",
  });

  return isEqual(normalize(originalData), normalize(payloadData)) &&
    (!payloadImage || payloadImage === origImage);
};

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

  const getErrorMessage = (error) => {
    return (
      error?.response?.data?.message ||
      error?.message ||
      "Failed to load data"
    );
  };

  const formSubmitRef = useRef(null);

  const filteredAdjustments = useMemo(() => {
    if (!searchQuery) return adjustments;

    const query = searchQuery.toLowerCase();

    return filter(adjustments, adj => {
      const employeeName = get(find(employees, { _id: adj.employeeId }), "name", "").toLowerCase();
      return includes(employeeName, query) ||
        includes(adj.type.toLowerCase(), query) ||
        includes((adj.description || "").toLowerCase(), query);
    });
  }, [searchQuery, adjustments, employees]);

  const handleSearchChange = useCallback(
    debounce((value) => {
      setSearchQuery(value);
    }, 100),
    []
  );

  useEffect(() => {
    return () => {
      handleSearchChange.cancel();
    };
  }, [handleSearchChange]);

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


  const resetModal = useCallback(() => {
    setModalState({ open: false, isEditMode: false, editingAdjustment: null });
  }, []);

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
      return showToast("Please select an employee", "error");
    }

    setIsSubmitting(true);

    if (modalState.isEditMode && modalState.editingAdjustment?._id) {
      const original = modalState.editingAdjustment;

      if (isAdjustmentUnchanged(original, payload)) {
        setIsSubmitting(false);
        return showToast("No changes detected.", "info");
      }
    }

    const formData = prepareFormData(payload);

    try {
      if (modalState.isEditMode && modalState.editingAdjustment?._id) {
        await dispatch(
          updateAdjustment({ id: modalState.editingAdjustment._id, data: formData })
        ).unwrap();
        showToast("Adjustment updated successfully!", "success");

        await dispatch(fetchAdjustments()).unwrap();

        setModalState({
          open: false,
          isEditMode: false,
          editingAdjustment: null,
        });

        reset?.();
      } else {
        await dispatch(addAdjustment({ employeeId: payload.employeeId, formData })).unwrap();

        showToast("Adjustment created successfully!", "success");

        // Refresh adjustments 
        await dispatch(fetchAdjustments()).unwrap();

        resetModal();
        reset?.();
      }
    } catch (error) {
      console.error("Adjustment Error:", error);
      showToast(error?.message || "Something went wrong", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditAdjustment = (adjustment) => {
    setModalState({ open: true, isEditMode: true, editingAdjustment: adjustment });
  };

  const handleDeleteDialog = useCallback((id) => {
    setConfirmDeleteState({ open: true, adjustmentId: id });
  }, []);

  const handleConfirmDelete = async () => {
    if (isDeleting) return;
    const { adjustmentId } = confirmDeleteState;
    if (!adjustmentId) return;
    setIsDeleting(true);

    try {
      await dispatch(deleteAdjustment({ id: adjustmentId })).unwrap();
      dispatch(fetchAdjustments());
      showToast("Adjustment deleted successfully!", "success");
    } catch (error) {
      console.error("Failed to delete adjustment:", error);
      showToast(error?.message || "Failed to delete adjustment", "error");
    } finally {
      setIsDeleting(false);
      setConfirmDeleteState({ open: false, adjustmentId: null });
    }
  };

  const editingAdjustment = useMemo(() => {
    if (!modalState.editingAdjustment?._id) return modalState.editingAdjustment;

    return adjustments.find(a => a._id === modalState.editingAdjustment._id) || modalState.editingAdjustment;
  }, [modalState.editingAdjustment, adjustments]);

  const handleOpenModal = useCallback(() => {
    setModalState(prev => ({ ...prev, open: true }));
  }, []);

  return (
    <Stack spacing={3}>

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
          initialValues={editingAdjustment}
          isEditMode={modalState.isEditMode}
        />
      </FormModal>

      <AdjustmentTable
        rows={filteredAdjustments}
        employees={employees}
        onEdit={handleEditAdjustment}
        onDelete={handleDeleteDialog}
        title="Adjustments"
        showAddButton={true}
        onAddClick={handleOpenModal}
        showSearch={true}
        searchPlaceholder="Search adjustments..."
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