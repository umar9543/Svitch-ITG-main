'use client';
import React, { use, useEffect } from 'react';
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
import { decrypt, encrypt } from 'src/api/encryption';
import {
  emptyRows,
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  useTable,
} from 'src/components/table';
import DetailTableRow from './DetailTableRow';
import LawsMatrixQuickEditForm from './LawsMatrix-quick-edit-form';

// ----------------------------------------------------------------------

function getCurrentDate() {
  const today = new Date();

  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const year = today.getFullYear();

  return `${day}/${month}/${year}`;
}

export default function LawsMatrixNewEditForm({ currentLawsMatrix }) {
  const router = useRouter();
  const userData = getDecryptedUserData();

  const [Initiative, setInitiative] = useState([]);
  const [Laws, setLaws] = useState([]);
  const [PA, setPA] = useState([]);

  const [lawMatrixDetails, setLawMatrixDetails] = useState([]);
  const [lawDetail, setLawDetail] = useState({
    InitiativeDatabaseID: {
      InitiativeDatabaseID: '',
      Initiavtive: '',
    },
    LawDatabaseID: {
      LawDatabaseID: '',
      LawDescription: '',
    },
  });

  const { enqueueSnackbar } = useSnackbar();

  const NewLawsMatrixSchema = Yup.object().shape({
    PerformanceAreaID: Yup.string().required('Performance Area is required'),
    // LawDatabaseID: Yup.string().required('LawDatabaseID is required'),
    // LawNo: Yup.string().required('Law No is required'),
    // LawDescription: Yup.string().required('Law Description is required'),
    // Notes: Yup.string().required('Notes is required'),
    // InitiativeDatabaseID: Yup.string().required('Initiative Database is required'),
  });

  const GetInitiatives = async () => {
    try {
      const res = await Get(`GetInitiativeDatabase`);
      const decryptedData = decryptObjectKeys(res.data.ServiceRes);
      setInitiative(decryptedData);
    } catch (error) {
      console.error(error);
    }
  };
  const GetLawDatabase = async () => {
    try {
      const res = await Get(
        `GetLawDatabase_RiskMatrix?InitiativeDatabaseID=${lawDetail?.InitiativeDatabaseID?.InitiativeDatabaseID}`
      );
      const decryptedData = decryptObjectKeys(res.data.ServiceRes);
      setLaws(decryptedData);
    } catch (error) {
      console.error(error);
    }
  };
  const GetPerformanceArea = async () => {
    try {
      const res = await Get(`GetPerformanceArea_RiskMatrix`);
      if (res.data.ResponseCode == '100') {
        // console.log(decryptObjectKeys(res.data.ServiceRes));
        const Pa = decryptObjectKeys(res.data.ServiceRes);

        setPA(Pa);
      } else {
        enqueueSnackbar('No Performance Area Found!', { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar('There was an error processing your request!', { variant: 'error' });
      console.error(error);
    }
  };
  useEffect(() => {
    GetPerformanceArea();
    GetInitiatives();
  }, []);

  useEffect(() => {
    GetLawDatabase();
  }, [lawDetail?.InitiativeDatabaseID]);

  const defaultValues = useMemo(
    () => ({
      // LawDatabaseID: currentLawsMatrix?.LawDatabaseID || '',
      // LawNo: currentLawsMatrix?.LawNo || '',
      // LawDescription: currentLawsMatrix?.LawDescription || '',
      // Notes: currentLawsMatrix?.Notes || '',
      // InitiativeDatabaseID: currentLawsMatrix?.InitiativeDatabaseID || '',
      // currentDate: currentDate,
    }),
    [currentLawsMatrix]
  );

  const methods = useForm({
    resolver: yupResolver(NewLawsMatrixSchema),
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
    if (lawMatrixDetails.length === 0) {
      enqueueSnackbar('Please add details', { variant: 'error' });
      return;
    }
    try {
      const PostData = {
        PerformanceAreaID: values?.PerformanceAreaID,
        UserID: currentLawsMatrix?.UserID || userData[0]?.UserID,
      };
      const UpdatedData = {
        PerformanceAreaID: values?.PerformanceAreaID,
        UserID: currentLawsMatrix?.UserID || userData[0]?.UserID,
      };
      currentLawsMatrix
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
      if (currentLawsMatrix) {
        const response = await Put(`UpdateLawDatabase`, encryptedUpdatedData);
        if (response.data.ResponseCode === '100') {
          enqueueSnackbar('Initiative Law successfully updated');
          reset();
          router.push(paths.dashboard.RiskAnalysis.Riskframework.LawsMatrix.root);
        } else {
          enqueueSnackbar('Initiative Law update failed! Please try again.', { variant: 'error' });
        }
      } else {
        const response = await Post(`InsertRiskMatrixMst`, encryptedPostData);
        if (response.data.ResponseCode === '100') {
          // enqueueSnackbar('Initiative Law successfully created');
          console.log('InsertRiskMatrixMst', response.data.ServiceRes);
          const InsertDetailData = lawMatrixDetails.map((x) => ({
            RiskMatrixMstID: decrypt(response.data.ServiceRes[0]?.RiskMatrixMstID),
            InitiativeDatabaseID: x.InitiativeDatabaseID.InitiativeDatabaseID,
            LawDatabaseID: x.LawDatabaseID.LawDatabaseID,
          }));
          console.log('InsertDetailData', InsertDetailData);

          const encrypteInsertDetails = InsertDetailData.map((X) =>
            Object.assign(
              {},
              ...Object.keys(X).map((key) => ({
                [key]: encrypt(X[key]),
              }))
            )
          );
          await Post(`InsertRiskMatrixDtl`, encrypteInsertDetails);

          reset();
          enqueueSnackbar('Initiative Law successfully created', { variant: 'success' });
          router.push(paths.dashboard.RiskAnalysis.Riskframework.LawsMatrix.root);
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

  // Details Section
  const handleAddDetail = () => {
    if (lawDetail?.InitiativeDatabaseID === '') {
      enqueueSnackbar('Please select Initiative', { variant: 'error' });
      return;
    }
    if (lawDetail?.LawDatabaseID === '') {
      enqueueSnackbar('Please select Law', { variant: 'error' });
      return;
    }
    setLawMatrixDetails((prev) => [...prev, lawDetail]);
    setLawDetail({
      InitiativeDatabaseID: {
        InitiativeDatabaseID: '',
        Initiavtive: '',
      },
      LawDatabaseID: {
        LawDatabaseID: '',
        LawDescription: '',
      },
    });
  };

  // Table Heads
  const DetailsTableHead = [
    { id: 'InitiativeDatabaseID', label: 'Initiative' },
    { id: 'LawDatabaseID', label: 'Law' },
    { id: 'Actions', label: 'Actions', width: 88 },
  ];

  // Table
  const table = useTable();

  const notFound = !lawMatrixDetails.length;
  const denseHeight = table.dense ? 56 : 56 + 20;

  const DeleteDetailTableRow = (rowToDelete) => {
    const updatedDetails = lawMatrixDetails.filter((row) => row !== rowToDelete);

    setLawMatrixDetails(updatedDetails);
  };

  const EditDetailTableRow = (rowToEdit) => {
    setLawDetail(rowToEdit); // Update the row to edit
  };

  const onUpdateRow = (updatedRow) => {
    setLawMatrixDetails((prevDetails) =>
      prevDetails.map((row) =>
        row.InitiativeDatabaseID.InitiativeDatabaseID ===
        updatedRow.InitiativeDatabaseID.InitiativeDatabaseID
          ? updatedRow
          : row
      )
    );
  };

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Add Risk Matrix
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
                name="PerformanceAreaID"
                control={control}
                defaultValue=""
                render={({ field, fieldState: { error } }) => (
                  <RHFAutocomplete
                    {...field}
                    options={PA}
                    getOptionLabel={(option) => option.Name || ''}
                    isOptionEqualToValue={(option, value) => option.PerformanceAreaID === value}
                    value={PA.find((init) => init.PerformanceAreaID === field.value) || null}
                    onChange={(event, newValue) => {
                      field.onChange(newValue ? newValue.PerformanceAreaID : '');
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Performance Area (PA)"
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
          </Card>
          <Card sx={{ p: 3, mt: 2 }}>
            <Box sx={{ width: '100%' }}>
              <h3>Law Matrix Details: </h3>
              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                  // md: 'repeat(3, 1fr)',
                }}
              >
                <RHFAutocomplete
                  name="InitiativeDatabaseID"
                  label="Initiative"
                  placeholder="Choose an option"
                  fullWidth
                  options={Initiative}
                  value={lawDetail?.InitiativeDatabaseID || ''}
                  getOptionLabel={(option) => option?.Initiavtive || ''}
                  onChange={(event, value) =>
                    setLawDetail({
                      ...lawDetail,
                      InitiativeDatabaseID: value,
                      LawDatabaseID: { LawDatabaseID: '', LawDescription: '' },
                    })
                  }
                />
                <RHFAutocomplete
                  name="LawDatabaseID"
                  label="Law"
                  placeholder="Choose an option"
                  fullWidth
                  options={Laws}
                  value={lawDetail?.LawDatabaseID || ''}
                  getOptionLabel={(option) => option?.LawDescription || ''}
                  onChange={(event, value) =>
                    setLawDetail({
                      ...lawDetail,
                      LawDatabaseID: value ? value : { LawDatabaseID: '', LawDescription: '' },
                    })
                  }
                />
              </Box>
              <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                <Button color="primary" onClick={handleAddDetail} variant="contained">
                  Add Detail
                </Button>
              </Stack>

              {/* Conditional Table Render */}

              {lawMatrixDetails.length > 0 && (
                <Scrollbar>
                  <Table
                    size={table.dense ? 'small' : 'medium'}
                    sx={{
                      minWidth: 960,
                      mt: 4,
                      border: 1,
                      borderColor: '#f4f6f8',
                      borderStyle: 'dotted',
                    }}
                  >
                    <TableHeadCustom
                      order={table.order}
                      orderBy={table.orderBy}
                      headLabel={DetailsTableHead}
                    />

                    <TableBody>
                      {lawMatrixDetails.map((row, id) => (
                        <>
                          <DetailTableRow
                            key={id}
                            row={row}
                            onDeleteRow={() => DeleteDetailTableRow(row)}
                            onEditRow={() => EditDetailTableRow(row)}
                            onUpdateRow={onUpdateRow}
                          />
                        </>
                      ))}

                      <TableEmptyRows
                        height={denseHeight}
                        emptyRows={emptyRows(
                          table.page,
                          table.rowsPerPage,
                          lawMatrixDetails.length
                        )}
                      />

                      <TableNoData notFound={notFound} />
                    </TableBody>
                  </Table>
                </Scrollbar>
              )}
            </Box>
          </Card>
          <Stack alignItems="flex-end" sx={{ mt: 3 }}>
            <LoadingButton type="submit" variant="contained" color="primary" loading={isSubmitting}>
              {!currentLawsMatrix ? 'Save Changes' : 'Save Changes'}
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

LawsMatrixNewEditForm.propTypes = {
  currentLawsMatrix: PropTypes.object,
};
