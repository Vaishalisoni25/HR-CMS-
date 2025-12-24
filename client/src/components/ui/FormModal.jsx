import React from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Grid,
} from "@mui/material";
import styles from "./styles.scss";

const FormModal = ({
  open,
  title = "Form",
  subtitle,
  icon,
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
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" className="my-dialog">
      <DialogTitle className="my-dialog-title">
        <Box display="flex" flexDirection="column" alignItems="flex-start" gap={1}>
          <Box display="flex" alignItems="center" gap={1}>
            {icon}
            <Typography fontWeight={700} fontSize="1.75rem">
              {title}
            </Typography>
          </Box>
          {subtitle && (
          <Typography fontSize="0.875rem" color="text.secondary">
            {subtitle}
          </Typography>
           )}
        </Box>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent className="my-dialog-content">
          <Grid container spacing={2} className="form-grid">
            {children}
          </Grid>
        </DialogContent>
        <DialogActions className="my-dialog-actions">
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
  subtitle: PropTypes.string,
  icon: PropTypes.node,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  submitText: PropTypes.string,
  cancelText: PropTypes.string,
  children: PropTypes.node,
};

export default FormModal;
