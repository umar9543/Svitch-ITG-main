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
import { encrypt } from 'src/api/encryption';
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

export default function QuestionnaireMatrixNewEditForm({ currentQuestionnaireMatrix }) {
  const router = useRouter();
  const userData = getDecryptedUserData();

  const [Initiative, setInitiative] = useState([]);

  const { enqueueSnackbar } = useSnackbar();

  const NewQuestionnaireMatrixSchema = Yup.object().shape({
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
      // LawDatabaseID: currentQuestionnaireMatrix?.LawDatabaseID || '',
      LawNo: currentQuestionnaireMatrix?.LawNo || '',
      LawDescription: currentQuestionnaireMatrix?.LawDescription || '',
      Notes: currentQuestionnaireMatrix?.Notes || '',
      InitiativeDatabaseID: currentQuestionnaireMatrix?.InitiativeDatabaseID || '',

      // currentDate: currentDate,
    }),
    [currentQuestionnaireMatrix]
  );

  const methods = useForm({
    resolver: yupResolver(NewQuestionnaireMatrixSchema),
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
      const PostData = {
        ...data,
        UserID: currentQuestionnaireMatrix?.UserID || userData[0].UserId,
      };
      const UpdatedData = { ...data, LawDatabaseID: currentQuestionnaireMatrix?.LawDatabaseID };

      currentQuestionnaireMatrix
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

      // if (currentQuestionnaireMatrix) {
      //   const response = await Put(`UpdateLawDatabase`, encryptedUpdatedData);
      //   if (response.data.ResponseCode === '100') {
      //     enqueueSnackbar('Initiative Law successfully updated');
      //     reset();

      //     router.push(paths.dashboard.RiskAnalysis.QuestionnaireMatrix.root);
      //   } else {
      //     enqueueSnackbar('Initiative Law update failed! Please try again.', { variant: 'error' });
      //   }
      // } else {
      //   const response = await Post(`InsertLawDatabase`, encryptedPostData);
      //   if (response.data.ResponseCode === '100') {
      //     enqueueSnackbar('Initiative Law successfully created');
      //     reset();

      //     router.push(paths.dashboard.RiskAnalysis.QuestionnaireMatrix.root);
      //   } else {
      //     enqueueSnackbar('Initiative Law creation failed! Please try again.', {
      //       variant: 'error',
      //     });
      //   }
      // }
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
            <Typography variant="h6" gutterBottom>
              Country Specific Information
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

              <Controller
                name="Questionnaire"
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
                        label="Questionnaire"
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
                name="LawDescription"
                label="Description"
                multiline
                minRows={3}
                sx={{ gridColumn: 'span 2' }}
              />
            </Box>
            <Scrollbar sx={{ my: 3 }}>
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
            </Scrollbar>
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
                {!currentQuestionnaireMatrix ? 'Save Changes' : 'Save Changes'}
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

QuestionnaireMatrixNewEditForm.propTypes = {
  currentQuestionnaireMatrix: PropTypes.object,
};
