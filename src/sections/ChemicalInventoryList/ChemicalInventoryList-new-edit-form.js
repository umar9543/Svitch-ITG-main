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
import Iconify from 'src/components/iconify/iconify';

// ----------------------------------------------------------------------

function getCurrentDate() {
  const today = new Date();

  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const year = today.getFullYear();

  return `${day}/${month}/${year}`;
}

export default function ChemicalInventoryListNewEditForm({ currentChemicalInventoryList }) {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  // const [score, setScore] = useState(scoreValues[0]);
  // const [score1, setScore1] = useState(scoreValues[0]);
  // const [currentDate, setCurrentDate] = useState(getCurrentDate());
  // const [activeClass, setActiveClass] = useState(null); // Track the active class

  const NewChemicalInventoryListSchema = Yup.object().shape({
    SiteAddress: Yup.string().required('Address is required'),
    City: Yup.string().required('City is required'),
    SiteManager: Yup.string().required('Site Manager is required'),
  });

  const defaultValues = useMemo(
    () => ({
      SiteID: currentChemicalInventoryList?.SiteID || '',
      City: currentChemicalInventoryList?.City || '',
      SiteManager: currentChemicalInventoryList?.SiteManager || '',
      SiteAddress: currentChemicalInventoryList?.SiteAddress || '',

      // currentDate: currentDate,
    }),
    [currentChemicalInventoryList]
  );

  const methods = useForm({
    resolver: yupResolver(NewChemicalInventoryListSchema),
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
      enqueueSnackbar(currentChemicalInventoryList ? 'Update success!' : 'Create success!');
      // router.push(paths.dashboard.ChemicalInventoryList.root);
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
            <Typography variant="h6" gutterBottom>
              Online Chemical Inventory System to Facilitate Audits
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
              {/* <RHFTextField name="SiteAddress" label="Site Address " />
               */}

              <DesktopDatePicker label="Pre Audit Date" />
              <RHFAutocomplete
                name="Audit Scheme"
                // type="country"
                label="Prepared By"
                // placeholder="Choose a country"
                fullWidth
                options={countries.map((option) => option.label)}
                getOptionLabel={(option) => option}
              />

              <RHFTextField
                name="Best Practices"
                label="Best Practices"
                sx={{ gridColumn: 'span 2' }}
              />
            </Box>
          </Card>
          {/* 
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Chemical Inventory List
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
          <Card sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Chemical Inventory List
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
              <RHFTextField name="DateInputBy" label="Product Name" />
              <RHFTextField name="DateInputBy" label="Product No." />
              <RHFTextField name="DateInputBy" label="Manufacturer Name" />
              <RHFTextField name="DateInputBy" label="Manufacturer Contact Detail" />
              <RHFTextField name="DateInputBy" label="Local Supplier/Agent Name" />
              <RHFTextField name="DateInputBy" label="Local Supplier/Agent Contact Detail" />
              <RHFTextField name="DateInputBy" label="Storage/Use Location in Factory" />
              <RHFTextField name="DateInputBy" label="Area of Usage" />
              <RHFTextField name="DateInputBy" label="Function (Purposes of Usages)" />
              <RHFTextField name="DateInputBy" label="Chemical" />
              <RHFTextField name="DateInputBy" label="CAS No." />
              <RHFTextField name="DateInputBy" label="Percentage of Composition" />
              <RHFTextField name="DateInputBy" label="MSDS/SDS No. / Date of Issue" />
              <RHFTextField
                name="DateInputBy"
                label="Conformance ZDHC/Brands RSL/Others (CADS, REACH)"
              />
              <RHFTextField name="DateInputBy" label="Hazard Class" />

              <RHFAutocomplete
                name="Quantity Stored"
                // type="country"
                label="Quantity Stored"
                // placeholder="Choose a country"
                fullWidth
                options={countries.map((option) => option.label)}
                getOptionLabel={(option) => option}
              />
              <RHFTextField name="Annaul Consumption To Date" label="Annaul Consumption To Date" />
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Button variant="contained" color="primary" sx={{ mt: 3 }}>
                <Iconify icon="eva:plus-fill" />
                Add Detail
              </Button>
            </Box>
          </Card>

          <Stack alignItems="flex-end" sx={{ mt: 3 }}>
            <LoadingButton type="submit" variant="contained" color="primary" loading={isSubmitting}>
              {!currentChemicalInventoryList ? 'Save Changes' : 'Save Changes'}
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

ChemicalInventoryListNewEditForm.propTypes = {
  currentChemicalInventoryList: PropTypes.object,
};
