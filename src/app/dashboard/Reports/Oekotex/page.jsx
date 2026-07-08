'use client';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import {
  Button,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import { Box, Container } from '@mui/system';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm, FormProvider } from 'react-hook-form';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import { RHFAutocomplete } from 'src/components/hook-form';
import { useSettingsContext } from 'src/components/settings';
import { paths } from 'src/routes/paths';
import { Get } from 'src/utils/AxiosHelper';
import { decryptObjectKeys } from 'src/utils/getDecryption';
import { getDecryptedUserData, getUserData } from 'src/utils/getUser';
import LoadingButton from '@mui/lab/LoadingButton';

const page = () => {
  const settings = useSettingsContext();
  const [Country, setCountry] = useState([]);
  //   const userID = getDecryptedUserData() ? getDecryptedUserData()[0].UserID : 86;
  //   console.log(getDecryptedUserData()[0]);
  const NewSchema = Yup.object().shape({
    Country: Yup.string().required('Country is required'),
    ReportType: Yup.string().required('Report Type is required'),
  });

  const GetCountry = async () => {
    try {
      const res = await Get(`GetCountry?UserID=225`);
      if (res.data.ResponseCode === '100') {
        const decryptedData = decryptObjectKeys(res.data.ServiceRes);
        setCountry(decryptedData);
      } else if (res.data.ResponseCode === '-2') {
        console.log('error in getting country by id', res.data.ServiceRes);
      }
    } catch (error) {
      console.log('error getting country by ID', error);
    }
  };

  useEffect(() => {
    GetCountry();
  }, []);

  const defaultValues = useMemo(
    () => ({
      Country: '',
    }),
    []
  );

  const methods = useForm({
    resolver: yupResolver(NewSchema),
    defaultValues,
  });

  const {
    reset,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    reset(defaultValues);
  }, [reset, defaultValues]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit((data) => console.log(data))}>
        <Container maxWidth={settings.themeStretch ? false : 'lg'}>
          <CustomBreadcrumbs
            heading="Oakotex Certificate - Overview"
            links={[
              { name: 'Dashboard', href: paths.dashboard.root },
              { name: 'Reports' },
              { name: 'Oakotex Certificate' },
            ]}
            sx={{
              mb: { xs: 3, md: 5 },
            }}
          />

          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <Controller
                name="Country"
                control={control}
                defaultValue=""
                render={({ field, fieldState: { error } }) => (
                  <RHFAutocomplete
                    {...field}
                    options={Country}
                    getOptionLabel={(option) => option.CountryName || ''}
                    isOptionEqualToValue={(option, value) => option.Country_id === value}
                    value={Country.find((init) => init.Country_id === field.value) || null}
                    onChange={(event, newValue) => {
                      field.onChange(newValue ? newValue.Country_id : '');
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Country"
                        variant="outlined"
                        fullWidth
                        error={!!error}
                        helperText={error ? error.message : ''}
                      />
                    )}
                  />
                )}
              />
              <Controller
                name="ReportType"
                control={control}
                defaultValue=""
                render={({ field, fieldState: { error } }) => (
                  <RHFAutocomplete
                    {...field}
                    options={Country}
                    getOptionLabel={(option) => option.CountryName || ''}
                    isOptionEqualToValue={(option, value) => option.Country_id === value}
                    value={Country.find((init) => init.Country_id === field.value) || null}
                    onChange={(event, newValue) => {
                      field.onChange(newValue ? newValue.Country_id : '');
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Report Type"
                        variant="outlined"
                        fullWidth
                        error={!!error}
                        helperText={error ? error.message : ''}
                      />
                    )}
                  />
                )}
              />
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 1.5,
                mt: 2,
              }}
            >
              <LoadingButton
                type="submit"
                variant="contained"
                color="primary"
                loading={isSubmitting}
                sx={{ ml: 2 }}
              >
                Generate Report
              </LoadingButton>
            </Box>
          </Card>
        </Container>
      </form>
    </FormProvider>
  );
};

export default page;
