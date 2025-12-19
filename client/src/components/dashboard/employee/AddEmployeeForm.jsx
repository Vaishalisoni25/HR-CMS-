import React from 'react';
import { TextField, Grid, MenuItem, InputAdornment, RadioGroup, FormControlLabel, Radio, FormControl, FormLabel, Box } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import WorkIcon from '@mui/icons-material/Work';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CustomDatePicker from '@/components/ui/CustomDatePicker';
import CustomSelect from '@/components/ui/CustomSelect';
import { minHeight } from '@mui/system';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import CustomRadioGroup from '@/components/ui/CustomRadioGroup';

export default function AddEmployeeForm({ values, onChange, onDateChange }) {
    return (
        <Grid container spacing={4} justifyContent={'space-around'}>
            {/* Row 1: Name & Email */}
            <Grid item xs={12} sm={6}>
                <TextField
                    label="Name"
                    name="name"
                    value={values.name}
                    onChange={onChange}
                    size='small'
                    fullWidth
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <PersonIcon />
                            </InputAdornment>
                        ),
                    }}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    label="Email"
                    name="email"
                    value={values.email}
                    onChange={onChange}
                    size='small'
                    fullWidth
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <EmailIcon />
                            </InputAdornment>
                        ),
                    }}
                />
            </Grid>

            {/* Row 2: Phone & Position */}
            <Grid item xs={12} sm={6}>
                <TextField
                    label="Phone"
                    name="phone"
                    value={values.phone}
                    onChange={onChange}
                    size='small'
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <PhoneIcon />
                            </InputAdornment>
                        ),
                    }}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    label="Position"
                    name="position"
                    value={values.position}
                    onChange={onChange}
                    size='small'
                    fullWidth
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <WorkIcon />
                            </InputAdornment>
                        ),
                    }}
                />
            </Grid>

            {/* Row 3: Employment Type & Joining Date */}
            <Grid item xs={12} sm={6} sx={{ minWidth: 274 }}>
                <CustomSelect
                    label="Employment Type"
                    name="employmentType"
                    value={values.employmentType}
                    onChange={onChange}
                    size='small'
                    fullWidth
                    options={[
                        { label: 'Select Employment Type', value: '', disabled: true },
                        { label: 'Full-Time', value: 'Full-Time' },
                        { label: 'Part-Time', value: 'Part-Time' },
                        { label: 'Intern', value: 'Intern' },
                    ]}
                />
            </Grid>
            <Grid item xs={12} sm={6} sx={{ minWidth: 274 }}>
                <CustomDatePicker
                    label="Joining Date"
                    value={values.joiningDate}
                    fullWidth
                    onChange={(newValue) =>
                        onDateChange('joiningDate', newValue)
                    }
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                {/* <Box sx={{display: 'flex', alignItems: 'center', height: '100%'}}> */}
                <CustomRadioGroup
                    label="Status"
                    name="status"
                    value={values.status}
                    onChange={onChange}
                    size="small"
                    fullWidth
                    options={[
                        { label: 'Active', value: 'Active' },
                        { label: 'Inactive', value: 'Inactive' },
                    ]}
                />
                {/* </Box> */}
            </Grid>
            {/* Row 4: Salary & Status */}
            <Grid item xs={12} sm={6} sx={{ ml: 11 }} >
                <TextField
                    label="Salary"
                    name="salary"
                    type="number"
                    value={values.salary}
                    onChange={onChange}
                    size="small"
                    fullWidth
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                < CurrencyRupeeIcon />
                            </InputAdornment>
                        ),
                        onWheel: (e) => e.target.blur(),
                    }}
                    sx={{
                        // Chrome, Safari, Edge
                        '& input[type=number]::-webkit-outer-spin-button': {
                            WebkitAppearance: 'none',
                            margin: 0,
                        },
                        '& input[type=number]::-webkit-inner-spin-button': {
                            WebkitAppearance: 'none',
                            margin: 0,
                        },
                        // Firefox
                        '& input[type=number]': {
                            MozAppearance: 'textfield',
                        },
                    }}
                />
            </Grid>


        </Grid>
    );
}
