import * as Yup from 'yup';
import { useMemo, useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'src/components/snackbar';
import { Get, Post } from 'src/utils/AxiosHelper';
import { decryptObjectKeys } from 'src/utils/getDecryption';
import { LoadingScreen } from 'src/components/loading-screen';
import {
  Card,
  Grid,
  Button,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from '@mui/material';
import FormProvider, { RHFAutocomplete, RHFTextField } from 'src/components/hook-form';
import { getDecryptedUserData } from 'src/utils/getUser';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import {
  emptyRows,
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  useTable,
} from 'src/components/table';
import Scrollbar from 'src/components/scrollbar';
import DetailTableRow from './detail-table-row';
import { format } from 'date-fns';
import { paths } from 'src/routes/paths';
import { useRouter } from 'next/navigation';
import { decrypt, encrypt } from 'src/api/encryption';
import Editor from 'src/components/editor';

function generateCode(lastNumber) {
  const prefix = 'QAS'; // Constant prefix
  const year = new Date().getFullYear().toString().slice(-2); // Current year (last two digits)

  // If userArray has entries, find the highest InquiryNo and increment it
  if (lastNumber !== null) {
    const lastSerial = parseInt(lastNumber?.split('-')[2], 10); // Extract the serial number (e.g., 002 -> 2)
    const nextSerial = lastSerial + 1; // Increment serial number
    const formattedSerial = nextSerial.toString().padStart(3, '0'); // Ensure at least 3 digits
    return `${prefix}-${year}-${formattedSerial}`;
  }
  return `${prefix}-${year}-001`;
  // Extract the highest serial number
}

export default function QaPapersNewEditForm() {
  const userData = getDecryptedUserData();

  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();
  const [allQuestions, setAllQuestions] = useState([]);
  const [allCountries, setAllCountries] = useState([]);
  const [lastSurveyNo, setLastSurveyNo] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [performanceAreas, setPerformanceAreas] = useState([]);

  const GetProjectList = async () => {
    const response = await Get(`GetProjectList?CustomerID=${userData[0]?.CustomerId}`);
    const decryptedData = decryptObjectKeys(response?.data?.ServiceRes);
    setProjects(decryptedData);
  };

  const GetCountryData = async () => {
    try {
      const res = await Get(`GetCountry?UserID=${userData[0]?.UserID}`);
      const decryptedData = decryptObjectKeys(res.data.ServiceRes);
      setAllCountries(decryptedData); // Assuming you're setting the filtered data here
    } catch (error) {
      console.error(error);
    }
  };
  const GetLastSurveyNo = async () => {
    try {
      const res = await Get(`GetLastSurveyNo`);
      const decryptedData = res.data.SurveyNo;
      setLastSurveyNo(decryptedData); // Assuming you're setting the filtered data here
    } catch (error) {
      console.error(error);
      setLastSurveyNo(null); // Assuming you're setting the filtered data here
    }
  };
  const GetPerformanceAreas = async () => {
    try {
      const res = await Get('GetPerformanceArea');
      const decrypted = decryptObjectKeys(res?.data?.ServiceRes ?? []);
      setPerformanceAreas(Array.isArray(decrypted) ? decrypted : []);
    } catch (e) {
      setPerformanceAreas([]);
    }
  };

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      Promise.all([GetLastSurveyNo(), GetProjectList(), GetCountryData(), GetPerformanceAreas()])
        .then(() => {
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
        });
    };
    fetch();
  }, [userData[0]?.CustomerId]);

  // Validation Schema Fix
  const NewQaPapersSchema = Yup.object().shape({
    // SurveyMarket: Yup.object().required('Survey Market is required'),
    Context: Yup.string().required('Context is required'),
    Questionnaire: Yup.object().required('Questionnaire is required'),
    selectedQuestions: Yup.array().min(1, 'Select at least one question'),
    SurveyDateFrom: Yup.date()
      .nullable()
      .required('Survey Date From is required')
      .typeError('Invalid date'),
    SurveyDateTo: Yup.date()
      .nullable()
      .required('Survey Date To is required')
      .typeError('Invalid date')
      .min(Yup.ref('SurveyDateFrom'), 'Survey Date To must be after or equal to Survey Date From'),
  });

  const methods = useForm({
    resolver: yupResolver(NewQaPapersSchema),
    defaultValues: useMemo(
      () => ({
        SurveyNo: generateCode(lastSurveyNo),
        // SurveyMarket: null,
        Questionnaire: null,
        selectedQuestions: [],
        PerformanceArea: [],
      }),
      [lastSurveyNo, generateCode]
    ),
  });

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = methods;
  const values = watch();

  useEffect(() => {
    if (lastSurveyNo) {
      setValue('SurveyNo', generateCode(lastSurveyNo));
    }
  }, [lastSurveyNo, setValue]);

  const GetQuestionnaireList = async () => {
    try {
      const response = await Get(
        `GetQuestionsByProject?CustomerID=${userData[0]?.CustomerId}&ProjectID=${values?.Questionnaire?.ProjectID}`
      );
      const decryptedData = decryptObjectKeys(response?.data?.ServiceRes);
      setAllQuestions(decryptedData);
      setSelectedQuestions(decryptedData.map((q) => q.QuestionnaireMstID)); // Select all by default
      setValue(
        'selectedQuestions',
        decryptedData.map((q) => q.QuestionnaireMstID),
        { shouldValidate: true }
      );
    } catch (error) {
      setAllQuestions([]);
      setSelectedQuestions([]);
      setValue('selectedQuestions', []);
    }
  };
  useEffect(() => {
    if (values?.Questionnaire?.ProjectID) {
      GetQuestionnaireList();
    }
  }, [values?.Questionnaire?.ProjectID]);

  const onSubmit = handleSubmit(async (data) => {
    const performanceAreaIDs = (data.PerformanceArea ?? []).map(
      (pa) => encrypt(String(pa?.PerformanceAreaID ?? pa?.performanceAreaId ?? ''))
    );

    const detailBody = Array.from({ length: Number(data.selectedQuestions.length) }, (_, i) => {
      const row = {
        SurveyNo: data.SurveyNo,
        SurveyMarketID: data?.SurveyMarket?.Country_id || '46',
        Context: data.Context,
        QuestionnaireMstID: data.selectedQuestions[i],
        SurveyDateFrom: format(new Date(data.SurveyDateFrom), 'yyyy-MM-dd'),
        SurveyDateTo: format(new Date(data.SurveyDateTo), 'yyyy-MM-dd'),
        UserID: userData[0]?.UserID || '',
      };
      return Object.assign(
        {},
        ...Object.keys(row).map((key) => ({ [key]: encrypt(row[key]) }))
      );
    });

    const encryptedPayload = {
      PerformanceAreaIDs: performanceAreaIDs,
      DetailBody: detailBody,
    };

    try {
      const detailResponse = await Post('InsertSurvey', encryptedPayload);
      if (detailResponse?.data?.ResponseCode === '100') {
        enqueueSnackbar('Survey created successfully.', { variant: 'success' });
        router.push(paths.dashboard.RiskAnalysis.RiskMitigation.papers.root);
      } else {
        enqueueSnackbar('Failed to create survey.', { variant: 'error' });
      }

      // enqueueSnackbar('Question Paper Created Successfully', { variant: 'success' });
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Failed to create survey.', { variant: 'error' });
    }
  });

  // *************************Tablee Code *************************

  // Handle question selection
  const handleQuestionSelect = (id) => {
    setSelectedQuestions((prev) => {
      const updated = prev.includes(id) ? prev.filter((q) => q !== id) : [...prev, id];
      setValue('selectedQuestions', updated, { shouldValidate: true });
      return updated;
    });
  };

  const QuestionTableHead = [
    { id: 'Select', label: 'Select' },
    { id: 'Title', label: 'Title' },
    { id: 'Question', label: 'Question' },
  ];
  const table = useTable();

  const notFound = !allQuestions.length;
  const denseHeight = table.dense ? 56 : 56 + 20;

  const dataInPage = allQuestions.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  return loading ? (
    <LoadingScreen sx={{ height: 300 }} />
  ) : (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Card sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6">Create a Question Paper</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <RHFTextField
              name="SurveyNo"
              label="Survey No."
              disabled
              InputLabelProps={{ shrink: true }}
              value={values?.SurveyNo}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <RHFAutocomplete
              name="PerformanceArea"
              label="Performance Area"
              fullWidth
              multiple
              limitTags={2}
              options={performanceAreas}
              getOptionLabel={(option) => option?.Name ?? option?.name ?? ''}
              isOptionEqualToValue={(a, b) =>
                (a?.PerformanceAreaID ?? a?.performanceAreaId) ===
                (b?.PerformanceAreaID ?? b?.performanceAreaId)
              }
              renderOption={(props, option) => {
                const paId = option?.PerformanceAreaID ?? option?.performanceAreaId;
                const isChecked = values.PerformanceArea?.some(
                  (s) => (s?.PerformanceAreaID ?? s?.performanceAreaId) === paId
                );
                return (
                  <li {...props} key={paId}>
                    <Checkbox size="small" disableRipple checked={isChecked} />
                    {option?.Name ?? option?.name ?? ''}
                  </li>
                );
              }}
              renderTags={(selected, getTagProps) =>
                selected.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={option?.PerformanceAreaID ?? option?.performanceAreaId}
                    label={option?.Name ?? option?.name ?? ''}
                    size="small"
                    variant="soft"
                    color="primary"
                  />
                ))
              }
            />
          </Grid>
          <Grid item xs={12}>
            <RHFTextField name="Context" label="Context" value={values?.Context} />
          </Grid>
          <Grid item xs={12} md={6}>
            <RHFAutocomplete
              name="Questionnaire"
              label="Questionnaire"
              placeholder="Choose an option"
              fullWidth
              options={projects}
              value={projects?.find(
                (option) => option?.ProjectID === values?.Questionnaire?.ProjectID
              )}
              getOptionLabel={(option) => option?.ProjectName}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Select Questions ({selectedQuestions.length})
            </Typography>
            {/* {allQuestions.length > 0 && (
              <> */}
            <TableContainer component={Paper}>
              <Scrollbar>
                <Table
                  size={table.dense ? 'small' : 'medium'}
                  sx={{
                    minWidth: 960,

                    border: 1,
                    borderColor: '#f4f6f8',
                    borderStyle: 'dotted',
                  }}
                >
                  <TableHeadCustom
                    order={table.order}
                    orderBy={table.orderBy}
                    headLabel={QuestionTableHead}
                    onSort={table.onSort}
                  />

                  <TableBody>
                    {allQuestions
                      .slice(
                        table.page * table.rowsPerPage,
                        table.page * table.rowsPerPage + table.rowsPerPage
                      )
                      .map((row, id) => (
                        <DetailTableRow
                          key={row.QuestionnaireMstID}
                          row={row}
                          selectedQuestions={selectedQuestions}
                          handleQuestionSelect={handleQuestionSelect}
                        />
                      ))}

                    <TableEmptyRows
                      height={denseHeight}
                      emptyRows={emptyRows(table.page, table.rowsPerPage, allQuestions.length)}
                    />

                    <TableNoData notFound={notFound} />
                  </TableBody>
                </Table>
              </Scrollbar>
              {methods.formState.errors.selectedQuestions && (
                <Typography color="error" variant="body2">
                  {methods.formState.errors.selectedQuestions.message}
                </Typography>
              )}
            </TableContainer>
            <TablePaginationCustom
              count={allQuestions.length}
              page={table.page}
              rowsPerPage={table.rowsPerPage}
              onPageChange={table.onChangePage}
              onRowsPerPageChange={table.onChangeRowsPerPage}
              //
              dense={table.dense}
              onChangeDense={table.onChangeDense}
            />
            {/* </>
            )} */}
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Select Survey Date
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <DesktopDatePicker
              sx={{ width: '100%' }}
              label="Survey Date From"
              format="dd/MM/yyyy"
              value={values.SurveyDateFrom}
              onChange={(newValue) => setValue('SurveyDateFrom', newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  error={!!methods.formState.errors.SurveyDateFrom}
                  helperText={methods.formState.errors.SurveyDateFrom?.message}
                />
              )}
            />
            <Typography color="error" variant="caption" sx={{ pl: 2 }}>
              {methods.formState.errors.SurveyDateFrom?.message}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <DesktopDatePicker
              sx={{ width: '100%' }}
              label="Survey Date To"
              format="dd/MM/yyyy"
              value={values.SurveyDateTo}
              onChange={(newValue) => setValue('SurveyDateTo', newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  error={!!methods.formState.errors.SurveyDateTo}
                  helperText={methods.formState.errors.SurveyDateTo?.message}
                />
              )}
            />
            <Typography color="error" variant="caption" sx={{ pl: 2 }}>
              {methods.formState.errors.SurveyDateTo?.message}
            </Typography>
          </Grid>

          {/* <Grid item xs={12} md={12}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Welcome Message
            </Typography>
            <Editor
              simple
              id="WelcomeMessage"
              value={values.WelcomeMessage}
              onChange={(value) => setValue('WelcomeMessage', value)}
              placeholder="Write a welcome message here..."
            />
          </Grid> */}
        </Grid>
      </Card>
      <Grid container justifyContent="flex-end" spacing={2} sx={{ mt: 2 }}>
        <Grid item>
          <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
            Save
          </Button>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
