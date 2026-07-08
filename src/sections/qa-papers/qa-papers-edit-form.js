import * as Yup from 'yup';
import PropTypes from 'prop-types';
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

export default function QaPapersEditForm({ surveyData, selectedQuestionnaireMstIDs }) {
  const userData = getDecryptedUserData();

  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();
  const [allQuestions, setAllQuestions] = useState([]);
  const [allCountries, setAllCountries] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState(selectedQuestionnaireMstIDs || []);
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
      Promise.all([GetProjectList(), GetCountryData(), GetPerformanceAreas()])
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
    defaultValues: {
      SurveyNo: '',
      // SurveyMarket: null,
      Context: '',
      Questionnaire: null,
      selectedQuestions: [],
      PerformanceArea: [],
      SurveyDateFrom: null,
      SurveyDateTo: null,
    },
  });

  // Watch form values
  const {
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = methods;
  const values = watch();

  // Populate form fields when `surveyData` changes
  useEffect(() => {
    if (surveyData) {
      setValue('SurveyNo', surveyData?.SurveyNo || '');
      // setValue(
      //   'SurveyMarket',
      //   allCountries.find((x) => x.Country_id === surveyData?.SurveyMarketID) || null
      // );
      setValue('Context', surveyData?.Context || '');
      setValue(
        'Questionnaire',
        projects.find((p) => p.ProjectID === surveyData?.ProjectID) || null
      );
      setValue(
        'SurveyDateFrom',
        surveyData?.SurveyDateFrom ? new Date(surveyData.SurveyDateFrom) : null
      );
      setValue('SurveyDateTo', surveyData?.SurveyDateTo ? new Date(surveyData.SurveyDateTo) : null);

      // Pre-fill selected questions
      if (selectedQuestionnaireMstIDs?.length) {
        setSelectedQuestions(selectedQuestionnaireMstIDs);
        setValue('selectedQuestions', selectedQuestionnaireMstIDs);
      }

      if (performanceAreas.length && surveyData.PerformanceAreas?.length) {
        const idSet = new Set(surveyData.PerformanceAreas.map((pa) => String(pa.PerformanceAreaID)));
        const matched = performanceAreas.filter((pa) => idSet.has(String(pa.PerformanceAreaID)));
        if (matched.length) setValue('PerformanceArea', matched);
      }
    }
  }, [surveyData, selectedQuestionnaireMstIDs, setValue, allCountries, projects, performanceAreas]);

  const GetQuestionnaireList = async () => {
    try {
      const response = await Get(
        `GetQuestionsByProject?CustomerID=${userData[0]?.CustomerId}&ProjectID=${values?.Questionnaire?.ProjectID}`
      );
      const decryptedData = decryptObjectKeys(response?.data?.ServiceRes);
      setAllQuestions(decryptedData);

      // Maintain selected questions
      const updatedSelection = decryptedData
        .map((q) => q.QuestionnaireMstID)
        .filter((id) => selectedQuestionnaireMstIDs.includes(id));

      setSelectedQuestions(updatedSelection);
      setValue('selectedQuestions', updatedSelection, { shouldValidate: true });
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
    const dataToSend = Array.from({ length: Number(data.selectedQuestions.length) }, (_, i) => ({
      SurveyNo: data.SurveyNo,
      SurveyMarketID: data?.SurveyMarket?.Country_id || '46',
      Context: data.Context,
      QuestionnaireMstID: data.selectedQuestions[i],
      SurveyDateFrom: format(new Date(data.SurveyDateFrom), 'yyyy-MM-dd'),
      SurveyDateTo: format(new Date(data.SurveyDateTo), 'yyyy-MM-dd'),
      UserID: userData[0]?.UserID || '',
    }));
    // console.log('dataToSend', dataToSend);

    const encryptedData = dataToSend.map((X) =>
      Object.assign(
        {},
        ...Object.keys(X).map((key) => ({
          [key]: encrypt(X[key]),
        }))
      )
    );
    // try {
    //   const detailResponse = await Post('InsertSurvey', encryptedData);
    //   if (detailResponse?.data?.ResponseCode === '100') {
    //     enqueueSnackbar('Survey created successfully.', { variant: 'success' });
    //     router.push(paths.dashboard.RiskAnalysis.RiskMitigation.papers.root);
    //   } else {
    //     enqueueSnackbar('Failed to create survey.', { variant: 'error' });
    //   }

    //   // enqueueSnackbar('Question Paper Created Successfully', { variant: 'success' });
    // } catch (error) {
    //   console.error(error);
    //   enqueueSnackbar('Failed to create survey.', { variant: 'error' });
    // }
  });

  // *************************Table Code *************************

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
              value={values?.SurveyNo || surveyData?.SurveyNo}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <RHFAutocomplete
              name="PerformanceArea"
              label="Performance Area"
              fullWidth
              multiple
              disabled
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
            <RHFTextField name="Context" label="Context" value={values?.Context} disabled />
          </Grid>
          <Grid item xs={12} md={6}>
            {' '}
            <RHFTextField
              name="Questionnaire"
              label="Questionnaire"
              value={
                projects?.find((p) => p.ProjectID === surveyData?.ProjectID)?.ProjectName || null
              }
              disabled
            />
          </Grid>

          {/* <Grid item xs={12} md={6}>
            <Controller
              name="Questionnaire"
              control={methods.control}
              render={({ field }) => (
                <RHFAutocomplete
                  {...field}
                  options={projects}
                  getOptionLabel={(option) => option?.ProjectName || ''}
                  isOptionEqualToValue={(option, value) => option?.ProjectID === value?.ProjectID}
                  // onChange={(_, newValue) => field.onChange(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Questionnaire"
                      disabled
                      placeholder="Choose an option"
                      fullWidth
                    />
                  )}
                />
              )}
            />
          </Grid> */}
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
                          selectedQuestionnaireMstIDs={selectedQuestionnaireMstIDs}
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
              disabled
              value={values.SurveyDateFrom}
              // onChange={(newValue) => setValue('SurveyDateFrom', newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  disabled
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
              disabled
              format="dd/MM/yyyy"
              value={values.SurveyDateTo}
              // onChange={(newValue) => setValue('SurveyDateTo', newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  disabled
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
        </Grid>
      </Card>
      {/* <Grid container justifyContent="flex-end" spacing={2} sx={{ mt: 2 }}>
        <Grid item>
          <Button type="submit" variant="contained" color="primary" disabled={true}>
            Update
          </Button>
        </Grid>
      </Grid> */}
    </FormProvider>
  );
}

QaPapersEditForm.propTypes = {
  surveyData: PropTypes.object,
  selectedQuestionnaireMstIDs: PropTypes.array,
};
