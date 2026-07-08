'use client';

import { useState, useCallback, useEffect } from 'react';
import * as Yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';

import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

import FormProvider, { RHFTextField, RHFAutocomplete } from 'src/components/hook-form';
import { DesktopDatePicker, MobileTimePicker } from '@mui/x-date-pickers';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { format } from 'date-fns';

import { Get, Post, Put } from 'src/utils/AxiosHelper';
import { decryptObjectKeys } from 'src/utils/getDecryption';
import { getDecryptedUserData } from 'src/utils/getUser';
import { useSnackbar } from 'src/components/snackbar';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import WorkshopAddSupplierDialog from './workshop-add-supplier-dialog';
import WorkshopComposeEmailDialog from './workshop-compose-email-dialog';
import { fDate, fTime } from 'src/utils/format-time';
import { encrypt } from 'src/api/encryption';

// ----------------------------------------------------------------------

const TIMEZONES = [
  { value: '(GMT+8:00) Hong Kong SAR', label: '(GMT+8:00) Hong Kong SAR' },
  { value: '(GMT+0:00) UTC', label: '(GMT+0:00) UTC' },
  { value: '(GMT+5:30) India', label: '(GMT+5:30) India' },
  { value: '(GMT+1:00) Central Europe', label: '(GMT+1:00) Central Europe' },
];

const WorkshopInvitationSchema = Yup.object().shape({
  WorkshopName: Yup.string().required('Workshop name is required'),
  Description: Yup.string(),
  RelatedPA: Yup.array().of(Yup.mixed()).min(1, 'At least one Performance Area is required'),
  Date: Yup.mixed().nullable().required('Date is required'),
  TimeZone: Yup.mixed().nullable().required('Time zone is required'),
  StartTime: Yup.mixed().nullable().required('Start time is required'),
  EndTime: Yup.mixed().nullable().required('End time is required'),
  RegistrationLink: Yup.string(),
});

