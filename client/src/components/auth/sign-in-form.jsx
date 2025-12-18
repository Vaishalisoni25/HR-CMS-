'use client';

import * as React from 'react';
import axios from 'axios';
import RouterLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../../store/authSlice';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';


import {
  Alert,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  Stack,
  Snackbar,
  Typography,
  Link
} from '@mui/material';

import { EyeIcon, EyeSlashIcon } from '@phosphor-icons/react';

// Validation schema
const schema = zod.object({
  email: zod.string().email({ message: "Enter a valid email" }),
  password: zod.string().min(1, { message: "Password is required" })
});

export default function SignInForm() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState('');
const [openSnackbar, setOpenSnackbar] = React.useState(false);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const onSubmit = async (values) => {
    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:8000/api/auth/login",
        values
      );

      dispatch(loginSuccess(res.data.token));

       console.log("Token in Redux:", res.data.token);
    console.log("Token in localStorage:", localStorage.getItem('token'));


      // Show success message
    setSuccessMessage("Login successful!");
    setOpenSnackbar(true);

      setTimeout(() => {
      router.replace("/dashboard");
       }, 2000);

    } catch (err) {
      const message = err.response?.data?.message || "Login failed";
      setError("root", { type: "server", message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Stack spacing={4}>
      <Stack spacing={1}>
        <Typography variant="h4">Sign in</Typography>

        <Typography color="text.secondary" variant="body2">
          Don&apos;t have an account?{" "}
          <Link component={RouterLink} href="/auth/register" underline="hover">
            Sign up
          </Link>
        </Typography>
      </Stack>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>

          {/* Email */}
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <FormControl error={!!errors.email}>
                <InputLabel>Email</InputLabel>
                <OutlinedInput {...field} type="email" label="Email" />
                {errors.email && (
                  <FormHelperText>{errors.email.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />

          {/* Password */}
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <FormControl error={!!errors.password}>
                <InputLabel>Password</InputLabel>
                <OutlinedInput
                  {...field}
                  type={showPassword ? "text" : "password"}
                  label="Password"
                  endAdornment={
                    showPassword ? (
                      <EyeIcon cursor="pointer" onClick={() => setShowPassword(false)} />
                    ) : (
                      <EyeSlashIcon cursor="pointer" onClick={() => setShowPassword(true)} />
                    )
                  }
                />
                {errors.password && (
                  <FormHelperText>{errors.password.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />

          <Link component={RouterLink} href="/auth/reset-password" variant="subtitle2">
            Forgot password?
          </Link>

          {errors.root && <Alert severity="error">{errors.root.message}</Alert>}

          <Button disabled={loading} type="submit" variant="contained" size="large">
            {loading ? "Signing in..." : "Sign in"}
          </Button>

        </Stack>
      </form>
    </Stack>
    <Snackbar
  open={openSnackbar}
  autoHideDuration={3000} // message disappears after 3 seconds
  onClose={() => setOpenSnackbar(false)}
  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
>
  <Alert
    onClose={() => setOpenSnackbar(false)}
    severity="success"
    sx={{ width: '100%' }}
  >
    {successMessage}
  </Alert>
</Snackbar>
</>
  );
}
