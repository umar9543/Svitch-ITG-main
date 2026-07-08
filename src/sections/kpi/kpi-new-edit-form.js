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

// ----------------------------------------------------------------------

export default function KpiNewEditForm({ currentKpi }) {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const NewKpiSchema = Yup.object().shape({
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
      name: currentKpi?.name || '',
      city: currentKpi?.city || '',
      role: currentKpi?.role || '',
      email: currentKpi?.email || '',
      state: currentKpi?.state || '',
      status: currentKpi?.status || '',
      address: currentKpi?.address || '',
      country: currentKpi?.country || '',
      zipCode: currentKpi?.zipCode || '',
      company: currentKpi?.company || '',
      avatarUrl: currentKpi?.avatarUrl || null,
      phoneNumber: currentKpi?.phoneNumber || '',
      isVerified: currentKpi?.isVerified || true,
    }),
    [currentKpi]
  );

  const methods = useForm({
    resolver: yupResolver(NewKpiSchema),
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
      enqueueSnackbar(currentKpi ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.kpi.root);
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
        {/* <Grid xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3 }}>
            {currentKpi && (
              <Label
                color={
                  (values.status === 'active' && 'success') ||
                  (values.status === 'banned' && 'error') ||
                  'warning'
                }
                sx={{ position: 'absolute', top: 24, right: 24 }}
              >
                {values.status}
              </Label>
            )}

            <Box sx={{ mb: 5 }}>
              <RHFUploadAvatar
                name="avatarUrl"
                maxSize={3145728}
                onDrop={handleDrop}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 3,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.disabled',
                    }}
                  >
                    Allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of {fData(3145728)}
                  </Typography>
                }
              />
            </Box>

            {currentKpi && (
              <FormControlLabel
                labelPlacement="start"
                control={
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        {...field}
                        checked={field.value !== 'active'}
                        onChange={(event) =>
                          field.onChange(event.target.checked ? 'banned' : 'active')
                        }
                      />
                    )}
                  />
                }
                label={
                  <>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      Banned
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Apply disable account
                    </Typography>
                  </>
                }
                sx={{ mx: 0, mb: 3, width: 1, justifyContent: 'space-between' }}
              />
            )}

            <RHFSwitch
              name="isVerified"
              labelPlacement="start"
              label={
                <>
                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                    Email Verified
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Disabling this will automatically send the kpi a verification email
                  </Typography>
                </>
              }
              sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
            />

            {currentKpi && (
              <Stack justifyContent="center" alignItems="center" sx={{ mt: 3 }}>
                <Button variant="soft" color="error">
                  Delete Kpi
                </Button>
              </Stack>
            )}
          </Card>
        </Grid> */}

        <Grid xs={12} md={12}>
          <Card sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" sx={{ mb: 5, borderBottom: '1px solid #e0e0e0' }}>
              Environmental
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Customer</Typography>
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
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Input Frequency</Typography>
                <RHFAutocomplete
                  name="Input Frequency"
                  type="Input Frequency"
                  // label="Customer"
                  placeholder="Input Frequency"
                  fullWidth
                  options={countries.map((option) => option.label)}
                  getOptionLabel={(option) => option}
                />
              </Grid>
              {/* <RHFTextField name="phoneNumber" label="Phone Number" /> */}

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Supplier</Typography>
                <RHFAutocomplete
                  name="Supplier"
                  type="Supplier"
                  // label="Customer"
                  placeholder="Supplier"
                  fullWidth
                  options={countries.map((option) => option.label)}
                  getOptionLabel={(option) => option}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Data Input By</Typography>
                <RHFTextField name="Data Input By" fullWidth />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Data </Typography>
                <DesktopDatePicker sx={{ width: '100%' }} name="date"  format="dd/MM/yyyy"/>
              </Grid>

              {/* <RHFTextField name="state" label="State/Region" />
              <RHFTextField name="city" label="City" />
              <RHFTextField name="address" label="Address" />
              <RHFTextField name="zipCode" label="Zip/Code" />
              <RHFTextField name="company" label="Company" />
              <RHFTextField name="role" label="Role" /> */}
            </Grid>
          </Card>

          {/* Utility Consumed */}

          <Card sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" sx={{ mb: 5, borderBottom: '1px solid #e0e0e0' }}>
              Utility Consumed
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Electricity Consumption (in KWh) </Typography>
                <RHFTextField name="eConsumption" fullWidth />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Water Consumption (in L) </Typography>
                <RHFTextField name="wConsumption" fullWidth />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Natural Gas Consumption (in m^3) </Typography>
                <RHFTextField name="gConsumption" fullWidth />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Diesal Consumption (in L) </Typography>
                <RHFTextField name="dConsumption" fullWidth />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Coal Consumption (in Kg) </Typography>
                <RHFTextField name="cConsumption" fullWidth />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">LPG Consumption </Typography>
                <RHFTextField name="lpgConsumption" fullWidth />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Bag Gas Consumption </Typography>
                <RHFTextField name="bgConsumption" fullWidth />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Rice Consumption </Typography>
                <RHFTextField name="riceConsumption" fullWidth />
              </Grid>
            </Grid>
          </Card>

          {/* Utility Produced */}

          <Card sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" sx={{ mb: 5, borderBottom: '1px solid #e0e0e0' }}>
              Utility Produced
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Genrator Production (in KWh) </Typography>
                <RHFTextField name="genProduction" fullWidth />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Waste Water Treated (in L) </Typography>
                <RHFTextField name="wTreated" fullWidth />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Solar Energy Produced (in kWh) </Typography>
                <RHFTextField name="solarProduced" fullWidth />
              </Grid>
            </Grid>
          </Card>

          {/* Consumables */}

          <Card sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" sx={{ mb: 5, borderBottom: '1px solid #e0e0e0' }}>
              Consumables
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Dye Consumed in (Kg) </Typography>
                <RHFTextField name="DyeConsumed" fullWidth />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Chamical Consumed in (Kg)</Typography>
                <RHFTextField name="ChemicalConsumed" fullWidth />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Salt Consumed in (Kg) </Typography>
                <RHFTextField name="solarProduced" fullWidth />
              </Grid>
            </Grid>
          </Card>

          {/* Waste */}

          <Card sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" sx={{ mb: 5, borderBottom: '1px solid #e0e0e0' }}>
              Waste
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Waste Produced in (Kg) </Typography>
                <RHFTextField name="DyeConsumed" fullWidth />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Waste Solid in (Kg)</Typography>
                <RHFTextField name="ChemicalConsumed" fullWidth />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Waste Utilised in (Kg) </Typography>
                <RHFTextField name="solarProduced" fullWidth />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Waste Disposed in (Kg) </Typography>
                <RHFTextField name="solarProduced" fullWidth />
              </Grid>
            </Grid>
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
              {!currentKpi ? 'Create Kpi' : 'Save Changes'}
            </LoadingButton>
          </Box>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

KpiNewEditForm.propTypes = {
  currentKpi: PropTypes.object,
};
