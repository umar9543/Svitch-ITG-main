'use client';

import * as Yup from 'yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter, useSearchParams } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { useAuthContext } from 'src/auth/hooks';
import { PATH_AFTER_LOGIN } from 'src/config-global';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { Get } from 'src/utils/AxiosHelper';
import { encrypt } from 'src/api/encryption';
// import { Get } from '';
// import { encrypt } from 'src/api/encryption';

// ----------------------------------------------------------------------

export default function JwtLoginView() {
  const router = useRouter();

  const [errorMsg, setErrorMsg] = useState('');

  const searchParams = useSearchParams();

  const returnTo = searchParams.get('returnTo');

  const password = useBoolean();

  const LoginSchema = Yup.object().shape({
    userCode: Yup.string().required('User Code is required'),
    password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    userCode: '',
    password: '',
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = methods;

  const userCode = watch('userCode');
  const passwordValue = watch('password');

  const onSubmit = async (data) => {
    try {
      const encryptedUserCode = encodeURIComponent(encrypt(data.userCode));
      const encryptedPassword = encodeURIComponent(encrypt(data.password));

      const response = await Get(
        `GetLoginInfo?UserCode=${encryptedUserCode}&Password=${encryptedPassword}&AgencyName=0BXqDHHObVLm5m4fbTni8A==`
      );

      if (response.data.ResponseCode === '100') {
        // console.log('response.data.ServiceRes', response.data.ServiceRes);
        localStorage.setItem('UserData', JSON.stringify(response.data.ServiceRes));
        router.push(returnTo || PATH_AFTER_LOGIN);
      } else {
        setErrorMsg('Incorrect User Code or Password');
      }
    } catch (error) {
      setErrorMsg('An error occurred. Please try again.');
      console.log(error);
      reset();
    }
  };

  const renderHead = (
    <Stack spacing={2} sx={{ mb: 5 }}>
      <Typography variant="h4">Sign in to Svitch</Typography>
    </Stack>
  );

  const renderForm = (
    <Stack spacing={2.5}>
      <RHFTextField
        InputLabelProps={{
          shrink: true,
        }}
        name="userCode"
        label="User Code"
        value={userCode}
        onChange={(e) => setValue('userCode', e.target.value)}
      />

      <RHFTextField
        name="password"
        label="Password"
        value={passwordValue}
        InputLabelProps={{
          shrink: true,
        }}
        type={password.value ? 'text' : 'password'}
        onChange={(e) => setValue('password', e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={password.onToggle} edge="end">
                <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        Login
      </LoadingButton>
    </Stack>
  );

  return (
    <>
      {renderHead}

      {!!errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}

      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        {renderForm}
      </FormProvider>
    </>
  );
}
