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

import { useRouter } from 'src/routes/hooks';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField, RHFAutocomplete } from 'src/components/hook-form';
import { TextField } from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import { decryptObjectKeys } from 'src/utils/getDecryption';
import { Get, Post, Put } from 'src/utils/AxiosHelper';
import { getDecryptedUserData } from 'src/utils/getUser';
import { encrypt } from 'src/api/encryption';
import Iconify from 'src/components/iconify';
import { mt } from 'date-fns/locale';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

function getCurrentDate() {
  const today = new Date();

  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const year = today.getFullYear();

  return `${day}/${month}/${year}`;
}

export default function NonCompliantRiskNewEditForm({ currentNonCompliantRisk }) {
  const router = useRouter();
  const userData = getDecryptedUserData();

  const [Initiative, setInitiative] = useState([]);
  const [CountryData, setCountryData] = useState([]);
  const [NonCompliantType, setNonCompliantType] = useState([]);

  const { enqueueSnackbar } = useSnackbar();

  const NewNonCompliantRiskSchema = Yup.object().shape({
    // LawDatabaseID: Yup.string().required('LawDatabaseID is required'),
    // LawNo: Yup.string().required('LawNo is required'),
    // Discription: Yup.string().required('Discription is required'),
    // Notes: Yup.string().required('Notes is required'),
    // InitiativeDatabaseID: Yup.string().required('InitiativeDatabaseID is required'),
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
  const GetNonCompliantType = async () => {
    try {
      const res = await Get(`GetNonCompliantType?UserID=${userData[0]?.UserID}`);
      const decryptedData = decryptObjectKeys(res.data.ServiceRes);
      setNonCompliantType(decryptedData);
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
    GetNonCompliantType();
    GetCountryData();
  }, []);

  const defaultValues = useMemo(
    () => ({
      CountryID: currentNonCompliantRisk?.CountryID || '',
      NonCompliantRisk: currentNonCompliantRisk?.NonCompliantRisk || '',
      Discription: currentNonCompliantRisk?.Discription || '',
      // currentDate: currentDate,
    }),
    [currentNonCompliantRisk]
  );

  const methods = useForm({
    resolver: yupResolver(NewNonCompliantRiskSchema),
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
      const PostData = { ...data, UserID: currentNonCompliantRisk?.UserID || userData[0].UserID };
      console.log('PostData', PostData);

      const encryptedPostData = Object.assign(
        {},
        ...Object.keys(PostData).map((key) => ({
          [key]: encrypt(PostData[key]),
        }))
      );

      const response = await Post(`InsertNonCompliantRisk`, encryptedPostData);
      if (response.data.ResponseCode === '100') {
        enqueueSnackbar('NonCompliant Risk added successfully');
        reset();
        router.push(paths.dashboard.RiskAnalysis.RiskFactor.NonCompliantRisk.root);
      } else {
        enqueueSnackbar('NonCompliant Risk creation failed! Please try again.', {
          variant: 'error',
        });
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
              Country Specific Information
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
              <Controller
                name="NonCompliantID"
                control={control}
                defaultValue=""
                render={({ field, fieldState: { error } }) => (
                  <RHFAutocomplete
                    {...field}
                    options={NonCompliantType}
                    getOptionLabel={(option) => option.NonCompliantName || ''}
                    isOptionEqualToValue={(option, value) => option.NonCompliantTypeID === value}
                    value={
                      NonCompliantType.find((init) => init.NonCompliantTypeID === field.value) ||
                      null
                    }
                    onChange={(event, newValue) => {
                      field.onChange(newValue ? newValue.NonCompliantTypeID : '');
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="NonCompliant"
                        variant="outlined"
                        fullWidth
                        error={!!error}
                        helperText={error ? error.message : ''}
                      />
                    )}
                  />
                )}
              />
              <RHFTextField
                name="NonCompliantRisk"
                label="Risk Factor"
                type="number"
                placeholder="0-5"
              />

              <RHFTextField
                name="Discription"
                label="Description"
                multiline
                minRows={3}
                sx={{ gridColumn: 'span 2' }}
              />
            </Box>
            {/* <Scrollbar sx={{ my: 3 }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell align="left">LkSG</TableCell>
                      <TableCell align="left">amfori PAs</TableCell>
                      <TableCell align="left">SDGs</TableCell>
                      <TableCell align="left">GRI</TableCell>
                      <TableCell align="center">EU ESRS</TableCell>
                      <TableCell align="center">ESG</TableCell>
                      <TableCell align="center">Rask Factor</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell align="left">2(2.1)Minimum age of work</TableCell>
                      <TableCell align="left">PA 8: No Child Labour</TableCell>
                      <TableCell align="left">8. Decent Work and economic growth</TableCell>
                      <TableCell align="left">
                        408-1 Operation and supplier at significant risk
                      </TableCell>
                      <TableCell align="left">ESRS 2 SBM-3 (b)</TableCell>
                      <TableCell align="left">Social</TableCell>
                      <TableCell align="center">
                        <TextField
                          placeholder="0-5"
                          variant="outlined"
                          sx={{ '& input': { textAlign: 'center' }, width: 100 }}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell align="left">2(2.1)Minimum age of work</TableCell>
                      <TableCell align="left">PA 8: No Child Labour</TableCell>
                      <TableCell align="left">8. Decent Work and economic growth</TableCell>
                      <TableCell align="left">
                        408-1 Operation and supplier at significant risk
                      </TableCell>
                      <TableCell align="left">ESRS 2 SBM-3 (b)</TableCell>
                      <TableCell align="left">Social</TableCell>
                      <TableCell align="center">
                        <TextField
                          placeholder="0-5"
                          variant="outlined"
                          sx={{ '& input': { textAlign: 'center' }, width: 100 }}
                        />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Scrollbar> */}
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
                type="submit"
                variant="contained"
                color="primary"
                loading={isSubmitting}
              >
                {!currentNonCompliantRisk ? 'Save Changes' : 'Save'}
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

NonCompliantRiskNewEditForm.propTypes = {
  currentNonCompliantRisk: PropTypes.object,
};
