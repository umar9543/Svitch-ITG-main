'use client';
import React, { useEffect } from 'react';
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
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import { decryptObjectKeys } from 'src/utils/getDecryption';
import { Get, Post, Put } from 'src/utils/AxiosHelper';
import { getDecryptedUserData } from 'src/utils/getUser';
import { encrypt } from 'src/api/encryption';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

function getCurrentDate() {
  const today = new Date();

  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const year = today.getFullYear();

  return `${day}/${month}/${year}`;
}

export default function FactorMappingNewEditForm({ currentFactorMapping }) {
  const router = useRouter();
  const userData = getDecryptedUserData();

  const [Initiative, setInitiative] = useState([]);

  const [tableData, setTableData] = useState([
    {
      id: '1',
      FactorName: 'FactorName',
      InitiativeName: 'InitiativeName',
      Law: 'Law',
    },
    {
      id: '2',
      FactorName: 'FactorName',
      InitiativeName: 'InitiativeName',
      Law: 'Law',
    },
  ]);

  const { enqueueSnackbar } = useSnackbar();

  const NewFactorMappingSchema = Yup.object().shape({
    // LawDatabaseID: Yup.string().required('LawDatabaseID is required'),
    LawNo: Yup.string().required('LawNo is required'),
    LawDescription: Yup.string().required('LawDescription is required'),
    Notes: Yup.string().required('Notes is required'),
    InitiativeDatabaseID: Yup.string().required('InitiativeDatabaseID is required'),
  });

  const GetInitiatives = async () => {
    try {
      const res = await Get(`GetInitiativeDatabase`);
      const decryptedData = decryptObjectKeys(res.data.ServiceRes);
      setInitiative(decryptedData);
      console.log('decryptedCustomerData', decryptedData);
      // getAttachmentDocList();
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    GetInitiatives();
  }, []);

  const defaultValues = useMemo(
    () => ({
      // LawDatabaseID: currentFactorMapping?.LawDatabaseID || '',
      LawNo: currentFactorMapping?.LawNo || '',
      LawDescription: currentFactorMapping?.LawDescription || '',
      Notes: currentFactorMapping?.Notes || '',
      InitiativeDatabaseID: currentFactorMapping?.InitiativeDatabaseID || '',

      // currentDate: currentDate,
    }),
    [currentFactorMapping]
  );

  const methods = useForm({
    resolver: yupResolver(NewFactorMappingSchema),
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
      const PostData = { ...data, UserID: currentFactorMapping?.UserID || userData[0].UserId };
      const UpdatedData = { ...data, LawDatabaseID: currentFactorMapping?.LawDatabaseID };

      currentFactorMapping
        ? console.log('UpdateLawDatabase', UpdatedData)
        : console.log('InsertLawDatabase', PostData);

      const encryptedPostData = Object.assign(
        {},
        ...Object.keys(PostData).map((key) => ({
          [key]: encrypt(PostData[key]),
        }))
      );
      const encryptedUpdatedData = Object.assign(
        {},
        ...Object.keys(UpdatedData).map((key) => ({
          [key]: encrypt(UpdatedData[key]),
        }))
      );

      if (currentFactorMapping) {
        const response = await Put(`UpdateLawDatabase`, encryptedUpdatedData);
        if (response.data.ResponseCode === '100') {
          enqueueSnackbar('Initiative Law successfully updated');
          reset();

          router.push(paths.dashboard.RiskAnalysis.FactorMapping.root);
        } else {
          enqueueSnackbar('Initiative Law update failed! Please try again.', { variant: 'error' });
        }
      } else {
        const response = await Post(`InsertLawDatabase`, encryptedPostData);
        if (response.data.ResponseCode === '100') {
          enqueueSnackbar('Initiative Law successfully created');
          reset();

          router.push(paths.dashboard.RiskAnalysis.FactorMapping.root);
        } else {
          enqueueSnackbar('Initiative Law creation failed! Please try again.', {
            variant: 'error',
          });
        }
      }
    } catch (error) {
      enqueueSnackbar('There was an error processing your request!', { variant: 'error' });
      console.error(error);
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              Add New FactorMapping
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

              <RHFTextField name="SiteManager" label="Site Manager" /> */}
              <RHFTextField name="FactorName" label="Factor Name" />
              <div></div>
              <Controller
                name="InitiativeDatabaseID"
                control={control}
                defaultValue=""
                render={({ field, fieldState: { error } }) => (
                  <RHFAutocomplete
                    {...field}
                    options={Initiative}
                    getOptionLabel={(option) => option.Initiavtive || ''}
                    isOptionEqualToValue={(option, value) => option.InitiativeDatabaseID === value}
                    value={
                      Initiative.find((init) => init.InitiativeDatabaseID === field.value) || null
                    }
                    onChange={(event, newValue) => {
                      field.onChange(newValue ? newValue.InitiativeDatabaseID : '');
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Initiative Name"
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
                name=""
                control={control}
                defaultValue=""
                render={({ field, fieldState: { error } }) => (
                  <RHFAutocomplete
                    {...field}
                    options={Initiative}
                    getOptionLabel={(option) => option.Initiavtive || ''}
                    isOptionEqualToValue={(option, value) => option.InitiativeDatabaseID === value}
                    value={
                      Initiative.find((init) => init.InitiativeDatabaseID === field.value) || null
                    }
                    onChange={(event, newValue) => {
                      field.onChange(newValue ? newValue.InitiativeDatabaseID : '');
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Law"
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
            <Scrollbar sx={{ my: 3 }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell align="left">No.</TableCell>
                      <TableCell align="left">Factor Name</TableCell>
                      <TableCell align="left">Initiative Name</TableCell>
                      <TableCell align="left">Law</TableCell>
                      <TableCell align="center">Remove</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tableData.map((row, index) => (
                      <TableRow>
                        <TableCell align="left">{row.id}</TableCell>
                        <TableCell align="left">{row.FactorName}</TableCell>
                        <TableCell align="left">{row.InitiativeName}</TableCell>
                        <TableCell align="left">{row.Law}</TableCell>
                        <TableCell align="center">
                          <IconButton color={'default'} sx={{ color: 'error.main' }}>
                            <Iconify icon="solar:trash-bin-trash-bold" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Scrollbar>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gridColumn: 'span 2' }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Iconify icon="mingcute:add-line" />}
              >
                Add
              </Button>
            </Box>
          </Card>
          <Stack alignItems="flex-end" sx={{ mt: 3 }}>
            <LoadingButton type="submit" variant="contained" color="primary" loading={isSubmitting}>
              {!currentFactorMapping ? 'Save Changes' : 'Save Changes'}
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

FactorMappingNewEditForm.propTypes = {
  currentFactorMapping: PropTypes.object,
};