export default function WorkshopInvitationForm({ workshopId, currentWorkshop }) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const userData = getDecryptedUserData();

  const [performanceAreas, setPerformanceAreas] = useState([]);
  const [timeZones, setTimeZones] = useState([]);
  const [selectedSuppliers, setSelectedSuppliers] = useState([]);
  const [addSupplierOpen, setAddSupplierOpen] = useState(false);
  const [composeEmailOpen, setComposeEmailOpen] = useState(false);
  const [emailContent, setEmailContent] = useState('');

  const defaultValues = {
    WorkshopName: currentWorkshop?.WorkShopName ?? '',
    Description: currentWorkshop?.Description ?? '',
    RelatedPA: [],
    Date: currentWorkshop?.WorkShopDate ? new Date(currentWorkshop.WorkShopDate) : null,
    TimeZone: null,
    StartTime: currentWorkshop?.StartTime ? new Date(`1970-01-01T${currentWorkshop.StartTime}`) : null,
    EndTime: currentWorkshop?.EndTime ? new Date(`1970-01-01T${currentWorkshop.EndTime}`) : null,
    RegistrationLink: currentWorkshop?.InvitationLink ?? '',
  };

  const methods = useForm({
    resolver: yupResolver(WorkshopInvitationSchema),
    defaultValues,
  });

  const { watch, setValue, handleSubmit, formState: { isSubmitting } } = methods;
  const values = watch();


  const fetchPA = useCallback(async () => {
    try {
      const res = await Get('GetPerformanceArea');
      const decrypted = decryptObjectKeys(res?.data?.ServiceRes ?? []);
      setPerformanceAreas(Array.isArray(decrypted) ? decrypted : []);
    } catch (e) {
      setPerformanceAreas([{ PerformanceAreaID: 1, Name: 'Health & Safety' }]);
    }
  }, []);
  const GetTimeZones = useCallback(async () => {
    try {
      const res = await Get('GetTimeZones');
      const decrypted = decryptObjectKeys(res?.data?.ServiceRes ?? []);
      const data = decrypted.map((tz) => ({
        ...tz,
        TimeZoneNameWithUTCOffset: `${tz.TimeZoneName} (${tz.UTCOffset})`,
      }));
      setTimeZones(Array.isArray(data) ? data : []);
    } catch (e) {
      setTimeZones([]);
    }
  }, []);

  useEffect(() => {
    Promise.all([fetchPA(), GetTimeZones()]);
  }, [fetchPA, GetTimeZones]);

  useEffect(() => {
    if (!currentWorkshop) return;

    if (currentWorkshop.Suppliers?.length) {
      setSelectedSuppliers(
        currentWorkshop.Suppliers.map((s) => ({
          VenderLibraryID: s.SupplierID,
          VenderName: s.SupplierName,
          Contact: s.PhoneNumber,
          Email: s.OnBoardingEmail,
        }))
      );
    }
  }, [currentWorkshop]);
  useEffect(() => {
    if (!currentWorkshop) return;

    if (performanceAreas.length && currentWorkshop.PerformanceAreas?.length) {
      const idSet = new Set(currentWorkshop.PerformanceAreas?.map(item => String(item.PerformanceAreaID)));
      const matched = performanceAreas.filter(
        (pa) => idSet.has(String(pa.PerformanceAreaID))
      );
      if (matched.length) setValue('RelatedPA', matched);
    }

    if (timeZones.length && currentWorkshop.TimeZoneID) {
      const matched = timeZones.find(
        (tz) => String(tz.TimeZoneID) === String(currentWorkshop.TimeZoneID)
      );
      if (matched) setValue('TimeZone', matched);
    }
  }, [currentWorkshop, performanceAreas, timeZones, setValue]);

  const handleAddSuppliers = useCallback((suppliers) => {
    setSelectedSuppliers((prev) => {
      const ids = new Set(prev.map((s) => s.VenderLibraryID));
      const toAdd = suppliers.filter((s) => !ids.has(s.VenderLibraryID));
      return [...prev, ...toAdd];
    });
  }, []);

  const handleRemoveSupplier = useCallback((VenderLibraryID) => {
    setSelectedSuppliers((prev) => prev.filter((s) => s.VenderLibraryID !== VenderLibraryID));
  }, []);

  const doSave = useCallback(
    async (data, sendEmail = false) => {
      try {
        const isEdit = !!workshopId;

        const rawPayload = {
          ...(isEdit && { WorkshopInvitationMstID: String(workshopId) }),
          WorkShopName: data.WorkshopName,
          PerformanceAreaIDs: (data.RelatedPA ?? []).map(
            (pa) => String(pa?.PerformanceAreaID ?? pa?.performanceAreaId ?? pa?.value ?? '')
          ),
          Description: data.Description,
          WorkShopDate: data.Date ? fDate(new Date(data.Date), 'yyyy-MM-dd') : '',
          TimeZoneID: String(data.TimeZone?.TimeZoneID ?? ''),
          StartTime: data.StartTime ? fTime(new Date(data.StartTime), 'HH:mm:ss') : '',
          EndTime: data.EndTime ? fTime(new Date(data.EndTime), 'HH:mm:ss') : '',
          InvitationLink: data.RegistrationLink,
          UserID: String(userData?.[0]?.UserID),
          SupplierIDs: selectedSuppliers.map((s) => s.VenderLibraryID),
        };
        console.log(rawPayload);
        const arrayKeys = ['PerformanceAreaIDs', 'SupplierIDs'];

        const encryptedPayload = Object.assign(
          {},
          ...Object.keys(rawPayload).map((key) => ({
            [key]: arrayKeys.includes(key) ? rawPayload[key] : encrypt(rawPayload[key]),
          }))
        );

        encryptedPayload.PerformanceAreaIDs = rawPayload.PerformanceAreaIDs.map((id) => encrypt(String(id)));
        encryptedPayload.SupplierIDs = rawPayload.SupplierIDs.map((id) => encrypt(String(id)));

        if (isEdit) {
          await Put('UpdateWorkshopInvitation', encryptedPayload);
        } else {
          await Post('InsertWorkshopInvitation', encryptedPayload);
        }

        enqueueSnackbar(isEdit ? 'Updated successfully' : 'Workshop created successfully', { variant: 'success' });
        if (sendEmail) {
          enqueueSnackbar('Email will be sent to selected suppliers (BCC).', { variant: 'info' });
        }
        router.push(paths.dashboard.RiskAnalysis.RiskMitigation.workshop.root);
      } catch (err) {
        enqueueSnackbar(err?.message || 'Save failed', { variant: 'error' });
      }
    },
    [workshopId, selectedSuppliers, userData, enqueueSnackbar, router]
  );

  const onSubmit = handleSubmit((data) => doSave(data, false));

  const handleSaveAndSendEmail = handleSubmit((data) => doSave(data, true));

  const paLabel = (pa) => pa?.Name ?? pa?.name ?? '';
  const paValue = (pa) => pa?.PerformanceAreaID ?? pa?.performanceAreaId;

  return (
    <>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Grid container spacing={3}>
          <Grid xs={12}>
            <Card sx={{ p: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Workshop Information
              </Typography>
              <Box
                rowGap={2}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }}
              >
                <RHFTextField name="WorkshopName" label="Workshop Name" />
                <RHFAutocomplete
                  name="RelatedPA"
                  label="Related PA"
                  fullWidth
                  multiple
                  limitTags={2}
                  options={performanceAreas}
                  getOptionLabel={paLabel}
                  isOptionEqualToValue={(a, b) => paValue(a) === paValue(b)}
                  renderOption={(props, option) => {
                    const isChecked = values.RelatedPA?.some(
                      (selected) => paValue(selected) === paValue(option)
                    );
                    return (
                      <li {...props} key={paValue(option)}>
                        <Checkbox size="small" disableRipple checked={isChecked} />
                        {paLabel(option)}
                      </li>
                    );
                  }}
                  renderTags={(selected, getTagProps) =>
                    selected.map((option, index) => (
                      <Chip
                        {...getTagProps({ index })}
                        key={paValue(option)}
                        label={paLabel(option)}
                        size="small"
                        variant="soft"
                        color="primary"
                      />
                    ))
                  }
                />
                <RHFTextField name="Description" label="Description" multiline rows={2} />
              </Box>
            </Card>
          </Grid>

          <Grid xs={12}>
            <Card sx={{ p: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Conduct Workshop
              </Typography>
              <Box
                rowGap={2}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }}
              >
                <Controller
                  name="Date"
                  control={methods.control}
                  render={({ field }) => (
                    <DesktopDatePicker
                      label="Date"
                      format="dd MMM yyyy"
                      value={field.value}
                      onChange={field.onChange}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  )}
                />
                <RHFAutocomplete
                  name="TimeZone"
                  label="Time Zone"
                  options={timeZones}
                  getOptionLabel={(tz) => tz.TimeZoneNameWithUTCOffset}
                  isOptionEqualToValue={(a, b) => a.TimeZoneID === b.TimeZoneID}
                  fullWidth
                />
                <Controller
                  name="StartTime"
                  control={methods.control}
                  render={({ field }) => (
                    <MobileTimePicker
                      label="Start Time"
                      value={field.value}
                      onChange={field.onChange}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  )}
                />
                <Controller
                  name="EndTime"
                  control={methods.control}
                  render={({ field }) => (
                    <MobileTimePicker
                      label="End Time"
                      value={field.value}
                      onChange={field.onChange}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  )}
                />
                <RHFTextField name="RegistrationLink" label="Registration Link" sx={{ gridColumn: '1 / -1' }} />
              </Box>
            </Card>
          </Grid>

          <Grid xs={12}>
            <Card sx={{ p: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Supplier
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Iconify icon="mingcute:add-line" />}
                  onClick={() => setAddSupplierOpen(true)}
                >
                  Add Suppliers
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Iconify icon="solar:letter-bold" />}
                  onClick={() => setComposeEmailOpen(true)}
                >
                  Compose Email
                </Button>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Selected Suppliers
              </Typography>
              <TableContainer>
                <Scrollbar>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>#</TableCell>
                        <TableCell>Supplier Name</TableCell>
                        <TableCell>Contact</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell align="center">Remove</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedSuppliers.map((row, idx) => (
                        <TableRow key={row.VenderLibraryID}>
                          <TableCell>{idx + 1}</TableCell>
                          <TableCell>{row.VenderName}</TableCell>
                          <TableCell>{row.Contact ?? '—'}</TableCell>
                          <TableCell>{row.Email ?? '—'}</TableCell>
                          <TableCell align="center">
                            <IconButton
                              color="error"
                              size="small"
                              onClick={() => handleRemoveSupplier(row.VenderLibraryID)}
                            >
                              <Iconify icon="solar:trash-bin-trash-bold" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Scrollbar>
              </TableContainer>
            </Card>
          </Grid>

          <Grid xs={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button variant="outlined" onClick={() => router.push(paths.dashboard.RiskAnalysis.RiskMitigation.workshop.root)}>
                Cancel
              </Button>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Save
              </LoadingButton>
              <LoadingButton
                variant="contained"
                disabled
                color="primary"
                loading={isSubmitting}
                onClick={handleSaveAndSendEmail}
              >
                Save & Send Email
              </LoadingButton>
            </Box>
          </Grid>
        </Grid>
      </FormProvider>

      <WorkshopAddSupplierDialog
        open={addSupplierOpen}
        onClose={() => setAddSupplierOpen(false)}
        selectedSuppliers={selectedSuppliers}
        onAddSuppliers={handleAddSuppliers}
      />
      <WorkshopComposeEmailDialog
        open={composeEmailOpen}
        onClose={() => setComposeEmailOpen(false)}
        workshopDetails={values}
        onSave={setEmailContent}
      />
    </>
  );
}
