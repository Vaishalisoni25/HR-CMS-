'use client';

import React from "react";
import { Stack, Typography, Box, Divider } from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import BadgeIcon from '@mui/icons-material/Badge';
import WorkIcon from '@mui/icons-material/Work';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';

export default function EmployeeDetailsCard({ employee, onBack }) {
  if (!employee) return null;

  const details = [
    {
      label: "Employee Name",
      value: employee.name,
      icon: <AccountCircleIcon fontSize="large" />,
    },
    {
      label: "Position",
      value: employee.position,
      icon: <WorkIcon fontSize="large" />,
    },
    {
      label: "Employee Code",
      value: employee.EmployeeCode,
      icon: <BadgeIcon fontSize="large" />,
    },
    {
      label: "Salary",
      value: `₹${employee.basicPay}`,
      icon: <AttachMoneyIcon fontSize="large" />,
    },
  ];

  return (
    <Stack
      spacing={4}
      mt={3} 
      direction="row"    
      flexWrap="wrap"
      alignItems="center"
      sx={{
        bgcolor: (theme) =>
          theme.palette.mode === "light" ? "#F9FAFB" : "background.paper",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        px: 3,
        py: 2.5,
      }}
    >
      {details.map((detail, index) => (
        <React.Fragment key={index}>

          <Stack direction="row" spacing={2} alignItems="center">

            <Box
              sx={{
                color: "primary.main",
                "& svg": { fontSize: 32 },
              }}
            >
              {detail.icon}
            </Box>

            <Stack>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontWeight: 500 }}
              >
                {detail.label}
              </Typography>

              <Typography
                fontWeight={700}
                sx={{ lineHeight: 1.2 }}
              >
                {detail.value}
              </Typography>
            </Stack>

          </Stack>

          {index !== details.length - 1 && (
            <Divider
              orientation="vertical"
              flexItem
              sx={{ mx: 2, display: { xs: "none", md: "block" } }}
            />
          )}
        </React.Fragment>
      ))}
       <Box sx={{ flexGrow: 1 }} />

      {/* Back Button */}
      <IconButton
        onClick={onBack}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
        }}
      >
         <CloseIcon fontSize="small" />
      </IconButton>
    </Stack>
    
  );
}
