import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useMemo, useCallback } from 'react';
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

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fData } from 'src/utils/format-number';

import { countries } from 'src/assets/data';

import Label from 'src/components/label';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFSwitch,
  RHFTextField,
  RHFUploadAvatar,
  RHFAutocomplete,
} from 'src/components/hook-form';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import Scrollbar from 'src/components/scrollbar';
import {
  IconButton,
  Paper,
  Radio,
  RadioGroup,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function AuditKpiNewEditForm({ currentAuditKpi }) {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const NewAuditKpiSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    phoneNumber: Yup.string().required('Phone number is required'),
    address: Yup.string().required('Address is required'),
    country: Yup.string().required('Country is required'),
    company: Yup.string().required('Company is required'),
    state: Yup.string().required('State is required'),
    city: Yup.string().required('City is required'),
    role: Yup.string().required('Role is required'),
    zipCode: Yup.string().required('Zip code is required'),
    avatarUrl: Yup.mixed().nullable().required('Avatar is required'),
    // not required
    status: Yup.string(),
    isVerified: Yup.boolean(),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentAuditKpi?.name || '',
      city: currentAuditKpi?.city || '',
      role: currentAuditKpi?.role || '',
      email: currentAuditKpi?.email || '',
      state: currentAuditKpi?.state || '',
      status: currentAuditKpi?.status || '',
      address: currentAuditKpi?.address || '',
      country: currentAuditKpi?.country || '',
      zipCode: currentAuditKpi?.zipCode || '',
      company: currentAuditKpi?.company || '',
      avatarUrl: currentAuditKpi?.avatarUrl || null,
      phoneNumber: currentAuditKpi?.phoneNumber || '',
      isVerified: currentAuditKpi?.isVerified || true,
    }),
    [currentAuditKpi]
  );

  const methods = useForm({
    resolver: yupResolver(NewAuditKpiSchema),
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

  const handleContactDelete = () => {
    setValue('avatarUrl', null, {
      shouldValidate: true,
    });
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      enqueueSnackbar(currentAuditKpi ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.audit.root);
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('avatarUrl', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={12}>
          <Card sx={{ p: 2, mb: 2 }}>
            {/* <Typography variant="h6" sx={{ mb: 5, borderBottom: '1px solid #e0e0e0' }}>
              Environmental
            </Typography> */}

            <Grid container spacing={3}>
              <Grid item xs={12} md={12}>
                <Typography variant="subtitle2">Category</Typography>
                <RadioGroup row defaultValue="Computation">
                  <FormControlLabel
                    value="Computation"
                    control={<Radio size="medium" />}
                    label="Computation"
                  />
                  <FormControlLabel
                    value="Expression"
                    control={<Radio size="medium" />}
                    label="Expression"
                  />
                </RadioGroup>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Classification</Typography>
                <RHFAutocomplete
                  name="customer"
                  type="customer"
                  // label="Customer"
                  placeholder="Choose a customer"
                  fullWidth
                  options={countries.map((option) => option.label)}
                  getOptionLabel={(option) => option}
                />
              </Grid>

              <Grid item xs={12} md={12}>
                <Typography variant="subtitle2">Header</Typography>
                <RHFTextField name="Data Input By" placeholder="Header" fullWidth />
              </Grid>
              <Grid item xs={12} md={12}>
                <Typography variant="subtitle2">KPI </Typography>
                <RHFTextField name="Data Input By" placeholder="KPI" fullWidth />
              </Grid>
              <Grid item xs={12} md={12}>
                <Typography variant="subtitle2">Instruction for Auditors </Typography>
                <RHFTextField
                  name="Data Input By"
                  placeholder="Instruction for Auditors"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={12}>
                <Typography variant="subtitle2">Corrective Action Plan(s) </Typography>
                <RHFTextField
                  name="Data Input By"
                  placeholder="Corrective Action Plan(s)"
                  fullWidth
                />
              </Grid>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="contained" color="primary" sx={{ mt: 3 }}>
                Add CAP(S)
              </Button>
            </Box>
          </Card>

          <Card sx={{ p: 2, mb: 2 }}>
            <Scrollbar>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ minWidth: 200 }}>Corrective Action Plan(s) </TableCell>
                      <TableCell sx={{ minWidth: 180, textAlign: 'end' }}>Delete</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Corrective Action Plan(s)</TableCell>
                      <TableCell style={{ textAlign: 'end' }}>
                        <IconButton onClick={() => handleContactDelete(index)} color="error">
                          <Iconify icon="solar:trash-bin-trash-bold" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Scrollbar>
          </Card>

          <Box sx={{ mt: 3, gap: 1, display: 'flex', justifyContent: 'end' }}>
            <LoadingButton
              type="button"
              variant="contained"
              color="primary"
              loading={isSubmitting}
              onClick={() => router.back()}
            >
              Cancel
            </LoadingButton>
            <LoadingButton type="submit" variant="contained" color="primary" loading={isSubmitting}>
              {!currentAuditKpi ? 'Create KPI' : 'Save Changes'}
            </LoadingButton>
          </Box>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

AuditKpiNewEditForm.propTypes = {
  currentAuditKpi: PropTypes.object,
};
