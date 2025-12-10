'use client';

import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CustomButton from './CustomButton';

const CustomModal = ({ open, onClose, title, children, actions = [] }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      {title && <DialogTitle>{title}</DialogTitle>}
      <DialogContent>{children}</DialogContent>
      {actions.length > 0 && (
        <DialogActions>
          {actions.map((action, index) => (
            <CustomButton key={index} {...action}>
              {action.label}
            </CustomButton>
          ))}
        </DialogActions>
      )}
    </Dialog>
  );
};

export default CustomModal;
