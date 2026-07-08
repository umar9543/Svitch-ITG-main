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
import { DesktopDatePicker } from '@mui/x-date-pickers';

// ----------------------------------------------------------------------

function getCurrentDate() {
  const today = new Date();

  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const year = today.getFullYear();

  return `${day}/${month}/${year}`;
}

export default function AuditScheduleNewEditForm({ currentAuditSchedule }) {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  // const [score, setScore] = useState(scoreValues[0]);
  // const [score1, setScore1] = useState(scoreValues[0]);
  // const [currentDate, setCurrentDate] = useState(getCurrentDate());
  // const [activeClass, setActiveClass] = useState(null); // Track the active class

  const NewAuditScheduleSchema = Yup.object().shape({
    SiteAddress: Yup.string().required('Address is required'),
    City: Yup.string().required('City is required'),
    SiteManager: Yup.string().required('Site Manager is required'),
  });

  const defaultValues = useMemo(
    () => ({
      SiteID: currentAuditSchedule?.SiteID || '',
      City: currentAuditSchedule?.City || '',
      SiteManager: currentAuditSchedule?.SiteManager || '',
      SiteAddress: currentAuditSchedule?.SiteAddress || '',

      // currentDate: currentDate,
    }),
    [currentAuditSchedule]
  );

  const methods = useForm({
    resolver: yupResolver(NewAuditScheduleSchema),
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
      enqueueSnackbar(currentAuditSchedule ? 'Update success!' : 'Create success!');
      // router.push(paths.dashboard.AuditSchedule.root);
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
              Audit Schedule
            </Typography> */}
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(3, 1fr)',
              }}
            >
              {/* <RHFTextField name="SiteAddress" label="Site Address " />
               */}
              <RHFTextField name="Audit ID" label=" Audit ID" />

              <RHFAutocomplete
                name="Status"
                // type="country"
                label="Status"
                // placeholder="Choose a country"
                fullWidth
                options={countries.map((option) => option.label)}
                getOptionLabel={(option) => option}
              />

              <DesktopDatePicker label="Date" />
              <RHFAutocomplete
                name="AuditType"
                // type="country"
                label="Audit Type"
                // placeholder="Choose a country"
                fullWidth
                options={countries.map((option) => option.label)}
                getOptionLabel={(option) => option}
              />
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
                name="Agent"
                // type="country"
                label="Agent"
                // placeholder="Choose a country"
                fullWidth
                options={countries.map((option) => option.label)}
                getOptionLabel={(option) => option}
              />
              <RHFAutocomplete
                name="FactoryName"
                // type="country"
                label="Factory Name"
                // placeholder="Choose a country"
                fullWidth
                options={countries.map((option) => option.label)}
                getOptionLabel={(option) => option}
              />

              <RHFTextField name="Client Fctory ID" label="Client Fctory ID" />
              <div></div>
              <RHFTextField name="Contact Person" label="Contact Person" />
              <RHFTextField name="Mobile No." label="Mobile No." />
              <RHFTextField name="Email" type="email" label="Email" />
              <DesktopDatePicker label="Traning Date" />
              <DesktopDatePicker label="Audit Date" />
              <RHFAutocomplete
                name="Auditor"
                // type="country"
                label="Auditor"
                // placeholder="Choose a country"
                fullWidth
                options={countries.map((option) => option.label)}
                getOptionLabel={(option) => option}
              />
              <RHFTextField name="Remarks" label="Remarks" sx={{ gridColumn: 'span 3' }} />
              {/* <RHFTextField name="City" label="City" />
              <RHFTextField name="zipCode" label="Zip/Code" />
              <RHFTextField name="company" label="Company" />
              <RHFTextField name="SiteManager" label="Role" /> */}
            </Box>
          </Card>

          {/* <Card sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Detail Information
            </Typography>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="DateInputBy" label="Total Workdays" />
              <RHFTextField name="DateInputBy" label="Total Working Hours" />
              <RHFTextField name="DateInputBy" label="Total Regular Hours" />
              <RHFTextField name="DateInputBy" label="Total Overtime Hours" />
              <RHFTextField name="DateInputBy" label="Average Salary Worker" />
              <RHFTextField name="DateInputBy" label="Average Salary Staff" />
              <RHFTextField name="DateInputBy" label="Fixed Exchange Rate USD" />
              <RHFTextField name="DateInputBy" label="Fixed Exchange Rate EUR" />
              <RHFTextField name="DateInputBy" label="Workers Average Salary USD" />
              <RHFTextField name="DateInputBy" label="Staff Average Salary USD" />
              <RHFTextField name="DateInputBy" label="Workers Average Salary EUR" />
              <RHFTextField name="DateInputBy" label="Staff Average Salary EUR" />
            </Box>
          </Card> */}

          <Stack alignItems="flex-end" sx={{ mt: 3 }}>
            <LoadingButton type="submit" variant="contained" color="primary" loading={isSubmitting}>
              {!currentAuditSchedule ? 'Save Changes' : 'Save Changes'}
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

AuditScheduleNewEditForm.propTypes = {
  currentAuditSchedule: PropTypes.object,
};
