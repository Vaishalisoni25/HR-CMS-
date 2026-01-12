'use client';

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Stack,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const EmptyDialog = ({
  open,
  onClose,
  title,
  maxWidth = 'sm',
  fullWidth = true,
  sx = {},            
  children,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      sx={sx}
    >  
      {title && (
        <DialogTitle>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            {title}

            <IconButton size="small" onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
      )}

      <DialogContent>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default EmptyDialog;
