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
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';
import Scrollbar from 'src/components/scrollbar';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { countries } from 'src/assets/data';
// import IncrementDecrementInput from 'src/components/IncrementDecrementInput';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFAutocomplete } from 'src/components/hook-form';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { decryptObjectKeys } from 'src/utils/getDecryption';
import { Get, Post, Put } from 'src/utils/AxiosHelper';
import { getDecryptedUserData } from 'src/utils/getUser';
import { decrypt, encrypt } from 'src/api/encryption';

// ----------------------------------------------------------------------

function getCurrentDate() {
  const today = new Date();

  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const year = today.getFullYear();

  return `${day}/${month}/${year}`;
}

export default function NonCompliantRatingNewEditForm({ currentNonCompliantRating }) {
  const router = useRouter();
  const userData = getDecryptedUserData();

  const [Supplier, setSupplier] = useState([]);
  const [CertificateType, setCertificateType] = useState([]);
  const [CountryData, setCountryData] = useState([]);
  const [PA, setPA] = useState([]);
  const [isPosting, setIsPosting] = useState(false);
  const [tableData, setTableData] = useState([]);

  const { enqueueSnackbar } = useSnackbar();

  const NewNonCompliantRatingSchema = Yup.object().shape({
    VenderLibraryID: Yup.string().required('Law is required'),
    CertificateID: Yup.string().required('Certificate Type is required'),
    CountryID: Yup.string().required('Country is required'),
  });

  const GetRiskAnalysisNonCompliantRatingList = async () => {
    try {
      const res = await Get(`GetNonComplaintRiskAnalysisList`);
      const decryptedData = decryptObjectKeys(res.data.ServiceRes);
      const transformData = (data) => {
        const groupedData = {};

        data.forEach((item) => {
          const key = `${item.VenderName}-${item.Certificate}`;

          if (!groupedData[key]) {
            groupedData[key] = {
              NonComplaintRiskAnalysisgMstID: item.NonComplaintRiskAnalysisgMstID,
              VenderName: item.VenderName,
              CountryName: item.CountryName,
              Certificate: item.Certificate,
            };
          }

          // Add each Name as a key and Rate as the value
          groupedData[key][item.Name.trim()] = item.Rate;
        });

        return Object.values(groupedData);
      };

      const newData = transformData(decryptedData);
      setTableData(newData);
    } catch (error) {
      console.error(error);
    }
  };

  const GetCountryData = async () => {
    try {
      const res = await Get(`GetCountry_Suppliers`);
      const decryptedData = decryptObjectKeys(res.data.ServiceRes);
      setCountryData(decryptedData); // Assuming you're setting the filtered data here
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetch = async () => {
      await GetCountryData();
      await GetRiskAnalysisNonCompliantRatingList();
      if (currentNonCompliantRating?.length > 0) {
        setPA(currentNonCompliantRating);
      }
    };
    fetch();
  }, []);

  // Handle rate change
  const handleRateChange = (index, value) => {
    const updatedPA = [...PA];
    updatedPA[index].Rate = value; // Update the Rate value
    setPA(updatedPA); // Update the state with the new Rate
  };

  const defaultValues = useMemo(
    () => ({
      VenderLibraryID: currentNonCompliantRating
        ? currentNonCompliantRating[0]?.VenderLibraryID
        : '',
      CertificateID: currentNonCompliantRating ? currentNonCompliantRating[0]?.CertificateID : '',
      CountryID: currentNonCompliantRating ? currentNonCompliantRating[0]?.CountryID : '',
      UserID: currentNonCompliantRating
        ? currentNonCompliantRating[0]?.UserID
        : userData[0]?.UserID,

      // currentDate: currentDate,
    }),
    [currentNonCompliantRating]
  );

  const methods = useForm({
    resolver: yupResolver(NewNonCompliantRatingSchema),
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

  useEffect(() => {
    const GetSuppliers = async () => {
      try {
        const res = await Get(`GetSupplierByCertificate?CountryID=${values?.CountryID}`);
        const decryptedData = decryptObjectKeys(res.data.ServiceRes);
        setSupplier(decryptedData);
        // getAttachmentDocList();
      } catch (error) {
        console.error(error);
      }
    };

    GetSuppliers();
  }, [values?.CountryID]);

  useEffect(() => {
    const GetCertificate = async () => {
      try {
        const res = await Get(`GetSuppliersCertificate?VenderID=${values?.VenderLibraryID}`);
        const decryptedData = decryptObjectKeys(res.data.ServiceRes);
        setCertificateType(decryptedData);
      } catch (error) {
        console.error(error);
      }
    };

    GetCertificate();
  }, [values?.VenderLibraryID]);

  const InsertNonCompliantMst = async () => {
    const InsertMstData = {
      CountryID: values?.CountryID,
      VenderLibraryID: values?.VenderLibraryID,
      CertificateID: values?.CertificateID,
      UserID: values?.UserID,
    };

    const UpdateMstData = {
      NonComplaintRiskAnalysisgMstID:
        currentNonCompliantRating && currentNonCompliantRating[0]?.NonComplaintRiskAnalysisgMstID,
      CountryID: values?.CountryID,
      VenderLibraryID: values?.VenderLibraryID,
      CertificateID: values?.CertificateID,
    };

    const encryptedInsertNonCompliantMst = Object.assign(
      {},
      ...Object.keys(InsertMstData).map((key) => ({
        [key]: encrypt(InsertMstData[key]),
      }))
    );
    const encryptedUpdateNonCompliantMst = Object.assign(
      {},
      ...Object.keys(UpdateMstData).map((key) => ({
        [key]: encrypt(UpdateMstData[key]),
      }))
    );

    setIsPosting(true);
    try {
      const res = currentNonCompliantRating
        ? await Put(`UpdateNonComplaintRiskAnalysisgMst`, encryptedUpdateNonCompliantMst)
        : await Post(`InsertNonComplaintRiskAnalysisgMst`, encryptedInsertNonCompliantMst);
      if (res.data.ResponseCode == '100') {
        const InsertPADetails = PA?.map((item) => ({
          NonComplaintRiskAnalysisgMstID: decrypt(
            res.data.ServiceRes[0]?.NonComplaintRiskAnalysisgMstID
          ),
          PerformanceAreaID: item.PerformanceAreaID,
          Rate: item.Rate || '0',
        }));

        const UpdatePADetails = PA?.map((item) => ({
          NonComplaintRiskAnalysisDtlID: item.NonComplaintRiskAnalysisDtlID,
          PerformanceAreaID: item.PerformanceAreaID,
          Rate: item.Rate || '0',
        }));

        const encryptedInsertPADetails = InsertPADetails.map((X) =>
          Object.assign(
            {},
            ...Object.keys(X).map((key) => ({
              [key]: encrypt(X[key]),
            }))
          )
        );
        const encryptedUpdatePADetails = UpdatePADetails.map((X) =>
          Object.assign(
            {},
            ...Object.keys(X).map((key) => ({
              [key]: encrypt(X[key]),
            }))
          )
        );

        try {
          const res = currentNonCompliantRating
            ? await Put(`UpdateNonComplaintRiskAnalysisgDtl`, encryptedUpdatePADetails)
            : await Post(`InsertNonComplaintRiskAnalysisgDtl`, encryptedInsertPADetails);
          if (res.data.ResponseCode == '100') {
            currentNonCompliantRating
              ? enqueueSnackbar(' Non-Compliant Risk Updated Successfully!', { variant: 'success' })
              : enqueueSnackbar('Non-Compliant Risk Added Successfully!', { variant: 'success' });

            router.push('/dashboard/RiskAnalysis/RiskFactor/NonCompliantRisk/rating/');
          } else {
            console.log('res', res.data.ServiceRes);
            enqueueSnackbar('There was an error processing your request!', { variant: 'error' });
          }
        } catch (error) {
          console.error('error in NonCompliant risk details', error);
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
    // const country = CountryData.find((item) => item.Country_id === data.CountryID);
    const vender = Supplier?.find((item) => item?.VenderLibraryID === data?.VenderLibraryID);
    const certificate = CertificateType?.find(
      (item) => item?.CertificateID === data?.CertificateID
    );

    // const countryName = country.CountryName;
    const venderName = vender?.VenderName;
    const certificateName = certificate?.CertificateName;

    // Check if the combination of CountryName and Initiative already exists in tableData
    const isDuplicate = tableData.some(
      (item) =>
        // item.CountryName === countryName &&
        item.VenderName === venderName && item?.CertificateName === certificateName
    );

    if (isDuplicate) {
      enqueueSnackbar('This certificate of the supplier already exists!', {
        variant: 'error',
      });
      setPA([]);
      return; // Stop further execution if a duplicate is found
    }
    try {
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
              Risk Analysis NonCompliant Rating{' '}
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
                name="CountryID"
                control={control}
                defaultValue=""
                render={({ field, fieldState: { error } }) => (
                  <RHFAutocomplete
                    {...field}
                    options={CountryData}
                    getOptionLabel={(option) => option.CountryName || ''}
                    isOptionEqualToValue={(option, value) => option.CountryID === value}
                    value={CountryData.find((init) => init.CountryID === field.value) || null}
                    onChange={(event, newValue) => {
                      field.onChange(newValue ? newValue.CountryID : '');
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
              <Controller
                name="VenderLibraryID"
                control={control}
                defaultValue=""
                render={({ field, fieldState: { error } }) => (
                  <RHFAutocomplete
                    {...field}
                    options={Supplier}
                    getOptionLabel={(option) => option.VenderName || ''}
                    isOptionEqualToValue={(option, value) => option.VenderLibraryID === value}
                    value={Supplier.find((init) => init.VenderLibraryID === field.value) || null}
                    onChange={(event, newValue) => {
                      field.onChange(newValue ? newValue.VenderLibraryID : '');
                      setPA([]);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Supplier"
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
                name="CertificateID"
                control={control}
                defaultValue=""
                render={({ field, fieldState: { error } }) => (
                  <RHFAutocomplete
                    {...field}
                    options={CertificateType}
                    getOptionLabel={(option) => option.Certificate || ''}
                    isOptionEqualToValue={(option, value) => option.CertificateID === value}
                    value={
                      CertificateType.find((init) => init.CertificateID === field.value) || null
                    }
                    onChange={(event, newValue) => {
                      field.onChange(newValue ? newValue.CertificateID : '');
                      setPA([]);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Certificate"
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
                    ? InsertNonCompliantMst()
                    : enqueueSnackbar('Please add performance areas', { variant: 'error' });
                }}
              >
                {!currentNonCompliantRating ? 'Save Changes' : 'Save Changes'}
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

NonCompliantRatingNewEditForm.propTypes = {
  currentNonCompliantRating: PropTypes.object,
};
