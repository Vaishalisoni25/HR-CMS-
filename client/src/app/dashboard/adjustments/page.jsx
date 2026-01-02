'use client';

import React, { useState, useRef } from "react";
import { Stack, Typography, Button } from "@mui/material";
import { PlusIcon } from "@phosphor-icons/react";
import { SearchInput } from "@/components/ui/SearchInput";
import FormModal from "@/components/ui/FormModal";
import AdjustmentForm from "@/components/dashboard/adjustments/AdjustmentForm";
import AdjustmentTable from "@/components/dashboard/adjustments/AdjustmentTable";

export default function AdjustmentsPage() {
     const [openAddModal, setOpenAddModal] = useState(false);
     const formSubmitRef = useRef(null);

     const dummyEmployees = [
    { _id: "1", name: "John Doe" },
    { _id: "2", name: "Jane Smith" },
  ];

      const handleAddAdjustment = (data) => {
    console.log("Adjustment Submitted:", data);
    setOpenAddModal(false); // close modal after submission
    // TODO: send data to API or Redux store
  };

   return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Adjustments</Typography>
        </Stack>
        <Button
          variant="contained"
          startIcon={<PlusIcon />}
          onClick={() => setOpenAddModal(true)}
        >
          Add Adjustment
        </Button>
      </Stack>

      <SearchInput />

      <FormModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        title="Add Adjustment"
        submitText="Save"
        onSubmit={() => formSubmitRef.current?.()}
      >
        <AdjustmentForm
          employees={dummyEmployees}
          onSubmit={handleAddAdjustment}
          onFormSubmitRef={formSubmitRef}
        />
      </FormModal>

      <AdjustmentTable
      rows={[]}
      employees={[]}
      onEdit={() => {}}
      onDelete={() => {}}
    />
  </Stack>
  );
}