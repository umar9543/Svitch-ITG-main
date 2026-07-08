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
  Radio,
  RadioGroup,
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
import { decrypt, encrypt } from 'src/api/encryption';
import Iconify from 'src/components/iconify';
import { mt } from 'date-fns/locale';

// ----------------------------------------------------------------------

function getCurrentDate() {
  const today = new Date();

  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const year = today.getFullYear();

  return `${day}/${month}/${year}`;
}

export default function CountryRatingNewEditForm({ currentCountryRating }) {
  const router = useRouter();
  const userData = getDecryptedUserData();
  const userID = userData[0]?.UserID;

  const [Initiative, setInitiative] = useState([]);
  const [CountryData, setCountryData] = useState([]);
  const [PA, setPA] = useState([]);
  const [isPosting, setIsPosting] = useState(false);
  const [tableData, setTableData] = useState([]);

  // const [FormData, setFormData] = useState({});

  const { enqueueSnackbar } = useSnackbar();

  const NewCountryRatingSchema = Yup.object().shape({
    // InitiativeDatabaseID: Yup.string().required('InitiativeDatabaseID is required'),
    InitiativeDatabaseID: Yup.string().required('Laws is required'),
    // LawDescription: Yup.string().required('LawDescription is required'),
    // Notes: Yup.string().required('Notes is required'),
    CountryID: Yup.string().required('Country is required'),
  });

  const GetInitiatives = async () => {
    try {
      const res = await Get(`GetInitiativeDatabase`);
      const decryptedData = decryptObjectKeys(res.data.ServiceRes);
      setInitiative(decryptedData);
      // getAttachmentDocList();
    } catch (error) {
      console.error(error);
    }
  };

  const GetCountryData = async () => {
    try {
      const res = await Get(`GetCountry?UserID=225`);
      const decryptedData = decryptObjectKeys(res.data.ServiceRes);
      // Properly filter the countries
      const filteredData = decryptedData.filter((item) =>
        [
          'CHINA',
          'TAIWAN',
          'HONG KONG',
          'MACAU', //Macao
          'JAPAN',
          'KOREA, SOUTH',
          'GERMANY',
          'FRANCE',
          'AUSTRIA',
          'NETHERLANDS',
        ].includes(item.CountryName)
      );

      setCountryData(filteredData); // Assuming you're setting the filtered data here
    } catch (error) {
      console.error(error);
    }
  };

  const GetRiskAnalysisCountryRatingList = async () => {
    try {
      const res = await Get(`GetRiskAnalysisCountryRatingList`);
      const decryptedData = decryptObjectKeys(res.data.ServiceRes);
      setTableData(decryptedData);
      // getAttachmentDocList();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    GetInitiatives();
    GetCountryData();
    GetRiskAnalysisCountryRatingList();
    if (currentCountryRating?.length > 0) {
      setPA(currentCountryRating);
    }
  }, []);

  // Handle rate change
  const handleRateChange = (index, value) => {
    const updatedPA = [...PA];
    updatedPA[index].Rate = value; // Update the Rate value
    setPA(updatedPA); // Update the state with the new Rate
  };

  const defaultValues = useMemo(
    () => ({
      // InitiativeDatabaseID: currentCountryRating?.InitiativeDatabaseID || '',
      InitiativeDatabaseID: currentCountryRating
        ? currentCountryRating[0]?.InitiativeDatabaseID
        : '',
      CountryID: currentCountryRating ? currentCountryRating[0]?.CountryID : '',
      // Notes: currentCountryRating?.Notes || '',
      // InitiativeDatabaseID: currentCountryRating?.InitiativeDatabaseID || '',

      // currentDate: currentDate,
    }),
    [currentCountryRating]
  );

  const methods = useForm({
    resolver: yupResolver(NewCountryRatingSchema),
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

  const InsertCountryMst = async () => {
    const InsertMstData = {
      UserID: userID || '',
      CountryID: values?.CountryID,
      InitiativeDatabaseID: values?.InitiativeDatabaseID,
    };

    const UpdateCountryMst = {
      RiskAnalysisCountryRateingMstID:
        currentCountryRating && currentCountryRating[0]?.RiskAnalysisCountryRateingMstID,
      InitiativeDatabaseID: values?.InitiativeDatabaseID,
      CountryID: values?.CountryID,
    };

    const encryptedInsertCountryMst = Object.assign(
      {},
      ...Object.keys(InsertMstData).map((key) => ({
        [key]: encrypt(InsertMstData[key]),
      }))
    );
    const encryptedUpdateCountryMst = Object.assign(
      {},
      ...Object.keys(UpdateCountryMst).map((key) => ({
        [key]: encrypt(UpdateCountryMst[key]),
      }))
    );

    setIsPosting(true);
    try {
      const res = currentCountryRating
        ? await Put(`updateRiskAnalysisCountryRateingMst`, encryptedUpdateCountryMst)
        : await Post(`InsertRiskAnalysisCountryRateingMst`, encryptedInsertCountryMst);
      if (res.data.ResponseCode == '100') {
        const InsertPADetails = PA?.map((item) => ({
          RiskAnalysisCountryRateingMstID: decrypt(
            res.data.ServiceRes[0]?.RiskAnalysisCountryRateingMstID
          ),
          PerformanceAreaID: item.PerformanceAreaID,
          Rate: item?.Rate || '0',
        }));

        const UpdatePADetail = PA?.map((item) => ({
          RiskAnalysisCountryRateingDtlID: item.RiskAnalysisCountryRateingDtlID,
          PerformanceAreaID: item.PerformanceAreaID,
          Rate: item?.Rate || '0',
        }));

        const encryptedInsertPADetails = InsertPADetails.map((X) =>
          Object.assign(
            {},
            ...Object.keys(X).map((key) => ({
              [key]: encrypt(X[key]),
            }))
          )
        );
        const encryptedUpdatePADetails = UpdatePADetail.map((X) =>
          Object.assign(
            {},
            ...Object.keys(X).map((key) => ({
              [key]: encrypt(X[key]),
            }))
          )
        );
        try {
          const res = currentCountryRating
            ? await Put(`updateRiskAnalysisCountryRateingDtl`, encryptedUpdatePADetails)
            : await Post(`InsertRiskAnalysisCountryRateingDtl`, encryptedInsertPADetails);
          if (res.data.ResponseCode == '100') {
            currentCountryRating
              ? enqueueSnackbar('Country Risk Updated Successfully!', { variant: 'success' })
              : enqueueSnackbar('Country Risk Added Successfully!', { variant: 'success' });
            router.push('/dashboard/RiskAnalysis/RiskFactor/CountryRisk/rating/');
          } else {
            console.log('res', res.data.ServiceRes);
            enqueueSnackbar('There was an error processing your request!', { variant: 'error' });
          }
        } catch (error) {
          console.error('error in country risk details', error);
        }
      } else {
        console.log('res', res.data.ServiceRes);
        enqueueSnackbar('There was an error processing your request!', { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar('There was an error processing your request!', { variant: 'error' });
      console.error(error);
    } finally {
      setIsPosting(false);
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    // Check if the combination of CountryName and Initiavtive already exists in tableData

    const country = CountryData.find((item) => item.Country_id === data.CountryID);
    const initiative = Initiative.find(
      (item) => item.InitiativeDatabaseID === data.InitiativeDatabaseID
    );

    const countryName = country.CountryName;
    const initiativeName = initiative.Initiavtive;

    // Check if the combination of CountryName and Initiative already exists in tableData
    const isDuplicate = tableData.some(
      (item) => item.CountryName === countryName && item.Initiavtive === initiativeName
    );

    if (isDuplicate) {
      enqueueSnackbar('This Law and Country combination already exists!', {
        variant: 'error',
      });
      setPA([]);
      return; // Stop further execution if a duplicate is found
    }

    try {
      // setFormData(data);
      const res = await Get(`GetPerformanceArea`);
      if (res.data.ResponseCode == '100') {
        const Pa = decryptObjectKeys(res.data.ServiceRes);
        const updatedPA = Pa.map((item) => ({
          ...item,
          Rate: '0', // Add the "Rate" field with an initial empty string value
        }));
        setPA(updatedPA);
      } else {
        enqueueSnackbar('No Performance Area Found!', { variant: 'error' });
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
            {/* <Typography variant="h6" gutterBottom>
              Risk Analysis Country Rating{' '}
            </Typography> */}
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
                      setPA([]);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Laws"
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
                name="CountryID"
                control={control}
                defaultValue=""
                render={({ field, fieldState: { error } }) => (
                  <RHFAutocomplete
                    {...field}
                    options={CountryData}
                    getOptionLabel={(option) => option.CountryName || ''}
                    isOptionEqualToValue={(option, value) => option.Country_id === value}
                    value={CountryData.find((init) => init.Country_id === field.value) || null}
                    onChange={(event, newValue) => {
                      field.onChange(newValue ? newValue.Country_id : '');
                      setPA([]);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Country"
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
            <Box sx={{ display: 'flex', justifyContent: 'end' }}>
              <Button
                color="primary"
                variant="contained"
                sx={{ mt: 2 }}
                type="submit"
                loading={isSubmitting}
              >
                Add
              </Button>
            </Box>
            <Scrollbar sx={{ my: 3 }}>
              <TableContainer>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell align="left">Performance Area (PA)</TableCell>
                        <TableCell align="center">Rate</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {PA.map((item, index) => (
                        <TableRow key={item.PerformanceAreaID}>
                          <TableCell align="left">{item.Name}</TableCell>
                          <TableCell align="center">
                            <TextField
                              placeholder="0-5"
                              variant="outlined"
                              type="number"
                              value={item.Rate}
                              onChange={(e) => handleRateChange(index, e.target.value)} // Update Rate when TextField changes
                              sx={{ '& input': { textAlign: 'center' }, width: 100 }}
                              inputProps={{
                                min: 0,
                                max: 5,
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </TableContainer>
            </Scrollbar>
            {PA.length > 0 && (
              <Typography
                variant="caption"
                sx={{
                  display: 'inline-block',
                  mt: 2,
                  color: 'red',
                  textAlign: 'center',
                  width: '100%',
                }}
              >
                *If the rate is not provided, it will be considered as 0.
              </Typography>
            )}
          </Card>

          <Stack alignItems="flex-end" sx={{ mt: 3 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                gridColumn: 'span 2',
                gap: 2,
              }}
            >
              <LoadingButton
                // type="submit"
                variant="contained"
                color="primary"
                loading={isPosting}
                onClick={() => {
                  PA.length > 0
                    ? InsertCountryMst()
                    : enqueueSnackbar('Please add performance areas', { variant: 'error' });
                }}
              >
                {!currentCountryRating ? 'Save Changes' : 'Save Changes'}
              </LoadingButton>
              <Button variant="contained" color="primary">
                Cancel
              </Button>
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
CountryRatingNewEditForm.propTypes = {
  currentCountryRating: PropTypes.object,
};
