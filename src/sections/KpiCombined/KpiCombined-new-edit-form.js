'use client';
import React from 'react';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useMemo, useCallback, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControlLabel from '@mui/material/FormControlLabel';
import Scrollbar from 'src/components/scrollbar';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fData } from 'src/utils/format-number';

import { countries } from 'src/assets/data';
// import IncrementDecrementInput from 'src/components/IncrementDecrementInput';

import Label from 'src/components/label';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFSwitch,
  RHFTextField,
  RHFUploadAvatar,
  RHFAutocomplete,
} from 'src/components/hook-form';
import {
  ButtonGroup,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

// ----------------------------------------------------------------------

function getCurrentDate() {
  const today = new Date();

  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const year = today.getFullYear();

  return `${day}/${month}/${year}`;
}

export default function KpiCombinedNewEditForm({ currentKpiCombined }) {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  // const [score, setScore] = useState(scoreValues[0]);
  // const [score1, setScore1] = useState(scoreValues[0]);
  // const [currentDate, setCurrentDate] = useState(getCurrentDate());
  // const [activeClass, setActiveClass] = useState(null); // Track the active class

  const NewKpiCombinedSchema = Yup.object().shape({
    SiteAddress: Yup.string().required('Address is required'),
    City: Yup.string().required('City is required'),
    SiteManager: Yup.string().required('Site Manager is required'),
  });

  const defaultValues = useMemo(
    () => ({
      SiteID: currentKpiCombined?.SiteID || '',
      City: currentKpiCombined?.City || '',
      SiteManager: currentKpiCombined?.SiteManager || '',
      SiteAddress: currentKpiCombined?.SiteAddress || '',

      // currentDate: currentDate,
    }),
    [currentKpiCombined]
  );

  const methods = useForm({
    resolver: yupResolver(NewKpiCombinedSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      enqueueSnackbar(currentKpiCombined ? 'Update success!' : 'Create success!');
      // router.push(paths.dashboard.KpiCombined.root);
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={12}>
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
              {/* <RHFTextField name="SiteAddress" label="Site Address " />

              <RHFTextField name="SiteManager" label="Site Manager" /> */}

              <RHFAutocomplete
                name="Customer"
                // type="country"
                label="Customer"
                // placeholder="Choose a country"
                fullWidth
                options={countries.map((option) => option.label)}
                getOptionLabel={(option) => option}
              />
              <RHFAutocomplete
                name="Supplier"
                // type="country"
                label="Supplier"
                // placeholder="Choose a country"
                fullWidth
                options={countries.map((option) => option.label)}
                getOptionLabel={(option) => option}
              />
              <RHFAutocomplete
                name="Month"
                // type="country"
                label="Month"
                // placeholder="Choose a country"
                fullWidth
                options={countries.map((option) => option.label)}
                getOptionLabel={(option) => option}
              />
              <RHFAutocomplete
                name="Year"
                // type="country"
                label="Year"
                // placeholder="Choose a country"
                fullWidth
                options={countries.map((option) => option.label)}
                getOptionLabel={(option) => option}
              />

              {/* <RHFTextField name="state" label="State/Region" />
              <RHFTextField name="City" label="City" />
              <RHFTextField name="SiteAddress" label="Address" />
              <RHFTextField name="zipCode" label="Zip/Code" />
              <RHFTextField name="company" label="Company" />
              <RHFTextField name="SiteManager" label="Role" /> */}
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton
                type="submit"
                variant="contained"
                color="primary"
                loading={isSubmitting}
              >
                {!currentKpiCombined ? 'Save Changes' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

KpiCombinedNewEditForm.propTypes = {
  currentKpiCombined: PropTypes.object,
};
