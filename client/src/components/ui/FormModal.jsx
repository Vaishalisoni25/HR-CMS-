import React from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
} from "@mui/material";

/**
 * A reusable Form Modal component
 * Wraps any form content and provides submit/cancel buttons
 */
const FormModal = ({
  open,
  title = "Form",
  onClose,
  onSubmit,
  submitText = "Submit",
  cancelText = "Cancel",
  children,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2}>
            {children}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>{cancelText}</Button>
          <Button type="submit" variant="contained" color="primary">
            {submitText}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

FormModal.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  submitText: PropTypes.string,
  cancelText: PropTypes.string,
  children: PropTypes.node,
};

export default FormModal;
