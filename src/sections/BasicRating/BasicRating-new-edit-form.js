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

export default function BasicRatingNewEditForm({ currentBasicRating }) {
  const router = useRouter();
  const userData = getDecryptedUserData();

  const [Initiative, setInitiative] = useState([]);
  const [BasicType, setBasicType] = useState([]);
  const [CountryData, setCountryData] = useState([]);
  const [PA, setPA] = useState([]);
  const [isPosting, setIsPosting] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const NewBasicRatingSchema = Yup.object().shape({
    InitiativeDatabaseID: Yup.string().required('Law is required'),
    BasicTypeID: Yup.string().required('Basic Type is required'),
    CountryID: Yup.string().required('Country is required'),
  });

  const GetInitiatives = async () => {
    try {
      const res = await Get(`GetInitiativeDatabase`);
      const decryptedData = decryptObjectKeys(res.data.ServiceRes);
      setInitiative(decryptedData);
      // console.log('decryptedCustomerData', decryptedData);
      // getAttachmentDocList();
    } catch (error) {
      console.error(error);
    }
  };

  const GetBasicType = async () => {
    try {
      const res = await Get(`GetBasicType?UserID=${userData[0]?.UserID}`);
      const decryptedData = decryptObjectKeys(res.data.ServiceRes);
      setBasicType(decryptedData);
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

      console.log('Filtered Country Data:', filteredData);
      setCountryData(filteredData); // Assuming you're setting the filtered data here
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    GetInitiatives();
    GetBasicType();
    GetCountryData();
  }, []);

  // Handle rate change
  const handleRateChange = (index, value) => {
    const updatedPA = [...PA];
    updatedPA[index].Rate = value; // Update the Rate value
    setPA(updatedPA); // Update the state with the new Rate
  };

  const defaultValues = useMemo(
    () => ({
      InitiativeDatabaseID: currentBasicRating?.InitiativeDatabaseID || '',
      BasicTypeID: currentBasicRating?.BasicTypeID || '',
      CountryID: currentBasicRating?.CountryID || '',
      UserID: currentBasicRating?.UserID || userData[0]?.UserID,

      // currentDate: currentDate,
    }),
    [currentBasicRating]
  );

  const methods = useForm({
    resolver: yupResolver(NewBasicRatingSchema),
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

  const InsertBasicMst = async () => {
    console.log('FormData', values);
    const InsertMstData = {
      InitiativeDatabaseID: values?.InitiativeDatabaseID,
      BasicTypeID: values?.BasicTypeID,
      CountryID: values?.CountryID,
      UserID: values?.UserID,
    };

    const encryptedInsertBasicMst = Object.assign(
      {},
      ...Object.keys(InsertMstData).map((key) => ({
        [key]: encrypt(InsertMstData[key]),
      }))
    );

    console.log('InsertMstData', InsertMstData);

    setIsPosting(true);
    try {
      const res = await Post(`InsertRiskAnalysisBasicRateingMst`, encryptedInsertBasicMst);
      if (res.data.ResponseCode == '100') {
        console.log('res', res.data.ServiceRes);
        const InsertPADetails = PA?.map((item) => ({
          RiskAnalysisBasicRateingMstID: decrypt(
            res.data.ServiceRes[0]?.RiskAnalysisBasicRateingMstID
          ),
          PerformanceAreaID: item.PerformanceAreaID,
          Rate: item.Rate,
        }));

        console.log('InsertPADetails', InsertPADetails);
        const encryptedInsertPADetails = InsertPADetails.map((X) =>
          Object.assign(
            {},
            ...Object.keys(X).map((key) => ({
              [key]: encrypt(X[key]),
            }))
          )
        );
        try {
          const res = await Post(`InsertRiskAnalysisBasicRateingDtl`, encryptedInsertPADetails);
          if (res.data.ResponseCode == '100') {
            enqueueSnackbar('Basic Risk Added Successfully!', { variant: 'success' });
            router.push('/dashboard/RiskAnalysis/RiskFactor/BasicRisk/rating/');
          } else {
            console.log('res', res.data.ServiceRes);
            enqueueSnackbar('There was an error processing your request!', { variant: 'error' });
          }
        } catch (error) {
          console.error('error in Basic risk details', error);
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
    try {
      console.log('data', data);
      const res = await Get(`GetPerformanceArea`);
      if (res.data.ResponseCode == '100') {
        console.log(decryptObjectKeys(res.data.ServiceRes));
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
              Risk Analysis Basic Rating{' '}
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
                name="BasicTypeID"
                control={control}
                defaultValue=""
                render={({ field, fieldState: { error } }) => (
                  <RHFAutocomplete
                    {...field}
                    options={BasicType}
                    getOptionLabel={(option) => option.BasicName || ''}
                    isOptionEqualToValue={(option, value) => option.BasicTypeID === value}
                    value={BasicType.find((init) => init.BasicTypeID === field.value) || null}
                    onChange={(event, newValue) => {
                      field.onChange(newValue ? newValue.BasicTypeID : '');
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Basic"
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
                    ? InsertBasicMst()
                    : enqueueSnackbar('Please add performance areas', { variant: 'error' });
                }}
              >
                {!currentBasicRating ? 'Save Changes' : 'Save Changes'}
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

BasicRatingNewEditForm.propTypes = {
  currentBasicRating: PropTypes.object,
};
