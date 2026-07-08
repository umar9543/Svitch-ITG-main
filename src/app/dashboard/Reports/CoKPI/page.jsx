'use client';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Card, Typography } from '@mui/material';
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
import { DesktopDatePicker } from '@mui/x-date-pickers';

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
            heading="Combined KPI Analytical Report"
            links={[
              { name: 'Dashboard', href: paths.dashboard.root },
              { name: 'Reports' },
              { name: 'Combined KPI Analytical Report' },
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
              <div>
                <Typography variant="body2">From</Typography>{' '}
                <DesktopDatePicker lable="From " sx={{ width: '100%' }} />
              </div>
              <div>
                <Typography variant="body2">To</Typography>{' '}
                <DesktopDatePicker lable="To " sx={{ width: '100%' }} />
              </div>
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
