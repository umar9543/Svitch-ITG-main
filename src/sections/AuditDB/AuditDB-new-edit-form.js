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
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers';

// ----------------------------------------------------------------------

function getCurrentDate() {
  const today = new Date();

  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const year = today.getFullYear();

  return `${day}/${month}/${year}`;
}

export default function AuditDBNewEditForm({ currentAuditDB }) {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  // const [score, setScore] = useState(scoreValues[0]);
  // const [score1, setScore1] = useState(scoreValues[0]);
  // const [currentDate, setCurrentDate] = useState(getCurrentDate());
  // const [activeClass, setActiveClass] = useState(null); // Track the active class

  const NewAuditDBSchema = Yup.object().shape({
    SiteAddress: Yup.string().required('Address is required'),
    City: Yup.string().required('City is required'),
    SiteManager: Yup.string().required('Site Manager is required'),
  });

  const defaultValues = useMemo(
    () => ({
      SiteID: currentAuditDB?.SiteID || '',
      City: currentAuditDB?.City || '',
      SiteManager: currentAuditDB?.SiteManager || '',
      SiteAddress: currentAuditDB?.SiteAddress || '',

      // currentDate: currentDate,
    }),
    [currentAuditDB]
  );

  const methods = useForm({
    resolver: yupResolver(NewAuditDBSchema),
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
      enqueueSnackbar(currentAuditDB ? 'Update success!' : 'Create success!');
      // router.push(paths.dashboard.AuditDB.root);
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
            {/* <Typography variant="h6" gutterBottom>
              Pre Audit - Factory Self Input Registration{' '}
            </Typography> */}
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(2, 1fr)',
              }}
            >
              {/* <RHFTextField name="SiteAddress" label="Site Address " />
               */}

              <RHFTextField name="Audit ID" label=" Audit ID" />
              <Box />
              <RHFAutocomplete
                name="On Site Visit"
                // type="country"
                label="Customer"
                // placeholder="Choose a country"
                fullWidth
                options={countries.map((option) => option.label)}
                getOptionLabel={(option) => option}
              />
              <RHFAutocomplete
                name="On Site Visit"
                // type="country"
                label="Audit Title"
                // placeholder="Choose a country"
                fullWidth
                options={countries.map((option) => option.label)}
                getOptionLabel={(option) => option}
              />
              <RHFAutocomplete
                name="On Site Visit"
                // type="country"
                label="Auditor"
                // placeholder="Choose a country"
                fullWidth
                options={countries.map((option) => option.label)}
                getOptionLabel={(option) => option}
              />
              <DesktopDatePicker label="Audit Date" />
              <RHFAutocomplete
                name="On Site Visit"
                // type="country"
                label="Supplier"
                // placeholder="Choose a country"
                fullWidth
                options={countries.map((option) => option.label)}
                getOptionLabel={(option) => option}
              />
              <RHFAutocomplete
                name="On Site Visit"
                // type="country"
                label="On Site Visit"
                // placeholder="Choose a country"
                fullWidth
                options={countries.map((option) => option.label)}
                getOptionLabel={(option) => option}
              />

              {/* <Box sx={{ display: 'flex', justifyContent: 'flex-end', gridColumn: 'span 3' }}>
                <Button variant="contained" color="primary">
                  Generate Audit Form
                </Button>
              </Box> */}
            </Box>
          </Card>

          {/* <Card sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              General Contact Information
            </Typography>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(3, 1fr)',
              }}
            >
              <RHFAutocomplete
                name="Contact Type"
                // type="country"
                label="Contact Type"
                // placeholder="Choose a country"
                fullWidth
                options={countries.map((option) => option.label)}
                getOptionLabel={(option) => option}
              />
              <RHFTextField name="DateInputBy" label="Name" />
              <RHFTextField name="DateInputBy" label="Job Title" />
              <RHFTextField name="DateInputBy" label="Mobile No." />
              <RHFTextField name="DateInputBy" label="Email" />
            </Box>
          </Card>   <Card sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Factory Information
            </Typography>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(3, 1fr)',
              }}
            >
              <RHFTextField name="Supplier Type" label="Supplier Type" />
              <Box
                sx={{ display: 'flex', gridColumn: 'span 2', alignItems: 'center', gap: 2, px: 2 }}
              >
                <Typography variant="body2">Is Exporter:</Typography>
                <RadioGroup row defaultValue="yes">
                  <FormControlLabel value="yes" control={<Radio size="medium" />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio size="medium" />} label="No" />
                </RadioGroup>
              </Box>
              <RHFTextField name="DateInputBy" label="Supplier Name" />
              <RHFTextField name="DateInputBy" label="Short Name" />
              <RHFTextField name="DateInputBy" label="Address 1" sx={{ gridColumn: 'span 3' }} />
              <RHFTextField name="DateInputBy" label="Address 2" sx={{ gridColumn: 'span 3' }} />
              <RHFAutocomplete
                name="Country"
                // type="country"
                label="Country"
                // placeholder="Choose a country"
                fullWidth
                options={countries.map((option) => option.label)}
                getOptionLabel={(option) => option}
              />
              <RHFTextField name="DateInputBy" label="City" />
              <RHFTextField name="DateInputBy" label="Province" />
              <RHFTextField name="DateInputBy" label="Web Address" />
              <RHFTextField name="DateInputBy" label="Phone" />
              <RHFTextField name="DateInputBy" label="Fax" />
              <RHFTextField name="DateInputBy" label="Zip Code" />
            </Box>
          </Card> */}

          <Stack alignItems="flex-end" sx={{ mt: 3 }}>
            <LoadingButton type="submit" variant="contained" color="primary" loading={isSubmitting}>
              {!currentAuditDB ? 'Save Changes' : 'Save Changes'}
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

AuditDBNewEditForm.propTypes = {
  currentAuditDB: PropTypes.object,
};
