'use client';

import isEqual from 'lodash/isEqual';
import { useState, useCallback, useEffect } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { _roles, _kpiList, AUDIT_KPI_STATUS_OPTIONS } from 'src/_mock';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSnackbar } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import QaQuestionariesTableRow from '../qa-questionaries-table-row';
import QaQuestionariesTableToolbar from '../qa-questionaries-table-toolbar';
import QaQuestionariesTableFiltersResult from '../qa-questionaries-table-filters-result';
import { Delete, Get } from 'src/utils/AxiosHelper';
import { decryptObjectKeys } from 'src/utils/getDecryption';
import { getDecryptedUserData } from 'src/utils/getUser';
import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [{ value: 'all', label: 'All' }, ...AUDIT_KPI_STATUS_OPTIONS];

const TABLE_HEAD = [
  { id: 'Question', label: 'Question', minWidth: 260, maxWidth: 300 },
  { id: 'ProjectName', label: 'Questionnaire', minWidth: 120 },
  { id: 'Title', label: 'Title', width: 200 },
  { id: 'CreationDate', label: 'Creation Date', minWidth: 160 },
  { id: '', minWidth: 88 },
];

const defaultFilters = {
  name: '',
  role: [],
  status: 'all',
};

// ----------------------------------------------------------------------

export default function QaQuestionariesListView() {
  const { enqueueSnackbar } = useSnackbar();
  const userData = getDecryptedUserData();

  const table = useTable();

  const settings = useSettingsContext();

  const router = useRouter();

  const confirm = useBoolean();

  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState(defaultFilters);

  const GetQuestionnaireList = async () => {
    const response = await Get(`GetQuestionnaireList?CustomerID=${userData[0]?.CustomerId}`);
    const decryptedData = decryptObjectKeys(response?.data?.ServiceRes);

    // Convert CreationDate to Date object
    const formattedData = decryptedData.map((item) => ({
      ...item,
      CreationDate: new Date(item.CreationDate),
    }));

    setTableData(formattedData);
  };

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      await GetQuestionnaireList();
      setLoading(false);
    };
    fetch();
  }, []);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const uniqueRoles = [...new Set(tableData.map((kpi) => kpi.Title))];

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 56 : 56 + 20;

  const canReset = !isEqual(defaultFilters, filters);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleFilters = useCallback(
    (name, value) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handleDeleteRow = useCallback(
    async (data) => {
      if(data?.IsQuestionUsed !== '0'){
        enqueueSnackbar('This Question is already used in Survey, cannot be deleted!', {variant:"warning"});
        return;
      }
      try {
        const res = await Delete(`DeleteQuestionnaire?QuestionnaireMstID=${data?.QuestionnaireMstID}`);
        enqueueSnackbar('Delete success!');
      } catch (error) {
        console.error('Error deleting row:', error);
      }

      GetQuestionnaireList();
    },
    [dataInPage.length, enqueueSnackbar, table, tableData]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));

    enqueueSnackbar('Delete success!');

    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, enqueueSnackbar, table, tableData]);

  const handleEditRow = useCallback(
    (data) => {
      if(data?.IsQuestionUsed !== '0'){
        enqueueSnackbar('This Question is already used in Survey, cannot be updated!', {variant:"warning"});
        return;
      }
      router.push(paths.dashboard.RiskAnalysis.RiskMitigation.questionaries.edit(data?.QuestionnaireMstID));
    },
    [router]
  );

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );

  const renderLoading = <LoadingScreen sx={{ height: { xs: 200, md: 300 } }} />;

  if (loading) {
    return renderLoading;
  }

  return (
    <>
      <Card>
        {/* <Tabs
            value={filters.status}
            onChange={handleFilterStatus}
            sx={{
              px: 2.5,
              boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
            }}
          >
            {STATUS_OPTIONS.map((tab) => (
              <Tab
                key={tab.value}
                iconPosition="end"
                value={tab.value}
                label={tab.label}
                icon={
                  <Label
                    variant={
                      ((tab.value === 'all' || tab.value === filters.status) && 'filled') || 'soft'
                    }
                    color={
                      (tab.value === 'active' && 'success') ||
                      (tab.value === 'pending' && 'warning') ||
                      (tab.value === 'banned' && 'error') ||
                      'default'
                    }
                  >
                    {['active', 'pending', 'banned', 'rejected'].includes(tab.value)
                      ? tableData.filter((kpi) => kpi.status === tab.value).length
                      : tableData.length}
                  </Label>
                }
              />
            ))}
          </Tabs> */}

        <QaQuestionariesTableToolbar
          filters={filters}
          onFilters={handleFilters}
          //
          roleOptions={uniqueRoles}
        />

        {canReset && (
          <QaQuestionariesTableFiltersResult
            filters={filters}
            onFilters={handleFilters}
            //
            onResetFilters={handleResetFilters}
            //
            results={dataFiltered.length}
            sx={{ p: 2.5, pt: 0 }}
          />
        )}

        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <TableSelectedAction
            dense={table.dense}
            numSelected={table.selected.length}
            rowCount={dataFiltered.length}
            onSelectAllRows={(checked) =>
              table.onSelectAllRows(
                checked,
                dataFiltered.map((row) => row.id)
              )
            }
            action={
              <Tooltip title="Delete">
                <IconButton color="primary" onClick={confirm.onTrue}>
                  <Iconify icon="solar:trash-bin-trash-bold" />
                </IconButton>
              </Tooltip>
            }
          />

          <Scrollbar>
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headLabel={TABLE_HEAD}
                rowCount={dataFiltered.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                // onSelectAllRows={(checked) =>
                //   table.onSelectAllRows(
                //     checked,
                //     dataFiltered.map((row) => row.id)
                //   )
                // }
              />

              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <QaQuestionariesTableRow
                      key={row.QuestionnaireMstID}
                      row={row}
                      selected={table.selected.includes(row.QuestionnaireMstID)}
                      onSelectRow={() => table.onSelectRow(row.QuestionnaireMstID)}
                      onDeleteRow={() => handleDeleteRow(row)}
                      onEditRow={() => handleEditRow(row)}
                    />
                  ))}

                <TableEmptyRows
                  height={denseHeight}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                />

                <TableNoData notFound={notFound} />
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        <TablePaginationCustom
          count={dataFiltered.length}
          page={table.page}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onRowsPerPageChange={table.onChangeRowsPerPage}
          //
          dense={table.dense}
          onChangeDense={table.onChangeDense}
        />
      </Card>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              handleDeleteRows();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters }) {
  const { name, status, role } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (kpi) =>
        kpi.Question.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        kpi.ProjectName.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        kpi.Title.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((kpi) => kpi.status === status);
  }

  if (role.length) {
    inputData = inputData.filter((kpi) => role.includes(kpi.Title));
  }

  return inputData;
}
