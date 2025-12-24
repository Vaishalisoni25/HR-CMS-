import React from 'react';
import { TextField, Grid, MenuItem, InputAdornment, RadioGroup, FormControlLabel, Radio, FormControl, FormLabel, Box, IconButton } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import WorkIcon from '@mui/icons-material/Work';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CustomDatePicker from '@/components/ui/CustomDatePicker';
import CustomSelect from '@/components/ui/CustomSelect';
import { minHeight } from '@mui/system';
import CustomRadioGroup from '@/components/ui/CustomRadioGroup';
import LockIcon from '@mui/icons-material/Lock';
import BadgeIcon from '@mui/icons-material/Badge';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useState } from 'react';
import './employeeCss.scss';

export default function AddEmployeeForm({ values, onChange, onDateChange, errors }) {
    console.log('AddEmployeeForm values:', values);
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword((prev) => !prev);
    const handleMouseDownPassword = (event) => event.preventDefault();
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
                    error={!!errors?.name}
                    helperText={errors?.name}
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
                    error={!!errors?.email}
                    helperText={errors?.email}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <EmailIcon />
                            </InputAdornment>
                        ),
                    }}
                />
            </Grid>

            {/* Row 2: Phone & Password */}
            <Grid item xs={12} sm={6}>
                <TextField
                    label="Phone"
                    name="phone"
                    value={values.phone}
                    onChange={onChange}
                    size='small'
                    fullWidth
                    error={!!errors?.phone}
                    helperText={errors?.phone}
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
                    label="Password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={values.password}
                    onChange={onChange}
                    size="small"
                    fullWidth
                    error={!!errors?.password}
                    helperText={errors?.password}
                    InputProps={{
                        startAdornment: !values.password && (
                            <InputAdornment position="start">
                                <LockIcon />
                            </InputAdornment>
                        ),
                        endAdornment: values.password ? (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                    size="small"
                                >
                                    {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                </IconButton>
                            </InputAdornment>
                        ) : null,
                    }}
                />
            </Grid>

            {/* Row 3: Position & Salary */}
            <Grid item xs={12} sm={6} sx={{ minWidth: 274 }}>
                <CustomSelect
                    label="Position"
                    name="position"
                    value={values.position}
                    onChange={onChange}
                    size="small"
                    fullWidth
                    error={!!errors?.position}
                    helperText={errors?.position}
                    options={[
                        { label: 'Select Position', value: '', disabled: true },
                        { label: 'Software Engineer', value: 'SOFTWARE_ENGINEER' },
                        { label: 'Frontend Developer', value: 'FRONTEND_DEVELOPER' },
                        { label: 'Backend Developer', value: 'BACKEND_DEVELOPER' },
                        { label: 'HR Manager', value: 'HR_MANAGER' },
                        { label: 'Project Manager', value: 'PROJECT_MANAGER' },
                        { label: 'Software Tester', value: 'SOFTWARE_TSETER' },
                    ]}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    label="Employee Code"
                    name="employeeCode"
                    value={values.employeeCode}
                    onChange={onChange}
                    size="small"
                    fullWidth
                    error={!!errors?.employeeCode}
                    helperText={errors?.employeeCode}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <BadgeIcon />
                            </InputAdornment>
                        ),
                    }}
                />
            </Grid>

            {/* Row 4: Employment Type & Joining Date */}
            <Grid item xs={12} sm={6} sx={{ minWidth: 274 }}>
                <CustomSelect
                    label="Employment Type"
                    name="employmentType"
                    value={values.employmentType}
                    onChange={onChange}
                    size='small'
                    fullWidth
                    error={!!errors?.employmentType}
                    helperText={errors?.employmentType}
                    options={[
                        { label: 'Select Employment Type', value: '', disabled: true },
                        { label: 'Full-Time', value: 'FULL_TIME' },
                        { label: 'Part-Time', value: 'PART_TIME' },
                        { label: 'Intern', value: 'INTERN' },
                    ]}
                />
            </Grid>
            <Grid item xs={12} sm={6} sx={{ minWidth: 274 }}>
                <CustomDatePicker
                    label="Joining Date"
                    value={values.joiningDate}
                    fullWidth
                    error={!!errors?.joiningDate}
                    helperText={errors?.joiningDate}
                    onChange={(newValue) =>
                        onDateChange('joiningDate', newValue)
                    }
                />
            </Grid>

            <Grid item xs={12} sm={6}>
                <FormControl
                    error={!!errors?.status}
                    fullWidth
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <FormLabel sx={{ mb: 0.5, fontSize: 13 }}>Status</FormLabel>
                    <RadioGroup
                        row
                        name="status"
                        value={values.status}
                        onChange={onChange}
                        sx={{ alignItems: 'center' }}
                    >
                        <FormControlLabel value="Active" control={<Radio size="small" />} label="Active" />
                        <FormControlLabel value="Inactive" control={<Radio size="small" />} label="Inactive" />
                    </RadioGroup>
                    {errors?.status && (
                        <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5 }}>
                            {errors.status}
                        </Box>
                    )}
                </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
                <FormControl
                    error={!!errors?.tax}
                    fullWidth
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <FormLabel sx={{ mb: 0.5, fontSize: 13 }}>Tax</FormLabel>
                    <RadioGroup
                        row
                        name="tax"
                        value={values.tax}
                        onChange={onChange}
                        sx={{ alignItems: 'center' }}
                    >
                        <FormControlLabel value="PF" control={<Radio size="small" />} label="PF" />
                        <FormControlLabel value="TDS" control={<Radio size="small" />} label="TDS" />
                    </RadioGroup>
                    {errors?.tax && (
                        <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5 }}>
                            {errors.tax}
                        </Box>
                    )}
                </FormControl>
            </Grid>

        </Grid>
    );
}
