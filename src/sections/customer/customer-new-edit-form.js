import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useMemo, useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Unstable_Grid2';
import ButtonBase from '@mui/material/ButtonBase';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import FormControlLabel from '@mui/material/FormControlLabel';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useResponsive } from 'src/hooks/use-responsive';

import { countries } from 'src/assets/data';
import {
  _roles,
  JOB_SKILL_OPTIONS,
  JOB_BENEFIT_OPTIONS,
  JOB_EXPERIENCE_OPTIONS,
  JOB_EMPLOYMENT_TYPE_OPTIONS,
  JOB_WORKING_SCHEDULE_OPTIONS,
} from 'src/_mock';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFEditor,
  RHFSwitch,
  RHFTextField,
  RHFRadioGroup,
  RHFAutocomplete,
  RHFMultiCheckbox,
} from 'src/components/hook-form';
import { Button, TableCell, TableRow } from '@mui/material';
import { TableHeadCustom } from 'src/components/table';
import CustomTable from 'src/components/CustomTable/CustomTable';
import { UploadBox } from 'src/components/upload';
import { height, width } from '@mui/system';

// ----------------------------------------------------------------------

export default function CustomerNewEditForm({ currentCustomer }) {
  const router = useRouter();

  const mdUp = useResponsive('up', 'md');

  const { enqueueSnackbar } = useSnackbar();
  const [CategoryIcon, setCategoryIcon] = useState([]);

  const NewCustomerSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    content: Yup.string().required('Content is required'),
    employmentTypes: Yup.array().min(1, 'Choose at least one option'),
    role: Yup.string().required('Role is required'),
    skills: Yup.array().min(1, 'Choose at least one option'),
    workingSchedule: Yup.array().min(1, 'Choose at least one option'),
    benefits: Yup.array().min(1, 'Choose at least one option'),
    locations: Yup.array().min(1, 'Choose at least one option'),
    expiredDate: Yup.mixed().nullable().required('Expired date is required'),
    salary: Yup.object().shape({
      type: Yup.string(),
      price: Yup.number().min(1, 'Price is required'),
      negotiable: Yup.boolean(),
    }),
    experience: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      title: currentCustomer?.title || '',
      content: currentCustomer?.content || '',
      employmentTypes: currentCustomer?.employmentTypes || [],
      experience: currentCustomer?.experience || '1 year exp',
      role: currentCustomer?.role || _roles[1],
      skills: currentCustomer?.skills || [],
      workingSchedule: currentCustomer?.workingSchedule || [],
      locations: currentCustomer?.locations || [],
      benefits: currentCustomer?.benefits || [],
      expiredDate: currentCustomer?.expiredDate || null,
      salary: currentCustomer?.salary || {
        type: 'Hourly',
        price: 0,
        negotiable: false,
      },
    }),
    [currentCustomer]
  );

  const methods = useForm({
    resolver: yupResolver(NewCustomerSchema),
    defaultValues,
  });

  const {
    reset,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (currentCustomer) {
      reset(defaultValues);
    }
  }, [currentCustomer, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      enqueueSnackbar(currentCustomer ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.customer.root);
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  const renderDetails = (
    <>
      {/* Customer Information */}

      <Grid xs={12} md={12}>
        {/* <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Title, short description, image...
          </Typography> */}
        <Card>
          {/* {!mdUp && <CardHeader title="Details" />} */}
          <Typography variant="h6" sx={{ p: 2, my: 0.5, borderBottom: '1px solid #e0e0e0' }}>
            Customer Information
          </Typography>

          <Grid container spacing={1.5} sx={{ p: 2 }}>
            <Grid spacing={1.5} xs={12} md={6}>
              <Typography variant="subtitle2">Customer Name</Typography>
              <RHFTextField name="CustomerName" placeholder="John Doe..." />
            </Grid>

            <Grid spacing={1.5} xs={12} md={6}>
              {/* <Typography variant="subtitle2">Content</Typography>
              <RHFEditor simple name="content" /> */}
              <Typography variant="subtitle2">Short Name</Typography>
              <RHFTextField name="shortName" placeholder="Johny..." />
            </Grid>
          </Grid>

          <Grid>
            <Grid spacing={1.5} xs={12} md={12}>
              <Typography variant="subtitle2">Address Line 1</Typography>
              <RHFTextField name="Address1" placeholder="14th Street NewYork..." />
            </Grid>
            <Grid spacing={1.5} xs={12} md={12}>
              <Typography variant="subtitle2">Address Line 2</Typography>
              <RHFTextField name="Address2" placeholder="14th Street NewYork..." />
            </Grid>
          </Grid>

          <Grid container spacing={1.5} sx={{ p: 2 }}>
            <Grid spacing={1.5} xs={12} md={4}>
              <Typography variant="subtitle2">Country</Typography>
              <RHFAutocomplete
                name="Country"
                autoHighlight
                placeholder="USA"
                options={_roles.map((option) => option)}
                getOptionLabel={(option) => option}
                renderOption={(props, option) => (
                  <li {...props} key={option}>
                    {option}
                  </li>
                )}
              />
            </Grid>
            <Grid spacing={1.5} xs={12} md={4}>
              <Typography variant="subtitle2">Title</Typography>
              <RHFAutocomplete
                name="Title"
                autoHighlight
                placeholder="Developer"
                options={_roles.map((option) => option)}
                getOptionLabel={(option) => option}
                renderOption={(props, option) => (
                  <li {...props} key={option}>
                    {option}
                  </li>
                )}
              />
            </Grid>
            <Grid spacing={1.5} xs={12} md={4}>
              <Typography variant="subtitle2">Web Address</Typography>
              <RHFTextField name="webAddress" placeholder="https://www.office.com..." />
            </Grid>
          </Grid>

          <Grid container spacing={1.5} sx={{ p: 2 }}>
            <Grid spacing={1.5} xs={12} md={4}>
              <Typography variant="subtitle2">Phone</Typography>
              <RHFTextField name="Phone" placeholder="+1 234567890..." />
            </Grid>
            <Grid spacing={1.5} xs={12} md={4}>
              <Typography variant="subtitle2">Fax</Typography>
              <RHFTextField name="fax" placeholder="123450..." />
            </Grid>
            <Grid spacing={1.5} xs={12} md={4}>
              <Typography variant="subtitle2">Zip Code</Typography>
              <RHFTextField name="zip" placeholder="781211..." />
            </Grid>
          </Grid>
        </Card>
      </Grid>

      {/* Membership Information */}

      <Grid xs={12} md={12}>
        {/* <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Title, short description, image...
          </Typography> */}
        <Card>
          {/* {!mdUp && <CardHeader title="Details" />} */}
          <Typography variant="h6" sx={{ p: 2, my: 0.5, borderBottom: '1px solid #e0e0e0' }}>
            Membership Information
          </Typography>
          {/* <Grid> */}
          <Grid spacing={1.5} xs={12} md={4}>
            <Typography variant="subtitle2">Membership</Typography>
            <RHFAutocomplete
              name="Membership"
              autoHighlight
              placeholder="Silver"
              options={_roles.map((option) => option)}
              getOptionLabel={(option) => option}
              renderOption={(props, option) => (
                <li {...props} key={option}>
                  {option}
                </li>
              )}
            />
          </Grid>
          {/* </Grid> */}
        </Card>
      </Grid>

      {/* Contact Information */}

      <Grid xs={12} md={12}>
        {/* <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Title, short description, image...
          </Typography> */}
        <Card>
          {/* {!mdUp && <CardHeader title="Contact Information" />} */}
          <Typography variant="h6" sx={{ p: 2, my: 0.5, borderBottom: '1px solid #e0e0e0' }}>
            Contact Information
          </Typography>
          <Grid container spacing={1.5} sx={{ p: 2 }}>
            <Grid spacing={1.5} xs={12} md={4}>
              <Typography variant="subtitle2">Contact Type</Typography>
              <RHFAutocomplete
                name="Contact_Type_ID"
                autoHighlight
                placeholder=""
                options={contactTypes.map((option) => option)}
                getOptionLabel={(option) => option}
                renderOption={(props, option) => (
                  <li {...props} key={option}>
                    {option}
                  </li>
                )}
              />
            </Grid>
            <Grid spacing={1.5} xs={12} md={4}>
              <Typography variant="subtitle2">Title</Typography>
              <RHFTextField name="title" placeholder="Title..." />
            </Grid>
            <Grid spacing={1.5} xs={12} md={4}>
              <Typography variant="subtitle2">Name</Typography>
              <RHFTextField name="contactName" placeholder="John Doe..." />
            </Grid>
          </Grid>

          <Grid container spacing={1.5} sx={{ p: 2 }}>
            <Grid spacing={1.5} xs={12} md={4}>
              <Typography variant="subtitle2">Job Title</Typography>
              <RHFAutocomplete
                name="JobTitle"
                autoHighlight
                placeholder="Developer"
                options={_roles.map((option) => option)}
                getOptionLabel={(option) => option}
                renderOption={(props, option) => (
                  <li {...props} key={option}>
                    {option}
                  </li>
                )}
              />
            </Grid>
            <Grid spacing={1.5} xs={12} md={4}>
              <Typography variant="subtitle2">Mobile Number</Typography>
              <RHFTextField name="Mobile" placeholder="+1 234567890..." />
            </Grid>
            <Grid spacing={1.5} xs={12} md={4}>
              <Typography variant="subtitle2">Email</Typography>
              <RHFTextField name="email" type="email" placeholder="john@mail.com..." />
            </Grid>
          </Grid>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 2.5, pb: 1.5 }}>
            <Button variant="contained" color="primary">
              Add More
            </Button>
          </Box>
          <Box sx={{ px: 2.5, pb: 1.5 }}>
            <CustomTable />
          </Box>
        </Card>
      </Grid>

      {/* Supply Chain */}

      <Grid xs={12} md={12}>
        {/* <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Title, short description, image...
          </Typography> */}
        <Card>
          {/* {!mdUp && <CardHeader title="Supply Chain" />} */}
          <Typography variant="h6" sx={{ p: 2, my: 0.5, borderBottom: '1px solid #e0e0e0' }}>
            Supply Chain
          </Typography>
          <Box sx={{ px: 2.5, pb: 1.5 }}>
            <CustomTable />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 2.5, pb: 1.5 }}>
            <Button variant="contained" color="primary">
              Add More
            </Button>
          </Box>
        </Card>
      </Grid>

      {/* Reference & Attachment */}

      <Grid xs={12} md={12}>
        <Card>
          {/* {!mdUp && <CardHeader title=" Reference & Attachment" />} */}
          <Typography variant="h6" sx={{ p: 2, my: 0.5, borderBottom: '1px solid #e0e0e0' }}>
            Reference & Attachment
          </Typography>
          <Grid container spacing={1.5} sx={{ p: 2 }}>
            <Grid spacing={1.5} xs={12} md={4}>
              <Typography variant="subtitle2">Document</Typography>
              <RHFAutocomplete
                name="Document"
                autoHighlight
                placeholder="Document"
                options={_roles.map((option) => option)}
                getOptionLabel={(option) => option}
                renderOption={(props, option) => (
                  <li {...props} key={option}>
                    {option}
                  </li>
                )}
              />
              <Typography variant="subtitle2">Description</Typography>
              <RHFTextField name="Description" placeholder="File Name..." />
              <UploadBox sx={{ width: '100%', height: '200px' }} />
            </Grid>
            <Grid spacing={1.5} xs={12} md={8}>
              <CustomTable />
            </Grid>
          </Grid>
        </Card>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 1.5,

            mt: 2,
          }}
        >
          <Button variant="contained" color="primary">
            Save
          </Button>
          <Button variant="contained" color="primary">
            Cancel
          </Button>
        </Box>
      </Grid>
    </>
  );

  const renderProperties = (
    <>
      {/* {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Properties
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Additional functions and attributes...
          </Typography>
        </Grid>
      )} */}

      <Grid xs={12} md={12}>
        <Typography variant="h6" sx={{ mb: 0.5 }}>
          Contact Information
        </Typography>
        {/* <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Additional functions and attributes...
        </Typography> */}
        <Card>
          <Grid spacing={1.5} xs={12} md={12}>
            {!mdUp && <CardHeader title="Contact Information" />}
          </Grid>

          <Stack spacing={3} sx={{ p: 3 }}>
            <Stack spacing={1}>
              <Typography variant="subtitle2">Employment type</Typography>
              <RHFMultiCheckbox
                row
                spacing={4}
                name="employmentTypes"
                options={JOB_EMPLOYMENT_TYPE_OPTIONS}
              />
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle2">Experience</Typography>
              <RHFRadioGroup row spacing={4} name="experience" options={JOB_EXPERIENCE_OPTIONS} />
            </Stack>

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Role</Typography>
              <RHFAutocomplete
                name="role"
                autoHighlight
                placeholder="Member"
                options={_roles.map((option) => option)}
                getOptionLabel={(option) => option}
                renderOption={(props, option) => (
                  <li {...props} key={option}>
                    {option}
                  </li>
                )}
              />
            </Stack>

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Skills</Typography>
              <RHFAutocomplete
                name="skills"
                placeholder="+ Skills"
                multiple
                disableCloseOnSelect
                options={JOB_SKILL_OPTIONS.map((option) => option)}
                getOptionLabel={(option) => option}
                renderOption={(props, option) => (
                  <li {...props} key={option}>
                    {option}
                  </li>
                )}
                renderTags={(selected, getTagProps) =>
                  selected.map((option, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      key={option}
                      label={option}
                      size="small"
                      color="info"
                      variant="soft"
                    />
                  ))
                }
              />
            </Stack>

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Working schedule</Typography>
              <RHFAutocomplete
                name="workingSchedule"
                placeholder="+ Schedule"
                multiple
                disableCloseOnSelect
                options={JOB_WORKING_SCHEDULE_OPTIONS.map((option) => option)}
                getOptionLabel={(option) => option}
                renderOption={(props, option) => (
                  <li {...props} key={option}>
                    {option}
                  </li>
                )}
                renderTags={(selected, getTagProps) =>
                  selected.map((option, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      key={option}
                      label={option}
                      size="small"
                      color="info"
                      variant="soft"
                    />
                  ))
                }
              />
            </Stack>

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Locations</Typography>
              <RHFAutocomplete
                name="locations"
                type="country"
                placeholder="+ Locations"
                multiple
                options={countries.map((option) => option.label)}
                getOptionLabel={(option) => option}
              />
            </Stack>

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Expired</Typography>
              <Controller
                name="expiredDate"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    {...field}
                    format="dd/MM/yyyy"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!error,
                        helperText: error?.message,
                      },
                    }}
                  />
                )}
              />
            </Stack>

            <Stack spacing={2}>
              <Typography variant="subtitle2">Salary</Typography>

              <Controller
                name="salary.type"
                control={control}
                render={({ field }) => (
                  <Box gap={2} display="grid" gridTemplateColumns="repeat(2, 1fr)">
                    {[
                      {
                        label: 'Hourly',
                        icon: <Iconify icon="solar:clock-circle-bold" width={32} sx={{ mb: 2 }} />,
                      },
                      {
                        label: 'Custom',
                        icon: <Iconify icon="solar:wad-of-money-bold" width={32} sx={{ mb: 2 }} />,
                      },
                    ].map((item) => (
                      <Paper
                        component={ButtonBase}
                        variant="outlined"
                        key={item.label}
                        onClick={() => field.onChange(item.label)}
                        sx={{
                          p: 2.5,
                          borderRadius: 1,
                          typography: 'subtitle2',
                          flexDirection: 'column',
                          ...(item.label === field.value && {
                            borderWidth: 2,
                            borderColor: 'text.primary',
                          }),
                        }}
                      >
                        {item.icon}
                        {item.label}
                      </Paper>
                    ))}
                  </Box>
                )}
              />

              <RHFTextField
                name="salary.price"
                placeholder="0.00"
                type="number"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box sx={{ typography: 'subtitle2', color: 'text.disabled' }}>$</Box>
                    </InputAdornment>
                  ),
                }}
              />
              <RHFSwitch name="salary.negotiable" label="Salary is negotiable" />
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle2">Benefits</Typography>
              <RHFMultiCheckbox
                name="benefits"
                options={JOB_BENEFIT_OPTIONS}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                }}
              />
            </Stack>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderActions = (
    <>
      {mdUp && <Grid md={4} />}
      <Grid xs={12} md={8} sx={{ display: 'flex', alignItems: 'center' }}>
        <FormControlLabel
          control={<Switch defaultChecked />}
          label="Publish"
          sx={{ flexGrow: 1, pl: 3 }}
        />

        <LoadingButton
          type="submit"
          variant="contained"
          size="large"
          loading={isSubmitting}
          sx={{ ml: 2 }}
        >
          {!currentCustomer ? 'Create Customer' : 'Save Changes'}
        </LoadingButton>
      </Grid>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {renderDetails}

        {/* {renderProperties}

        {renderActions} */}
      </Grid>
    </FormProvider>
  );
}

CustomerNewEditForm.propTypes = {
  currentCustomer: PropTypes.object,
};
